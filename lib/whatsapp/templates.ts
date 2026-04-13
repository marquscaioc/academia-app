// WhatsApp message templates for Academia App

export interface MessageTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: "reminder" | "engagement" | "admin";
  buildMessage: (params: Record<string, string>) => string;
}

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: "welcome",
    name: "Boas-vindas",
    icon: "👋",
    description: "Enviada quando aluno e conectado ao trainer",
    category: "admin",
    buildMessage: ({ name }) =>
      `Oi ${name}! 👋\n\nBem-vindo ao Academia App! Aqui voce vai receber lembretes de treino, check-ins e novidades do seu personal.\n\n💪 Bora comecar!`,
  },
  {
    id: "checkin_reminder",
    name: "Lembrete de Check-in",
    icon: "📋",
    description: "Quando check-in esta pendente",
    category: "reminder",
    buildMessage: ({ name }) =>
      `Oi ${name}! 📋\n\nSeu check-in esta pendente. Responda pelo app para seu personal acompanhar seu progresso.\n\n👉 Acesse o app agora!`,
  },
  {
    id: "daily_workout",
    name: "Treino do Dia",
    icon: "🏋️",
    description: "Lembrete matinal de treino",
    category: "reminder",
    buildMessage: ({ name, workoutName }) =>
      `Bom dia ${name}! 💪\n\n${workoutName ? `Seu treino de hoje: "${workoutName}". ` : "Voce tem treino programado para hoje. "}Bora comecar?\n\n🏋️ Abra o app e veja seu treino!`,
  },
  {
    id: "plan_expiring",
    name: "Plano Expirando",
    icon: "⚠️",
    description: "7 e 1 dia antes do vencimento",
    category: "reminder",
    buildMessage: ({ name, planName, days }) =>
      `${name}, atencao! ⚠️\n\nSeu plano ${planName ? `"${planName}" ` : ""}expira em ${days ?? "poucos"} dia(s)!\n\nConverse com seu personal para renovar.`,
  },
  {
    id: "smart_nudge",
    name: "Nudge de Volta",
    icon: "🔥",
    description: "Quando aluno nao treina ha 3+ dias",
    category: "engagement",
    buildMessage: ({ name, days }) =>
      `${name}, sentimos sua falta! 🔥\n\nJa faz ${days ?? "alguns"} dias desde seu ultimo treino. Que tal voltar hoje?\n\n💪 Bora manter o foco!`,
  },
  {
    id: "workout_complete",
    name: "Treino Concluido",
    icon: "🎉",
    description: "Parabens por completar o treino",
    category: "engagement",
    buildMessage: ({ name, workoutName, duration }) =>
      `Parabens ${name}! 🎉\n\nTreino "${workoutName ?? "do dia"}" concluido${duration ? ` em ${duration}` : ""}!\n\nContinue assim! 💪`,
  },
  {
    id: "pr_achieved",
    name: "Novo Recorde",
    icon: "🏆",
    description: "Quando aluno bate PR",
    category: "engagement",
    buildMessage: ({ name, exercise, weight, reps }) =>
      `${name}, NOVO RECORDE! 🏆\n\n${exercise}: ${weight}kg x ${reps} reps\n\nVoce esta evoluindo demais! 💪🔥`,
  },
];

export function getTemplate(id: string): MessageTemplate | undefined {
  return MESSAGE_TEMPLATES.find((t) => t.id === id);
}
