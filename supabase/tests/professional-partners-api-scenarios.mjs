// Real GoTrue/PostgREST checks; import only from the existing local-only API runner.
export async function runProfessionalPartnerApiScenarios({ admin, trainer, otherTrainer, student, attacker, check, assert, run }) {
  const must = ({ data, error }) => { if (error) throw error; return data; };
  const payload = (owner = trainer.id) => ({
    trainer_id: owner, full_name: `Referral ${run}`, profession: "nutritionist",
    specialty: "Nutrição esportiva", registration: "CRN teste", whatsapp_number: "5511999991234",
    booking_url: "https://agenda.example.com/consulta", content_url: "https://example.com/conteudos", is_active: true,
  });
  let partner;
  const read = async (user) => must(await user.client.from("professional_partners").select("id,full_name,specialty,whatsapp_number,booking_url,content_url,is_active").eq("id", partner));
  await check("partners API: trainer creates referral; linked student reads actual professional fields", async () => {
    partner = must(await trainer.client.from("professional_partners").insert(payload()).select("id").single()).id;
    const rows = await read(student);
    assert(rows?.length === 1 && rows[0].whatsapp_number === "5511999991234" && rows[0].booking_url === "https://agenda.example.com/consulta", "student did not receive published fields");
  });
  await check("partners API: outsider/other trainer cannot read or write another tenant directory", async () => {
    for (const user of [attacker, otherTrainer]) assert((await read(user)).length === 0, "cross-tenant read allowed");
    const studentInsert = await student.client.from("professional_partners").insert(payload(student.id));
    assert(studentInsert.error, "student created a directory");
    const foreignInsert = await otherTrainer.client.from("professional_partners").insert(payload());
    assert(foreignInsert.error, "trainer created partner for another tenant");
    const tamper = must(await student.client.from("professional_partners").update({ full_name: "Forged" }).eq("id", partner).select("id"));
    assert(tamper.length === 0, "student changed referral");
    const transfer = await trainer.client.from("professional_partners").update({ trainer_id: otherTrainer.id }).eq("id", partner);
    assert(transfer.error, "tenant transfer permitted");
  });
  await check("partners API: hiding and pausing revoke student access", async () => {
    must(await trainer.client.from("professional_partners").update({ is_active: false }).eq("id", partner));
    assert((await read(student)).length === 0, "inactive referral exposed");
    assert((await read(trainer)).length === 1, "owner lost inactive referral");
    must(await trainer.client.from("professional_partners").update({ is_active: true }).eq("id", partner));
    must(await admin.from("trainer_students").update({ status: "paused" }).eq("trainer_id", trainer.id).eq("student_id", student.id));
    try { assert((await read(student)).length === 0, "paused student retains access"); }
    finally { must(await admin.from("trainer_students").update({ status: "active" }).eq("trainer_id", trainer.id).eq("student_id", student.id)); }
  });
  await check("partners API: server rejects malformed WhatsApp and executable scheduling links", async () => {
    for (const values of [{ whatsapp_number: "invalid" }, { booking_url: "javascript:alert(1)" }, { booking_url: "https://user:pass@example.com" }, { whatsapp_number: null, booking_url: null }]) {
      const result = await trainer.client.from("professional_partners").update(values).eq("id", partner);
      assert(result.error, "invalid contact saved");
    }
  });
  await check("partners API: explicit trainer WhatsApp publishing and student write protection", async () => {
    must(await trainer.client.from("trainer_profiles").upsert({ id: trainer.id, contact_whatsapp: "5511999991234" }));
    const published = must(await student.client.from("trainer_profiles").select("id,contact_whatsapp").eq("id", trainer.id).single());
    assert(published.contact_whatsapp === "5511999991234", "trainer contact missing");
    const foreign = must(await otherTrainer.client.from("trainer_profiles").select("id").eq("id", trainer.id));
    assert(foreign.length === 0, "contact exposed to foreign tenant");
    const edit = must(await student.client.from("trainer_profiles").update({ contact_whatsapp: null }).eq("id", trainer.id).select("id"));
    assert(edit.length === 0, "student changed trainer contact");
    must(await trainer.client.from("trainer_profiles").update({ contact_whatsapp: null }).eq("id", trainer.id));
    must(await trainer.client.from("professional_partners").delete().eq("id", partner));
    assert((await read(student)).length === 0, "deleted referral remains visible");
  });
}
