export async function runWorkoutEditScenarios({ as, asSuper, check, expectError, eq, U, exercise }) {
  const create = async () => (await as(U.trainerA, "SELECT public.create_workout_plan($1, 'Editar', 'Descrição', $2::jsonb) AS id", [
    U.studentA, JSON.stringify([{ name: "A", notes: "Orientação", exercises: [{ exercise_id: exercise }, { exercise_id: exercise }] },
      { name: "B", exercises: [{ exercise_id: exercise }] }]),
  ])).rows[0].id;
  const version = async (id) => (await asSuper("SELECT updated_at::text AS v FROM public.workout_plans WHERE id=$1", [id])).rows[0].v;
  const shape = async (id) => (await asSuper(`SELECT w.*, (SELECT jsonb_agg(to_jsonb(e) ORDER BY e.sort_order) FROM public.workout_exercises e WHERE e.workout_id=w.id) AS exercises
    FROM public.workouts w WHERE w.plan_id=$1 ORDER BY w.sort_order`, [id])).rows;
  const save = (user, id, v, workouts) => as(user, "SELECT public.update_workout_plan($1, $2::timestamptz, 'Alterado', 'Nova descrição', $3::jsonb)", [id, v, JSON.stringify(workouts)]);

  await check("edit plan: reorder keeps prescription IDs, metadata and finished history; removed workout detaches history", async () => {
    const id = await create();
    const rows = await shape(id);
    const session = (await asSuper("INSERT INTO public.workout_sessions(user_id,workout_id,started_at,finished_at) VALUES($1,$2,now()-interval '3 days',now()-interval '3 days'+interval '1 hour') RETURNING id", [U.studentA, rows[0].id])).rows[0].id;
    await asSuper("INSERT INTO public.workout_session_sets(session_id,workout_exercise_id,exercise_id,set_number,reps,weight_kg) VALUES($1,$2,$3,1,8,50)", [session, rows[0].exercises[0].id, exercise]);
    const removedSession = (await asSuper("INSERT INTO public.workout_sessions(user_id,workout_id,finished_at) VALUES($1,$2,now()) RETURNING id", [U.studentA, rows[1].id])).rows[0].id;
    const kept = rows[0].exercises[1];
    await save(U.trainerA, id, await version(id), [{ ...rows[0], exercises: [{ ...kept, target_sets: 5, notes: "Controlar descida" },
      { exercise_id: exercise, target_sets: 3, target_reps: "8", rest_seconds: 60 }] }]);
    const after = await shape(id);
    eq(after.length, 1, "removed workout");
    eq([after[0].id, after[0].notes, after[0].exercises[0].id, after[0].exercises[0].target_sets], [rows[0].id, "Orientação", kept.id, 5], "kept prescription");
    const historic = (await asSuper("SELECT workout_exercise_id,exercise_id,reps,weight_kg::text FROM public.workout_session_sets WHERE session_id=$1", [session])).rows[0];
    eq([historic.workout_exercise_id, historic.exercise_id, historic.reps, Number(historic.weight_kg)], [null, exercise, 8, 50], "removed exercise preserves actuals");
    eq((await asSuper("SELECT workout_id FROM public.workout_sessions WHERE id=$1", [removedSession])).rows[0].workout_id, null, "removed workout history");
  });

  await check("edit plan: stale editor, another trainer and student cannot overwrite", async () => {
    const id = await create(); const v = await version(id); const rows = await shape(id);
    await save(U.trainerA, id, v, rows);
    await expectError(save(U.trainerA, id, v, rows), "stale version accepted");
    await expectError(save(U.trainerB, id, await version(id), rows), "other trainer accepted");
    await expectError(save(U.studentA, id, await version(id), rows), "student accepted");
  });

  await check("edit plan: invalid values, duplicate IDs and foreign prescription roll back entire transaction", async () => {
    const id = await create(); const v = await version(id); const rows = await shape(id);
    const foreignId = await create(); const foreign = (await shape(foreignId))[0];
    await expectError(save(U.trainerA, id, v, [{ ...rows[0], name: "Should roll back" }, { ...rows[1], exercises: [{ ...rows[1].exercises[0], target_sets: 0 }] }]));
    eq((await asSuper("SELECT name,updated_at::text AS v FROM public.workout_plans WHERE id=$1", [id])).rows[0], { name: "Editar", v }, "plan rollback");
    eq((await shape(id))[0].name, "A", "workout rollback");
    await expectError(save(U.trainerA, id, v, [rows[0], rows[0]]), "duplicate workout accepted");
    await expectError(save(U.trainerA, id, v, [foreign]), "foreign workout accepted");
    await expectError(save(U.trainerA, id, v, [{ ...rows[0], exercises: [foreign.exercises[0]] }]), "foreign prescription accepted");
    const privateEx = (await asSuper("INSERT INTO public.exercises(name,created_by,is_global) VALUES('Privado',$1,false) RETURNING id", [U.trainerB])).rows[0].id;
    await expectError(save(U.trainerA, id, v, [{ ...rows[0], exercises: [{ exercise_id: privateEx, target_sets: 3, target_reps: "8", rest_seconds: 60 }] }]), "invisible exercise accepted");
    await expectError(save(U.trainerA, id, v, [{ ...rows[0], exercises: [rows[0].exercises[0], rows[0].exercises[0]] }]), "duplicate prescription accepted");
  });

  await check("edit plan: protects an active workout until it is finished", async () => {
    const id = await create(); const rows = await shape(id);
    const session = (await as(U.studentA, "INSERT INTO public.workout_sessions(user_id,workout_id) VALUES($1,$2) RETURNING id", [U.studentA, rows[0].id])).rows[0].id;
    await expectError(save(U.trainerA, id, await version(id), rows), "active session edited");
    await as(U.studentA, "UPDATE public.workout_sessions SET finished_at=now() WHERE id=$1", [session]);
    await save(U.trainerA, id, await version(id), rows);
  });
}
