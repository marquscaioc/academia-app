-- =============================================
-- Sprint 4.2: Check-ins Inteligentes (LiveClin parity)
-- =============================================

-- Add weight to questions for weighted scoring
ALTER TABLE public.questionnaire_questions ADD COLUMN IF NOT EXISTS weight INTEGER DEFAULT 1 CHECK (weight BETWEEN 1 AND 5);

-- Add weighted score to check-ins
ALTER TABLE public.check_ins ADD COLUMN IF NOT EXISTS weighted_score NUMERIC(5,2);

-- Add score per answer
ALTER TABLE public.check_in_answers ADD COLUMN IF NOT EXISTS score NUMERIC(5,2);

-- Add justification for negative answers
ALTER TABLE public.check_in_answers ADD COLUMN IF NOT EXISTS justification TEXT;

-- Brand tagline for trainer portal
ALTER TABLE public.trainer_profiles ADD COLUMN IF NOT EXISTS brand_tagline TEXT;

-- Function to calculate weighted check-in score (0-100)
CREATE OR REPLACE FUNCTION public.calculate_checkin_score(p_check_in_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_weighted_score NUMERIC := 0;
  total_weight NUMERIC := 0;
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT a.answer_number, a.answer_text, q.question_type, q.weight
    FROM public.check_in_answers a
    JOIN public.questionnaire_questions q ON q.id = a.question_id
    WHERE a.check_in_id = p_check_in_id
  LOOP
    IF rec.question_type = 'scale' AND rec.answer_number IS NOT NULL THEN
      -- Scale 1-10: normalize to 0-10
      total_weighted_score := total_weighted_score + (rec.answer_number * rec.weight);
      total_weight := total_weight + (10 * rec.weight);
    ELSIF rec.question_type = 'boolean' THEN
      -- Boolean: sim=10, nao=0
      total_weighted_score := total_weighted_score + (
        CASE WHEN LOWER(rec.answer_text) IN ('sim', 'yes', 'true', 's') THEN 10 ELSE 0 END * rec.weight
      );
      total_weight := total_weight + (10 * rec.weight);
    ELSIF rec.question_type = 'number' AND rec.answer_number IS NOT NULL THEN
      -- Number: cap at 10 for scoring
      total_weighted_score := total_weighted_score + (LEAST(rec.answer_number, 10) * rec.weight);
      total_weight := total_weight + (10 * rec.weight);
    END IF;
    -- text and choice types don't contribute to score
  END LOOP;

  IF total_weight = 0 THEN RETURN NULL; END IF;

  RETURN ROUND((total_weighted_score / total_weight) * 100, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: auto-calculate score when check-in is submitted
CREATE OR REPLACE FUNCTION public.auto_score_checkin()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'submitted' AND (OLD.status IS NULL OR OLD.status = 'pending') THEN
    NEW.weighted_score := public.calculate_checkin_score(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS checkin_auto_score ON public.check_ins;
CREATE TRIGGER checkin_auto_score
  BEFORE UPDATE ON public.check_ins
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_score_checkin();
