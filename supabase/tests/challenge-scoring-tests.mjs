// Invoked by run-db-tests with its real Postgres/RLS helpers.
export async function runChallengeScoringTests({ asSuper, as, check, expectError, eq, U }) {
  const challenge = async (mode, extra = {}) => (await asSuper(
    `INSERT INTO public.challenges(created_by,title,scoring_mode,starts_at,ends_at,require_photo_proof,trainer_id)
     VALUES ($1,'Scoring test',$2,now()-interval '2 days',now()+interval '2 days',$3,$1) RETURNING id`,
    [U.trainerA, mode, extra.photo ?? false],
  )).rows[0].id;
  const join = (c) => as(U.studentA, 'INSERT INTO public.challenge_participants(challenge_id,user_id) VALUES ($1,$2)', [c, U.studentA]);
  const entry = (c, rule = null, session = null, extra = {}) => as(U.studentA,
    `INSERT INTO public.challenge_entries(challenge_id,user_id,point_rule_id,workout_session_id,points,created_at,verified,photo_url)
     VALUES ($1,$2,$3,$4,99999,'2001-01-01',true,$5) RETURNING id,points,created_at,verified`,
    [c, U.studentA, rule, session, extra.photo ?? null]);
  const score = async (c) => (await asSuper(
    'SELECT total_score::float8 AS score,check_in_count AS n FROM public.challenge_participants WHERE challenge_id=$1 AND user_id=$2',
    [c, U.studentA],
  )).rows[0];
  const rule = async (c, points = 7, max = 1) => (await asSuper(
    "INSERT INTO public.challenge_point_rules(challenge_id,activity_type,label,points,max_per_day) VALUES ($1,'custom','Atividade',$2,$3) RETURNING id",
    [c, points, max],
  )).rows[0].id;
  const session = async (user = U.studentA, finished = true) => (await asSuper(
    `INSERT INTO public.workout_sessions(user_id,started_at,finished_at) VALUES ($1,now()-interval '60 minutes',CASE WHEN $2 THEN now()-interval '30 minutes' END) RETURNING id`,
    [user, finished],
  )).rows[0].id;

  await check('challenge scoring: custom rule owns points, timestamp, verification; daily cap and wrong-rule rejection', async () => {
    const c = await challenge('custom_points'); await join(c);
    const r = await rule(c);
    const inserted = (await entry(c, r)).rows[0];
    eq(Number(inserted.points), 7, 'server rule points');
    eq(inserted.verified, false, 'never automatically verified');
    if (new Date(inserted.created_at).getFullYear() < 2026) throw new Error('timestamp was caller-controlled');
    eq(await score(c), { score: 7, n: 1 }, 'atomic score and count');
    await expectError(entry(c, r), 'daily cap');
    const foreign = await rule(await challenge('custom_points'));
    await expectError(entry(c, foreign), 'rule from another challenge');
    await expectError(entry(c), 'rule required');
    eq(await score(c), { score: 7, n: 1 }, 'failed inserts do not score');
    await expectError(as(U.studentA, 'SELECT public.increment_challenge_score($1,$2,50)', [c,U.studentA]), 'legacy increment revoked');
    await expectError(as(U.studentA, 'UPDATE public.challenge_participants SET total_score=999 WHERE challenge_id=$1', [c]), 'direct participant score denied');
  });

  await check('challenge scoring: daily cap survives forged timestamps and leaving/rejoining', async () => {
    const c = await challenge('days_active'); await join(c); await entry(c);
    await expectError(entry(c), 'one UTC day');
    await as(U.studentA, 'DELETE FROM public.challenge_participants WHERE challenge_id=$1', [c]);
    await join(c);
    eq(await score(c), { score: 1, n: 1 }, 'ledger restored');
    await expectError(entry(c), 'rejoining cannot bypass daily cap');
  });

  await check('challenge scoring: sessions must belong to caller, be finished and within dates; reuse rejected', async () => {
    const c = await challenge('workouts_completed'); await join(c);
    await expectError(entry(c, null, await session(U.studentB)), 'other user session');
    await expectError(entry(c, null, await session(U.studentA, false)), 'unfinished session');
    const old = (await asSuper("INSERT INTO public.workout_sessions(user_id,started_at,finished_at) VALUES ($1,now()-interval '5 days',now()-interval '4 days') RETURNING id", [U.studentA])).rows[0].id;
    await expectError(entry(c, null, old), 'outside window');
    const s = await session();
    eq(Number((await entry(c, null, s)).rows[0].points), 1, 'completed workout = 1');
    await expectError(entry(c, null, s), 'session reused');
    eq(await score(c), { score: 1, n: 1 }, 'no extra scores');
  });

  await check('challenge scoring: volume excludes warmups and minutes derive from session timestamps', async () => {
    const s = await session();
    const ex = (await asSuper("INSERT INTO public.exercises(name,is_global) VALUES ('Scoring exercise',true) RETURNING id")).rows[0].id;
    await asSuper(`INSERT INTO public.workout_session_sets(session_id,exercise_id,set_number,reps,weight_kg,is_warmup)
      VALUES ($1,$2,1,10,20,false),($1,$2,2,10,50,true)`, [s,ex]);
    const volume = await challenge('total_volume'); await join(volume);
    eq(Number((await entry(volume,null,s)).rows[0].points),200,'non-warmup volume');
    const minutes = await challenge('active_minutes'); await join(minutes);
    eq(Number((await entry(minutes,null,s)).rows[0].points),30,'elapsed minutes');
  });

  await check('challenge scoring: private team score follows entries, switches and leave; scores cannot be forged', async () => {
    const c = await challenge('check_in_count'); await join(c);
    const team = async (name) => (await as(U.trainerA, 'INSERT INTO public.challenge_teams(challenge_id,name,total_score,member_count) VALUES ($1,$2,999,999) RETURNING id,total_score,member_count', [c,name])).rows[0];
    const a = await team('A'); const b = await team('B');
    eq([Number(a.total_score),a.member_count],[0,0],'zero initial team aggregates');
    await as(U.studentA,'UPDATE public.challenge_participants SET team_id=$1 WHERE challenge_id=$2',[a.id,c]);
    await entry(c);
    const teamScore = async (id) => (await asSuper('SELECT total_score::float8 AS score,member_count AS n FROM public.challenge_teams WHERE id=$1',[id])).rows[0];
    eq(await teamScore(a.id),{score:1,n:1},'entry scores team');
    await as(U.studentA,'UPDATE public.challenge_participants SET team_id=$1 WHERE challenge_id=$2',[b.id,c]);
    eq(await teamScore(a.id),{score:0,n:0},'old team cleared');
    eq(await teamScore(b.id),{score:1,n:1},'new team includes score');
    await expectError(as(U.trainerA,'UPDATE public.challenge_teams SET total_score=100 WHERE id=$1',[a.id]),'owner cannot forge team score');
    await expectError(as(U.studentA,'SELECT public.increment_team_score($1,100)',[b.id]),'legacy team score revoked');
    await as(U.studentA,'DELETE FROM public.challenge_participants WHERE challenge_id=$1',[c]);
    eq(await teamScore(b.id),{score:0,n:0},'leave removes score');
  });

  await check('challenge scoring: duplicate request id cannot score twice; inactive and photo-less entries rejected', async () => {
    const c = await challenge('check_in_count'); await join(c);
    const saved = (await entry(c)).rows[0];
    await expectError(as(U.studentA,'INSERT INTO public.challenge_entries(id,challenge_id,user_id) VALUES ($1,$2,$3)',[saved.id,c,U.studentA]),'duplicate request id');
    eq(await score(c),{score:1,n:1},'no duplicate score');
    await asSuper("UPDATE public.challenges SET ends_at=now()-interval '1 hour' WHERE id=$1",[c]);
    await expectError(entry(c),'ended');
    const photo = await challenge('check_in_count',{photo:true}); await join(photo);
    await expectError(entry(photo),'photo required');
    await expectError(entry(photo,null,null,{photo:`${U.studentB}/photo.jpg`}),'other user photo');
    await expectError(entry(photo,null,null,{photo:`${U.studentA}/photo.jpg`}),'missing uploaded object');
    await asSuper("INSERT INTO storage.objects(bucket_id,name,owner) VALUES ('feed-media',$1,$2)",[`${U.studentA}/photo.jpg`,U.studentA]);
    await entry(photo,null,null,{photo:`${U.studentA}/photo.jpg`});
  });
}
