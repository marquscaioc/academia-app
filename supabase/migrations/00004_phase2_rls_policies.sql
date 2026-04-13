-- =============================================
-- FASE 2: RLS POLICIES
-- =============================================

-- DIET
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students view own diet plans" ON public.diet_plans FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Trainers manage student diet plans" ON public.diet_plans FOR ALL USING (trainer_id = auth.uid());

CREATE POLICY "View meals of accessible diet plans" ON public.meals FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.diet_plans WHERE id = diet_plan_id AND (student_id = auth.uid() OR trainer_id = auth.uid()))
);
CREATE POLICY "Trainers manage meals" ON public.meals FOR ALL USING (
  EXISTS (SELECT 1 FROM public.diet_plans WHERE id = diet_plan_id AND trainer_id = auth.uid())
);

CREATE POLICY "View meal items" ON public.meal_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.meals m JOIN public.diet_plans dp ON dp.id = m.diet_plan_id
    WHERE m.id = meal_id AND (dp.student_id = auth.uid() OR dp.trainer_id = auth.uid()))
);
CREATE POLICY "Trainers manage meal items" ON public.meal_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.meals m JOIN public.diet_plans dp ON dp.id = m.diet_plan_id
    WHERE m.id = meal_id AND dp.trainer_id = auth.uid())
);

CREATE POLICY "Users manage own meal logs" ON public.meal_logs FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Trainers view student meal logs" ON public.meal_logs FOR SELECT USING (public.is_trainer_of(user_id));

CREATE POLICY "Users manage own water logs" ON public.water_logs FOR ALL USING (user_id = auth.uid());

-- CHALLENGES
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View public challenges" ON public.challenges FOR SELECT TO authenticated USING (
  is_public = TRUE OR created_by = auth.uid() OR EXISTS (
    SELECT 1 FROM public.challenge_participants WHERE challenge_id = id AND user_id = auth.uid()
  )
);
CREATE POLICY "Create challenges" ON public.challenges FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Manage own challenges" ON public.challenges FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Delete own challenges" ON public.challenges FOR DELETE USING (created_by = auth.uid());

CREATE POLICY "View participants" ON public.challenge_participants FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.challenges WHERE id = challenge_id AND (is_public = TRUE OR created_by = auth.uid()))
  OR user_id = auth.uid()
);
CREATE POLICY "Join challenges" ON public.challenge_participants FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Leave challenges" ON public.challenge_participants FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "View entries" ON public.challenge_entries FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.challenge_participants WHERE challenge_id = challenge_entries.challenge_id AND user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.challenges WHERE id = challenge_id AND created_by = auth.uid())
);
CREATE POLICY "Create entries" ON public.challenge_entries FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- SOCIAL FEED
ALTER TABLE public.feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View public posts" ON public.feed_posts FOR SELECT TO authenticated USING (
  visibility = 'public'
  OR author_id = auth.uid()
  OR (visibility = 'followers' AND EXISTS (
    SELECT 1 FROM public.user_follows WHERE follower_id = auth.uid() AND following_id = author_id
  ))
  OR (visibility = 'trainers_only' AND public.is_trainer_of(author_id))
);
CREATE POLICY "Create posts" ON public.feed_posts FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "Update own posts" ON public.feed_posts FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Delete own posts" ON public.feed_posts FOR DELETE USING (author_id = auth.uid());

CREATE POLICY "View reactions" ON public.feed_reactions FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Manage own reactions" ON public.feed_reactions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Remove own reactions" ON public.feed_reactions FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "View comments" ON public.feed_comments FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Create comments" ON public.feed_comments FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "Delete own comments" ON public.feed_comments FOR DELETE USING (author_id = auth.uid());

-- FOLLOWS
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View follows" ON public.user_follows FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Follow users" ON public.user_follows FOR INSERT TO authenticated WITH CHECK (follower_id = auth.uid());
CREATE POLICY "Unfollow users" ON public.user_follows FOR DELETE USING (follower_id = auth.uid());

-- ACHIEVEMENTS
ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View achievements" ON public.achievement_definitions FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "View user achievements" ON public.user_achievements FOR SELECT TO authenticated USING (TRUE);
