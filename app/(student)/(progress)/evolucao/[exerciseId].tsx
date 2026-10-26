import ExerciseEvolutionScreen from "../../../../components/progress/ExerciseEvolutionScreen";
import { useAuth } from "../../../../lib/auth/provider";

export default function StudentExerciseEvolution() {
  const { user } = useAuth();
  return (
    <ExerciseEvolutionScreen
      userId={user?.id}
      fallbackHref="/(student)/(progress)"
      backLabel="Progresso"
      sessionHref={(id) => `/(student)/(workouts)/historico/${id}`}
    />
  );
}
