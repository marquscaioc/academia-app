export async function runWorkoutEditApiTests({ admin, trainer, otherTrainer, student, ex, check, assert }) {
  await check("plan editor API: ID-preserving save, stale/foreign rejection and history retention", async () => {
    const { data: id, error: createError } = await trainer.client.rpc("create_workout_plan", {
      p_student_id: student.id, p_name: "Editor API", p_description: "Original",
      p_workouts: [{ name: "A", exercises: [{ exercise_id: ex.id }, { exercise_id: ex.id }] }],
    });
    assert(!createError && id, createError?.message ?? "no plan");
    const get = async () => {
      const { data, error } = await trainer.client.from("workout_plans")
        .select("*,workouts(*,exercises:workout_exercises(*))").eq("id", id).single();
      assert(!error && data, error?.message ?? "no plan detail");
      return data;
    };
    const before = await get(); const workout = before.workouts[0]; const first = workout.exercises[0];
    const { data: session, error: startError } = await student.client.from("workout_sessions")
      .insert({ user_id: student.id, workout_id: workout.id }).select().single();
    assert(!startError && session, startError?.message);
    const payload = { p_plan_id: id, p_expected_updated_at: before.updated_at, p_name: "Editado API", p_description: "Atualizado",
      p_workouts: [{ ...workout, exercises: [{ ...workout.exercises[1], target_sets: 5, notes: "Controlar descida" }] }] };
    const busy = await trainer.client.rpc("update_workout_plan", payload);
    assert(busy.error?.code === "55000", `active workout edit ${busy.error?.message}`);
    const { error: setError } = await student.client.from("workout_session_sets")
      .insert({ session_id: session.id, workout_exercise_id: first.id, exercise_id: ex.id, set_number: 1, reps: 8, weight_kg: 55 });
    assert(!setError, setError?.message);
    await student.client.from("workout_sessions").update({ finished_at: new Date().toISOString() }).eq("id", session.id);
    const saved = await trainer.client.rpc("update_workout_plan", payload);
    assert(!saved.error && saved.data === id, saved.error?.message ?? "not saved");
    const after = await get(); const prescription = after.workouts[0].exercises[0];
    assert(after.workouts[0].id === workout.id && prescription.id === workout.exercises[1].id && prescription.target_sets === 5 && prescription.notes === "Controlar descida", "prescription identity/notes lost");
    const { data: history } = await student.client.from("workout_session_sets").select().eq("session_id", session.id).single();
    assert(history?.workout_exercise_id === null && history.reps === 8 && Number(history.weight_kg) === 55, "history lost");
    const stale = await trainer.client.rpc("update_workout_plan", payload);
    assert(stale.error?.code === "40001", "stale edit accepted");
    const denied = await otherTrainer.client.rpc("update_workout_plan", { ...payload, p_expected_updated_at: after.updated_at });
    assert(denied.error, "other trainer edited plan");
    const studentDenied = await student.client.rpc("update_workout_plan", { ...payload, p_expected_updated_at: after.updated_at });
    assert(studentDenied.error, "student edited prescription");
    const bad = await trainer.client.rpc("update_workout_plan", { ...payload, p_expected_updated_at: after.updated_at,
      p_workouts: [{ ...after.workouts[0], exercises: [{ ...prescription, target_sets: 0 }] }] });
    assert(bad.error, "invalid draft saved");
    assert((await get()).updated_at === after.updated_at, "failed edit changed version");
    // Existing shared cleanup deletes this trainer's plans and users.
    void admin;
  });
}
