-- =============================================
-- MIGRATION 00016: Cursos + Comentários em desafios
-- =============================================

-- =============================================
-- 1. COURSES / LESSONS (Treino.io feature)
-- =============================================

CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  is_free BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_trainer ON public.courses(trainer_id) WHERE is_published = TRUE;

CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  sort_order INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lessons_course ON public.lessons(course_id, sort_order);

CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  watched_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON public.lesson_progress(user_id);

-- RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Trainers manage own courses" ON public.courses;
  DROP POLICY IF EXISTS "Students view trainer courses" ON public.courses;
  DROP POLICY IF EXISTS "Trainers manage own lessons" ON public.lessons;
  DROP POLICY IF EXISTS "Students view accessible lessons" ON public.lessons;
  DROP POLICY IF EXISTS "Users manage own progress" ON public.lesson_progress;
  DROP POLICY IF EXISTS "Trainers view student progress" ON public.lesson_progress;
END $$;

CREATE POLICY "Trainers manage own courses" ON public.courses FOR ALL USING (trainer_id = auth.uid());
CREATE POLICY "Students view trainer courses" ON public.courses FOR SELECT TO authenticated USING (
  is_published = TRUE AND EXISTS (
    SELECT 1 FROM public.trainer_students WHERE trainer_id = courses.trainer_id AND student_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY "Trainers manage own lessons" ON public.lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND trainer_id = auth.uid())
);
CREATE POLICY "Students view accessible lessons" ON public.lessons FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.courses c
    JOIN public.trainer_students ts ON ts.trainer_id = c.trainer_id
    WHERE c.id = lessons.course_id AND c.is_published = TRUE AND ts.student_id = auth.uid() AND ts.status = 'active'
  )
);

CREATE POLICY "Users manage own progress" ON public.lesson_progress FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Trainers view student progress" ON public.lesson_progress FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.lessons l
    JOIN public.courses c ON c.id = l.course_id
    WHERE l.id = lesson_progress.lesson_id AND c.trainer_id = auth.uid()
  )
);

-- =============================================
-- 2. CHALLENGE ENTRY COMMENTS (Gym Rats feature)
-- =============================================

CREATE TABLE IF NOT EXISTS public.challenge_entry_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES public.challenge_entries(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_entry_comments_entry ON public.challenge_entry_comments(entry_id, created_at);

ALTER TABLE public.challenge_entry_comments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "View entry comments" ON public.challenge_entry_comments;
  DROP POLICY IF EXISTS "Create entry comments" ON public.challenge_entry_comments;
  DROP POLICY IF EXISTS "Delete own entry comments" ON public.challenge_entry_comments;
END $$;

CREATE POLICY "View entry comments" ON public.challenge_entry_comments FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.challenge_entries e
    JOIN public.challenge_participants p ON p.challenge_id = e.challenge_id
    WHERE e.id = entry_id AND p.user_id = auth.uid()
  )
);
CREATE POLICY "Create entry comments" ON public.challenge_entry_comments FOR INSERT TO authenticated WITH CHECK (
  author_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.challenge_entries e
    JOIN public.challenge_participants p ON p.challenge_id = e.challenge_id
    WHERE e.id = entry_id AND p.user_id = auth.uid()
  )
);
CREATE POLICY "Delete own entry comments" ON public.challenge_entry_comments FOR DELETE USING (author_id = auth.uid());

-- updated_at trigger for courses
DROP TRIGGER IF EXISTS courses_updated_at ON public.courses;
CREATE TRIGGER courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
