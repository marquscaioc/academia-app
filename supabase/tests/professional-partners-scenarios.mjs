// Imported by the official DB runner; all checks execute real Postgres RLS.
export async function runProfessionalPartnerScenarios({ as, asSuper, check, expectError, eq, U }) {
  const insert = (user, owner = user, phone = "5511999991234") => as(user,
    "INSERT INTO public.professional_partners(trainer_id,full_name,profession,specialty,whatsapp_number) VALUES($1,'Ana','nutritionist','Esportiva',$2) RETURNING id",
    [owner, phone]);
  let partner;
  const visible = async (user) => (await as(user, "SELECT id FROM public.professional_partners WHERE id=$1", [partner])).rows.length;
  await check("partners: trainer creates own directory entry", async () => { partner = (await insert(U.trainerA)).rows[0].id; });
  await check("partners: linked student reads referral; other tenant cannot", async () => {
    eq(await visible(U.studentA), 1, "linked student");
    for (const user of [U.studentB, U.trainerB]) eq(await visible(user), 0, "other tenant");
  });
  await check("partners: students and foreign owners cannot create referrals", async () => {
    await expectError(insert(U.studentA), "student cannot own a directory");
    await expectError(insert(U.trainerB, U.trainerA), "foreign owner");
  });
  await check("partners: student writes, foreign deletes, and ownership transfer denied", async () => {
    eq((await as(U.studentA, "UPDATE public.professional_partners SET full_name='Forged' WHERE id=$1 RETURNING id", [partner])).rows.length, 0, "student update");
    eq((await as(U.trainerB, "DELETE FROM public.professional_partners WHERE id=$1 RETURNING id", [partner])).rows.length, 0, "foreign delete");
    await expectError(as(U.trainerA, "UPDATE public.professional_partners SET trainer_id=$1 WHERE id=$2", [U.trainerB, partner]), "ownership transfer");
  });
  await check("partners: inactive referral is hidden but owner can edit", async () => {
    await as(U.trainerA, "UPDATE public.professional_partners SET is_active=false WHERE id=$1", [partner]);
    eq(await visible(U.studentA), 0, "hidden from student");
    eq(await visible(U.trainerA), 1, "owner can edit");
    await as(U.trainerA, "UPDATE public.professional_partners SET is_active=true WHERE id=$1", [partner]);
  });
  await check("partners: pausing relationship revokes referral access", async () => {
    await asSuper("UPDATE public.trainer_students SET status='paused' WHERE trainer_id=$1 AND student_id=$2", [U.trainerA, U.studentA]);
    try { eq(await visible(U.studentA), 0, "paused relationship"); }
    finally { await asSuper("UPDATE public.trainer_students SET status='active' WHERE trainer_id=$1 AND student_id=$2", [U.trainerA, U.studentA]); }
  });
  await check("partners: database rejects malformed contact and executable/credential URLs", async () => {
    for (const phone of ["invalid", "0123456789", null]) await expectError(insert(U.trainerA, U.trainerA, phone), "invalid phone or missing contact");
    for (const url of ["javascript:alert(1)", "http://example.com", "https://user:pass@example.com", "https://example.com/path with spaces"]) {
      await expectError(as(U.trainerA, "UPDATE public.professional_partners SET booking_url=$1 WHERE id=$2", [url, partner]), "invalid booking URL");
    }
  });
  await check("partners: explicit trainer WhatsApp is visible only to linked student and owner", async () => {
    await asSuper("INSERT INTO public.trainer_profiles(id) VALUES($1) ON CONFLICT(id) DO NOTHING", [U.trainerA]);
    await as(U.trainerA, "UPDATE public.trainer_profiles SET contact_whatsapp='5511999991234' WHERE id=$1", [U.trainerA]);
    eq((await as(U.studentA, "SELECT contact_whatsapp FROM public.trainer_profiles WHERE id=$1", [U.trainerA])).rows[0]?.contact_whatsapp, "5511999991234", "published contact");
    eq((await as(U.studentB, "SELECT id FROM public.trainer_profiles WHERE id=$1", [U.trainerA])).rows.length, 0, "foreign tenant");
    eq((await as(U.studentA, "UPDATE public.trainer_profiles SET contact_whatsapp=NULL WHERE id=$1 RETURNING id", [U.trainerA])).rows.length, 0, "student cannot overwrite");
  });
  await check("partners: anonymous role has no directory grant", async () => {
    eq((await asSuper("SELECT has_table_privilege('anon','public.professional_partners','SELECT') AS allowed")).rows[0].allowed, false, "anonymous table privilege");
  });
  await check("partners: trainer removes own referral", async () => {
    eq((await as(U.trainerA, "DELETE FROM public.professional_partners WHERE id=$1 RETURNING id", [partner])).rows.length, 1, "owner delete");
  });
}
