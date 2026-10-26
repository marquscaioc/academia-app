// Included by run-db-tests.mjs after its fixtures and Storage grants.
export async function runPrivateFeedScenarios({ as, asSuper, U, check, eq }) {
  const visible = async (user, name) =>
    (await as(user, "SELECT name FROM storage.objects WHERE bucket_id = 'feed-media' AND name = $1", [name])).rows.length;
  const object = async (suffix) => {
    const name = `${U.studentA}/private-feed-${suffix}.jpg`;
    await asSuper("INSERT INTO storage.objects (bucket_id, name) VALUES ('feed-media', $1)", [name]);
    return name;
  };
  const post = async (visibility, path, extra = {}) => (
    await asSuper("INSERT INTO public.feed_posts (author_id, visibility, media_urls, group_id) VALUES ($1, $2, $3, $4) RETURNING id", [
      extra.author ?? U.studentA, visibility, [path], extra.group ?? null,
    ])
  ).rows[0].id;

  await check("feed-media is private; orphan objects visible only to uploader", async () => {
    eq((await asSuper("SELECT public FROM storage.buckets WHERE id = 'feed-media'")).rows[0].public, false, "private bucket");
    const path = await object("orphan");
    eq(await visible(U.studentA, path), 1, "uploader before publication");
    eq(await visible(U.trainerA, path), 0, "trainer cannot read orphan photos");
    eq(await visible(U.attacker, path), 0, "outsider cannot read orphan photos");
    eq((await as(U.studentA, "DELETE FROM storage.objects WHERE name = $1 RETURNING id", [path])).rows.length, 1, "own cleanup");
  });

  await check("feed media follows post visibility, legacy URLs and active trainer/follower scope", async () => {
    const publicPath = await object("public");
    await post("public", `https://project.supabase.co/storage/v1/object/public/feed-media/${publicPath}`);
    eq(await visible(U.attacker, publicPath), 1, "legacy public post media");
    const privatePath = await object("private");
    await post("private", privatePath);
    eq(await visible(U.trainerA, privatePath), 0, "private means author only");
    eq(await visible(U.studentA, privatePath), 1, "author's private photo");
    const trainerPath = await object("trainer");
    await post("trainers_only", trainerPath);
    eq(await visible(U.trainerA, trainerPath), 1, "active linked trainer");
    eq(await visible(U.trainerB, trainerPath), 0, "other trainer");
    const followerPath = await object("follower");
    await post("followers", followerPath);
    eq(await visible(U.studentB, followerPath), 0, "non-follower");
    await asSuper("INSERT INTO public.user_follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [U.studentB, U.studentA]);
    eq(await visible(U.studentB, followerPath), 1, "follower");
    await asSuper("DELETE FROM public.user_follows WHERE follower_id = $1 AND following_id = $2", [U.studentB, U.studentA]);
    eq(await visible(U.studentB, followerPath), 0, "revoked following");
    // Publishing someone else's guessed path must not grant access to it.
    await post("public", privatePath, { author: U.attacker });
    eq(await visible(U.attacker, privatePath), 0, "cross-author path cannot launder private media");
  });

  await check("private group posts and photos require group access and revoke after leaving", async () => {
    const group = (await asSuper("INSERT INTO public.groups (created_by, name, is_public) VALUES ($1, 'Storage private group', false) RETURNING id", [U.studentA])).rows[0].id;
    const path = await object("group");
    const id = await post("public", path, { group });
    eq((await as(U.attacker, "SELECT id FROM public.feed_posts WHERE id = $1", [id])).rows.length, 0, "private group post");
    eq(await visible(U.attacker, path), 0, "private group image");
    await asSuper("INSERT INTO public.group_members (group_id, user_id) VALUES ($1, $2)", [group, U.studentB]);
    eq((await as(U.studentB, "SELECT id FROM public.groups WHERE id = $1", [group])).rows.length, 1, "member group read without recursion");
    eq(await visible(U.studentB, path), 1, "member image read");
    await as(U.studentB, "DELETE FROM public.group_members WHERE group_id = $1 AND user_id = $2", [group, U.studentB]);
    eq(await visible(U.studentB, path), 0, "former member image read");
  });

  await check("challenge photo signing follows participant/creator access", async () => {
    const challenge = (await asSuper(`INSERT INTO public.challenges
      (created_by, title, starts_at, ends_at, scoring_mode, require_photo_proof, is_public)
      VALUES ($1, 'Private photo proof', now() - interval '1 day', now() + interval '1 day', 'check_in_count', true, false) RETURNING id`, [U.trainerA])).rows[0].id;
    await asSuper("INSERT INTO public.challenge_participants (challenge_id, user_id) VALUES ($1, $2), ($1, $3)", [challenge, U.studentA, U.studentB]);
    const path = await object("challenge");
    await as(U.studentA, "INSERT INTO public.challenge_entries (challenge_id, user_id, photo_url) VALUES ($1, $2, $3)", [challenge, U.studentA, path]);
    eq(await visible(U.studentB, path), 1, "challenge peer");
    eq(await visible(U.trainerA, path), 1, "challenge creator");
    eq(await visible(U.trainerB, path), 0, "other trainer challenge image");
    await as(U.studentB, "DELETE FROM public.challenge_participants WHERE challenge_id = $1 AND user_id = $2", [challenge, U.studentB]);
    eq(await visible(U.studentB, path), 0, "former challenge participant");
  });
}
