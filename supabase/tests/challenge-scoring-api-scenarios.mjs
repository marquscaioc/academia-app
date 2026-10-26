import crypto from 'node:crypto';

// Real PostgREST concurrency tests. Run only through api-integration.mjs, whose
// existing local-only guard and fixture cleanup are mandatory.
export async function runChallengeScoringApiScenarios({ admin, trainer, student, attacker, check, assert }) {
  const must = ({ data, error }) => {
    if (error) throw error;
    return data;
  };
  const challenge = async (mode) => must(await admin.from('challenges').insert({
    created_by: trainer.id, trainer_id: trainer.id, title: 'API scoring test', scoring_mode: mode,
    starts_at: new Date(Date.now() - 86400000).toISOString(),
    ends_at: new Date(Date.now() + 86400000).toISOString(), require_photo_proof: false,
  }).select('id').single()).id;
  const join = async (id) => must(await student.client.from('challenge_participants').insert({ challenge_id: id, user_id: student.id }));
  const score = async (id) => must(await admin.from('challenge_participants').select('total_score,check_in_count')
    .eq('challenge_id', id).eq('user_id', student.id).single());

  await check('challenge API: concurrent custom-rule entries enforce daily cap and score atomically', async () => {
    const id = await challenge('custom_points'); await join(id);
    const rule = must(await admin.from('challenge_point_rules').insert({
      challenge_id: id, activity_type: 'custom', label: 'Activity', points: 7, max_per_day: 1,
    }).select('id').single());
    const payload = () => ({ id: crypto.randomUUID(), challenge_id: id, user_id: student.id,
      point_rule_id: rule.id, points: 99999, created_at: '2000-01-01T00:00:00Z', verified: true });
    const results = await Promise.all([1, 2].map(() => student.client.from('challenge_entries').insert(payload()).select('id,points,verified')));
    assert(results.filter((r) => !r.error).length === 1, 'exactly one concurrent request must succeed');
    const accepted = results.find((r) => !r.error).data[0];
    assert(Number(accepted.points) === 7 && accepted.verified === false, 'server must derive score and verification');
    const s = await score(id);
    assert(Number(s.total_score) === 7 && s.check_in_count === 1, 'score/count mismatch after concurrent insert');
  });

  await check('challenge API: concurrent duplicate request IDs never add a second score; retry reads saved entry', async () => {
    const id = await challenge('check_in_count'); await join(id);
    const payload = { id: crypto.randomUUID(), challenge_id: id, user_id: student.id };
    const results = await Promise.all([1, 2].map(() => student.client.from('challenge_entries').insert(payload).select('id')));
    assert(results.filter((r) => !r.error).length === 1, 'duplicate request ID must only insert once');
    const existing = must(await student.client.from('challenge_entries').select('id,points').eq('id', payload.id).maybeSingle());
    assert(existing?.id === payload.id && Number(existing.points) === 1, 'uncertain response retry must find saved entry');
    const s = await score(id);
    assert(Number(s.total_score) === 1 && s.check_in_count === 1, 'duplicate request scored twice');
    const direct = await student.client.from('challenge_participants').update({ total_score: 9999 }).eq('challenge_id', id);
    assert(direct.error, 'direct score update must be denied');
    const rpc = await student.client.rpc('increment_challenge_score', { p_challenge_id: id, p_user_id: student.id, p_points: 9999 });
    assert(rpc.error, 'legacy arbitrary increment RPC must be denied');
  });

  await check('challenge API: other user and unfinished sessions cannot score; session replay denied', async () => {
    const id = await challenge('workouts_completed'); await join(id);
    const session = async (user, finished) => must(await admin.from('workout_sessions').insert({
      user_id: user, started_at: new Date(Date.now() - 3600000).toISOString(),
      finished_at: finished ? new Date(Date.now() - 1800000).toISOString() : null,
    }).select('id').single()).id;
    const post = (sessionId) => student.client.from('challenge_entries').insert({
      challenge_id: id, user_id: student.id, workout_session_id: sessionId,
    });
    assert((await post(await session(attacker.id, true))).error, 'other user session accepted');
    assert((await post(await session(student.id, false))).error, 'unfinished session accepted');
    const s = await session(student.id, true);
    must(await post(s));
    assert((await post(s)).error, 'session replay accepted');
    const saved = await score(id);
    assert(Number(saved.total_score) === 1 && saved.check_in_count === 1, 'session validation changed score incorrectly');
  });
}
