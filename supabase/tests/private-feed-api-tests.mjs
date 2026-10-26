// Real Storage/GoTrue/PostgREST checks; called only by the local-only API runner.
export async function runPrivateFeedApiTests({ admin, student, trainer, otherTrainer, attacker, run, png, uploaded, check, assert }) {
  const upload = async (suffix) => {
    const path = `${student.id}/${run}-feed-${suffix}.png`;
    const { error } = await student.client.storage.from("feed-media").upload(path, png);
    assert(!error, error?.message);
    uploaded.push(["feed-media", path]);
    return path;
  };
  const sign = (user, path) => user.client.storage.from("feed-media").createSignedUrl(path, 60);
  const readable = async (user, path) => {
    const { data, error } = await sign(user, path);
    assert(!error && data?.signedUrl, error?.message ?? "missing signed URL");
    const response = await fetch(data.signedUrl);
    assert(response.ok, `signed download failed: HTTP ${response.status}`);
  };
  const denied = async (user, path) => {
    const { data, error } = await sign(user, path);
    assert(error && !data?.signedUrl, "unauthorized user obtained a signed URL");
  };
  const post = async (visibility, path, extra = {}) => {
    const { data, error } = await admin.from("feed_posts").insert({
      author_id: student.id, visibility, media_urls: [path], ...extra,
    }).select("id").single();
    assert(!error && data?.id, error?.message ?? "post not created");
    return data.id;
  };

  await check("private feed Storage: author signs; outsider and anonymous public route denied", async () => {
    const path = await upload("private");
    await post("private", path);
    await readable(student, path);
    await denied(attacker, path);
    await denied(trainer, path);
    const { data: { publicUrl } } = student.client.storage.from("feed-media").getPublicUrl(path);
    const response = await fetch(publicUrl);
    assert(!response.ok, `anonymous public URL exposed private photo: HTTP ${response.status}`);
    await post("public", path, { author_id: attacker.id });
    await denied(attacker, path); // A guessed path cannot be laundered via own post.
  });

  await check("feed Storage supports legacy public URLs, followers and linked-trainer posts", async () => {
    const publicPath = await upload("legacy");
    const { data: { publicUrl } } = student.client.storage.from("feed-media").getPublicUrl(publicPath);
    await post("public", publicUrl);
    const normalized = await attacker.client.rpc("feed_media_path", { p_value: publicUrl });
    assert(!normalized.error && normalized.data === publicPath, normalized.error?.message ?? "legacy URL path mismatch");
    await readable(attacker, normalized.data);
    const followerPath = await upload("follower");
    await post("followers", followerPath);
    await denied(attacker, followerPath);
    const follow = await attacker.client.from("user_follows").insert({ follower_id: attacker.id, following_id: student.id });
    assert(!follow.error, follow.error?.message);
    await readable(attacker, followerPath);
    const unfollow = await attacker.client.from("user_follows").delete().eq("follower_id", attacker.id).eq("following_id", student.id);
    assert(!unfollow.error, unfollow.error?.message);
    await denied(attacker, followerPath);
    const trainerPath = await upload("trainer");
    await post("trainers_only", trainerPath);
    await readable(trainer, trainerPath);
    await denied(otherTrainer, trainerPath);
  });

  await check("private group media signs only for members; leaving revokes future signing", async () => {
    const { data: group, error } = await student.client.from("groups").insert({
      created_by: student.id, name: `Private Storage group ${run}`, is_public: false,
    }).select("id").single();
    assert(!error && group, error?.message);
    const path = await upload("group");
    const postId = await post("public", path, { group_id: group.id });
    const hidden = await otherTrainer.client.from("feed_posts").select("id").eq("id", postId);
    assert(!hidden.error && hidden.data?.length === 0, hidden.error?.message ?? "private group post exposed");
    await denied(otherTrainer, path);
    const member = await student.client.from("group_members").insert({ group_id: group.id, user_id: attacker.id });
    assert(!member.error, member.error?.message);
    await readable(attacker, path);
    const leave = await attacker.client.from("group_members").delete().eq("group_id", group.id).eq("user_id", attacker.id);
    assert(!leave.error, leave.error?.message);
    await denied(attacker, path);
  });

  await check("challenge photo Storage: participants/creator sign, other tenant and former members denied", async () => {
    const { data: challenge, error } = await admin.from("challenges").insert({
      created_by: trainer.id, title: `Photo Storage ${run}`, is_public: false,
      starts_at: new Date(Date.now() - 86400000).toISOString(),
      ends_at: new Date(Date.now() + 86400000).toISOString(),
      scoring_mode: "check_in_count", require_photo_proof: true,
    }).select("id").single();
    assert(!error && challenge, error?.message);
    const members = await admin.from("challenge_participants").insert([
      { challenge_id: challenge.id, user_id: student.id },
      { challenge_id: challenge.id, user_id: attacker.id },
    ]);
    assert(!members.error, members.error?.message);
    const path = await upload("challenge");
    const entry = await student.client.from("challenge_entries").insert({ challenge_id: challenge.id, user_id: student.id, photo_url: path });
    assert(!entry.error, entry.error?.message);
    await readable(attacker, path);
    await readable(trainer, path);
    await denied(otherTrainer, path);
    const leave = await attacker.client.from("challenge_participants").delete().eq("challenge_id", challenge.id).eq("user_id", attacker.id);
    assert(!leave.error, leave.error?.message);
    await denied(attacker, path);
  });
}
