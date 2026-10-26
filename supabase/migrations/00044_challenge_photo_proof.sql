-- Require an uploaded private object before accepting a challenge photo.
CREATE OR REPLACE FUNCTION public.score_challenge_entry()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  c public.challenges%ROWTYPE;
  r public.challenge_point_rules%ROWTYPE;
  s public.workout_sessions%ROWTYPE;
  v_day timestamptz := date_trunc('day', clock_timestamp() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
  v_count integer;
BEGIN
  IF auth.uid() IS NOT NULL AND NEW.user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Nao autorizado.';
  END IF;
  SELECT * INTO c FROM public.challenges WHERE id = NEW.challenge_id FOR SHARE;
  IF NOT FOUND OR clock_timestamp() < c.starts_at OR clock_timestamp() > c.ends_at THEN
    RAISE EXCEPTION 'Desafio fora do periodo de atividades.';
  END IF;
  -- Serialize this participant's inserts, including concurrent daily-limit
  -- checks. The score update in the same transaction holds the lock to commit.
  PERFORM 1 FROM public.challenge_participants
    WHERE challenge_id = NEW.challenge_id AND user_id = NEW.user_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Inscreva-se no desafio primeiro.'; END IF;
  IF c.require_photo_proof AND NULLIF(btrim(NEW.photo_url), '') IS NULL THEN
    RAISE EXCEPTION 'Este desafio exige uma foto.';
  END IF;
  IF NEW.photo_url IS NOT NULL AND split_part(NEW.photo_url, '/', 1) <> NEW.user_id::text THEN
    RAISE EXCEPTION 'Foto deve pertencer ao participante.';
  END IF;
  IF NEW.photo_url IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM storage.objects WHERE bucket_id = 'feed-media' AND name = NEW.photo_url
  ) THEN RAISE EXCEPTION 'Envie a foto antes de registrar a atividade.'; END IF;
  NEW.created_at := clock_timestamp();
  NEW.verified := FALSE; -- A submitted photo is not an automated pose verification.
  NEW.flagged_reason := NULL;
  NEW.activity_type := 'checkin';

  IF c.scoring_mode = 'custom_points' THEN
    SELECT * INTO r FROM public.challenge_point_rules
      WHERE id = NEW.point_rule_id AND challenge_id = NEW.challenge_id FOR SHARE;
    IF NOT FOUND OR r.points < 0 OR r.points > 100000 OR r.points = 'NaN'::numeric
       OR (r.max_per_day IS NOT NULL AND r.max_per_day < 1) THEN
      RAISE EXCEPTION 'Regra de pontuacao invalida para este desafio.';
    END IF;
    SELECT count(*) INTO v_count FROM public.challenge_entries
      WHERE challenge_id = NEW.challenge_id AND user_id = NEW.user_id
        AND point_rule_id = r.id AND created_at >= v_day AND created_at < v_day + interval '1 day';
    IF r.max_per_day IS NOT NULL AND v_count >= r.max_per_day THEN
      RAISE EXCEPTION 'Limite diario desta atividade atingido (UTC).';
    END IF;
    NEW.points := r.points;
    NEW.activity_type := r.activity_type;
  ELSE
    NEW.point_rule_id := NULL;
    IF c.scoring_mode = 'days_active' THEN
      IF EXISTS (SELECT 1 FROM public.challenge_entries
        WHERE challenge_id = NEW.challenge_id AND user_id = NEW.user_id AND created_at >= v_day AND created_at < v_day + interval '1 day') THEN
        RAISE EXCEPTION 'Check-in de hoje ja registrado (UTC).';
      END IF;
      NEW.points := 1;
    ELSIF c.scoring_mode = 'check_in_count' THEN
      NEW.points := 1;
    ELSIF c.scoring_mode IN ('workouts_completed', 'total_volume', 'active_minutes') THEN
      SELECT * INTO s FROM public.workout_sessions
        WHERE id = NEW.workout_session_id AND user_id = NEW.user_id FOR SHARE;
      IF NOT FOUND OR s.finished_at IS NULL OR s.finished_at < c.starts_at
        OR s.finished_at > c.ends_at OR s.finished_at > clock_timestamp()
        OR s.finished_at < s.started_at THEN
        RAISE EXCEPTION 'Selecione uma sessao sua concluida durante o desafio.';
      END IF;
      IF EXISTS (SELECT 1 FROM public.challenge_entries
        WHERE challenge_id = NEW.challenge_id AND user_id = NEW.user_id AND workout_session_id = s.id) THEN
        RAISE EXCEPTION 'Sessao ja registrada neste desafio.';
      END IF;
      NEW.activity_type := 'workout';
      IF c.scoring_mode = 'workouts_completed' THEN NEW.points := 1;
      ELSIF c.scoring_mode = 'active_minutes' THEN
        NEW.points := round(EXTRACT(EPOCH FROM (s.finished_at - s.started_at)) / 60, 2);
      ELSE
        SELECT COALESCE(sum(weight_kg * reps), 0) INTO NEW.points
          FROM public.workout_session_sets
          WHERE session_id = s.id AND NOT COALESCE(is_warmup, FALSE) AND reps > 0 AND weight_kg > 0;
      END IF;
      IF NEW.points <= 0 OR NEW.points > 100000 OR NEW.points = 'NaN'::numeric THEN
        RAISE EXCEPTION 'A sessao nao possui uma metrica valida (maximo 100000).';
      END IF;
    ELSE RAISE EXCEPTION 'Modo de pontuacao nao suportado.';
    END IF;
  END IF;
  IF c.scoring_mode NOT IN ('workouts_completed', 'total_volume', 'active_minutes') THEN
    NEW.workout_session_id := NULL;
  END IF;
  RETURN NEW;
END $$;

