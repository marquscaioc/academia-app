export async function runCourseAccessScenarios({ asSuper, as, check, expectError, eq, U }) {
  const make = async ({ published = true, free = true } = {}) => (await as(U.trainerA,
    'INSERT INTO public.courses(trainer_id,title,is_published,is_free) VALUES ($1,$2,$3,$4) RETURNING id',
    [U.trainerA, 'Course access test', published, free],
  )).rows[0].id;
  const lesson = async (course, free = false) => (await as(U.trainerA,
    'INSERT INTO public.lessons(course_id,title,is_free) VALUES ($1,$2,$3) RETURNING id', [course, 'Lesson', free],
  )).rows[0].id;

  await check('courses: only trainer owners write; linked students see free lessons and paid previews only', async () => {
    await expectError(as(U.studentA, "INSERT INTO public.courses(trainer_id,title) VALUES ($1,'Spoof')", [U.studentA]), 'student author');
    const c = await make(); const l = await lesson(c);
    eq((await as(U.studentA, 'SELECT id FROM public.lessons WHERE id=$1', [l])).rows.length, 1, 'linked free course lesson');
    eq((await as(U.studentB, 'SELECT id FROM public.courses WHERE id=$1', [c])).rows.length, 0, 'other tenant course');
    eq((await as(U.trainerB, 'UPDATE public.courses SET title=\'Stolen\' WHERE id=$1 RETURNING id', [c])).rows.length, 0, 'other trainer write');
    const paid = await make({ free: false }); const locked = await lesson(paid); const preview = await lesson(paid, true);
    eq((await as(U.studentA, 'SELECT id FROM public.lessons WHERE course_id=$1 ORDER BY id', [paid])).rows.map((r) => r.id), [preview], 'only preview');
    eq((await as(U.trainerA, 'SELECT id FROM public.lessons WHERE id=$1', [locked])).rows.length, 1, 'owner sees paid');
    const draft = await make({ published: false }); const dl = await lesson(draft);
    eq((await as(U.studentA, 'SELECT id FROM public.lessons WHERE id=$1', [dl])).rows.length, 0, 'draft hidden');
  });

  await check('courses: progress upsert idempotent, inaccessible lessons rejected, trainer loses progress access on unlink', async () => {
    const c = await make(); const l = await lesson(c);
    for (let i=0; i<2; i++) await as(U.studentA,
      `INSERT INTO public.lesson_progress(user_id,lesson_id,completed,watched_seconds) VALUES ($1,$2,true,10)
       ON CONFLICT(user_id,lesson_id) DO UPDATE SET completed=true`, [U.studentA,l]);
    eq((await asSuper('SELECT count(*)::int AS n FROM public.lesson_progress WHERE lesson_id=$1', [l])).rows[0].n,1,'one progress row');
    const paid = await make({free:false}); const locked = await lesson(paid);
    await expectError(as(U.studentA,'INSERT INTO public.lesson_progress(user_id,lesson_id,completed) VALUES ($1,$2,true)',[U.studentA,locked]),'paid lesson progress');
    await expectError(as(U.studentB,'INSERT INTO public.lesson_progress(user_id,lesson_id,completed) VALUES ($1,$2,true)',[U.studentB,l]),'other tenant progress');
    eq((await as(U.trainerA,'SELECT id FROM public.lesson_progress WHERE lesson_id=$1',[l])).rows.length,1,'trainer sees current student progress');
    await asSuper("UPDATE public.trainer_students SET status='paused' WHERE trainer_id=$1 AND student_id=$2",[U.trainerA,U.studentA]);
    eq((await as(U.trainerA,'SELECT id FROM public.lesson_progress WHERE lesson_id=$1',[l])).rows.length,0,'former trainer loses progress access');
    await expectError(as(U.studentA,'UPDATE public.lesson_progress SET watched_seconds=20 WHERE lesson_id=$1',[l]),'former student cannot write lesson progress');
    await asSuper("UPDATE public.trainer_students SET status='active' WHERE trainer_id=$1 AND student_id=$2",[U.trainerA,U.studentA]);
  });

  await check('course-media: private PDF storage follows lesson RLS; forged cross-tenant paths do not grant access', async () => {
    const c = await make(); const l = await lesson(c);
    const path = `${U.trainerA}/${c}/book.pdf`;
    await as(U.trainerA,"INSERT INTO storage.objects(bucket_id,name,owner) VALUES ('course-media',$1,$2)",[path,U.trainerA]);
    await as(U.trainerA,'UPDATE public.lessons SET document_url=$1 WHERE id=$2',[path,l]);
    eq((await asSuper("SELECT public FROM storage.buckets WHERE id='course-media'")).rows[0].public,false,'private bucket');
    const visible = async (who, p) => (await as(who,"SELECT id FROM storage.objects WHERE bucket_id='course-media' AND name=$1",[p])).rows.length;
    eq(await visible(U.studentA,path),1,'linked PDF read');
    eq(await visible(U.studentB,path),0,'outsider PDF denied');
    const paid = await make({free:false}); const locked = await lesson(paid);
    const paidPath = `${U.trainerA}/${paid}/premium.pdf`;
    await as(U.trainerA,"INSERT INTO storage.objects(bucket_id,name,owner) VALUES ('course-media',$1,$2)",[paidPath,U.trainerA]);
    await as(U.trainerA,'UPDATE public.lessons SET document_url=$1 WHERE id=$2',[paidPath,locked]);
    eq(await visible(U.studentA,paidPath),0,'paid PDF denied');
    await as(U.trainerA,'UPDATE public.lessons SET document_url=$1 WHERE id=$2',[paidPath,l]);
    eq(await visible(U.studentA,paidPath),0,'free course cannot launder another course path');
    await expectError(as(U.studentA,"INSERT INTO storage.objects(bucket_id,name,owner) VALUES ('course-media',$1,$2)",[`${U.studentA}/${c}/evil.pdf`,U.studentA]),'student upload');
    await as(U.trainerA,'UPDATE public.courses SET is_published=false WHERE id=$1',[c]);
    eq(await visible(U.studentA,path),0,'unpublished media revoked');
  });
}
