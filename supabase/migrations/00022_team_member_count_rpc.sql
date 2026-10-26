-- 00022_team_member_count_rpc.sql
-- T0-11: RPC increment_team_member_count ausente.
-- useJoinTeam chama supabase.rpc("increment_team_member_count", ...) mas a
-- funcao nunca foi criada, entao entrar em equipe nao atualizava member_count.
-- Recalcula a contagem real (idempotente) em vez de somar cegamente.
-- Idempotente.

CREATE OR REPLACE FUNCTION public.increment_team_member_count(p_team_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.challenge_teams
  SET member_count = (
    SELECT count(*) FROM public.challenge_participants WHERE team_id = p_team_id
  )
  WHERE id = p_team_id;
$$;
