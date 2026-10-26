export async function runCourseAccessApiScenarios({ admin, trainer, student, attacker, check, assert, uploaded, run }) {
  const must = ({ data, error }) => { if (error) throw error; return data; };
  await check('courses API: trainer-only publication, paid lessons fail closed, lesson completion retry upserts once', async () => {
    const denied = await student.client.from('courses').insert({ trainer_id: student.id, title: 'Forbidden' });
    assert(denied.error, 'student authored a course');
    const course = must(await trainer.client.from('courses').insert({ trainer_id: trainer.id, title: 'API course', is_published: true, is_free: false }).select('id').single());
    const lessons = must(await trainer.client.from('lessons').insert([
      { course_id: course.id, title: 'Locked', is_free: false },
      { course_id: course.id, title: 'Preview', is_free: true },
    ]).select('id,title'));
    const preview = lessons.find((l) => l.title === 'Preview'); const locked = lessons.find((l) => l.title === 'Locked');
    const visible = must(await student.client.from('lessons').select('id').eq('course_id',course.id));
    assert(visible.length === 1 && visible[0].id === preview.id, 'paid lesson leaked');
    for (let i = 0; i < 2; i++) must(await student.client.from('lesson_progress').upsert({ user_id: student.id, lesson_id: preview.id, completed: true }, { onConflict:'user_id,lesson_id' }));
    const rows = must(await admin.from('lesson_progress').select('id').eq('user_id',student.id).eq('lesson_id',preview.id));
    assert(rows.length === 1, 'completion retry duplicated progress');
    assert((await student.client.from('lesson_progress').insert({ user_id: student.id, lesson_id: locked.id, completed: true })).error,'locked progress accepted');
  });

  await check('course-media API: private PDF uploads, signed reads and unpublish/tenant revocation', async () => {
    const course = must(await trainer.client.from('courses').insert({ trainer_id: trainer.id, title: 'API ebook', is_published: true, is_free: true }).select('id').single());
    const path = `${trainer.id}/${course.id}/${run}.pdf`;
    const pdf = new Blob(['%PDF-1.4\n%%EOF'],{type:'application/pdf'});
    must(await trainer.client.storage.from('course-media').upload(path,pdf,{contentType:'application/pdf'}));
    uploaded.push(['course-media',path]);
    must(await trainer.client.from('lessons').insert({course_id:course.id,title:'E-book',document_url:path}));
    const signed = await student.client.storage.from('course-media').createSignedUrl(path,60);
    assert(!signed.error && signed.data?.signedUrl,'linked student could not sign PDF');
    const actual = await fetch(signed.data.signedUrl);
    assert(actual.ok && (await actual.text()).includes('%PDF'),'signed PDF bytes not accessible');
    const denied = await attacker.client.storage.from('course-media').download(path);
    assert(denied.error,'other tenant downloaded PDF');
    must(await trainer.client.from('courses').update({is_published:false}).eq('id',course.id));
    assert((await student.client.storage.from('course-media').download(path)).error,'unpublished PDF downloadable');
    assert((await student.client.from('lessons').select('id').eq('course_id',course.id)).data?.length === 0,'unpublished lesson visible');
  });
}
