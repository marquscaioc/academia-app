# PROJETO ACADEMIA APP - Plano Completo

## Contexto

Construir um software para browser e celular (iOS/Android/Web) que combina funcionalidades de **Treino.io** (prescrição de treinos e dieta), **LiveClin** (check-ins automatizados e acompanhamento de progresso), **Gym Rats** (desafios sociais e gamificação) e um **sistema de comunidade** (feed social, grupos, chat).

### Decisões Definidas
- **Modelo:** SaaS multi-tenant — múltiplos trainers/nutricionistas se cadastram e gerenciam seus próprios alunos
- **Idioma:** Português BR apenas (sem overhead de i18n)
- **Isolamento de dados:** Row Level Security (RLS) no PostgreSQL, não bancos separados

---

## Stack Tecnológico

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| **Frontend (Web + Mobile)** | Expo SDK 54+ com Expo Router | Codebase único para iOS, Android e Web via React Native Web |
| **Estilização** | NativeWind v4 (Tailwind CSS) | Utility-first, consistente cross-platform |
| **State (servidor)** | TanStack Query v5 | Cache, refetch, optimistic updates |
| **State (cliente)** | Zustand | Timer, drafts, UI state |
| **Backend** | Supabase (PostgreSQL + Auth + Realtime + Storage + Edge Functions) | Sem necessidade de backend custom |
| **Forms** | React Hook Form + Zod | Validação compartilhada frontend/backend |
| **Gráficos** | Victory Native | Charts de progresso cross-platform |
| **Idioma** | Português BR apenas (sem i18n) | Sem overhead de internacionalização |
| **Notificações** | expo-notifications + Expo Push API | Via Edge Functions |
| **Pagamentos (Fase 3)** | Stripe via Edge Functions | Assinaturas e cobranças |

---

## Roles e Permissões

| Ação | Admin | Trainer | Nutricionista | Aluno |
|------|-------|---------|---------------|-------|
| Criar plano de treino | Sim | Sim (próprios alunos) | Não | Não |
| Criar plano alimentar | Sim | Não | Sim (próprios alunos) | Não |
| Ver progresso | Sim | Próprios alunos | Próprios alunos | Próprio |
| Criar desafios | Sim | Sim | Sim | Não |
| Gestão financeira | Total | Própria | Própria | Não |
| Moderar comunidade | Sim | Limitado | Limitado | Não |

---

## Módulos de Funcionalidades

### M1 - Autenticação e Usuários
- Login email/senha, Google, Apple
- Seleção de role no onboarding
- Perfil com avatar, bio, dados pessoais
- Convite trainer→aluno
- LGPD: exclusão de conta

### M2 - Treinos (Treino.io)
- Biblioteca de exercícios com vídeos instrutivos
- Builder de plano de treino (séries, reps, carga, tempo, RPE)
- Supersets e circuitos
- Atribuição ao aluno com calendário mensal
- Execução de treino com **timer de descanso** e alertas
- Log de sessão (peso, reps, RPE por série)
- Histórico e progressão

### M3 - Dieta e Nutrição (Treino.io)
- Banco de alimentos com macros
- Builder de plano alimentar (refeições, quantidades, substituições)
- Atribuição ao aluno
- Tracking de refeições realizadas
- Resumo de macros diários
- Controle de ingestão de água

### M4 - Progresso (Treino.io + LiveClin)
- Fotos de progresso (frente/lado/costas) com comparativo antes/depois
- Medidas corporais com gráficos de evolução
- PRs por exercício e volume total
- Score de adesão (treino + dieta)
- Relatório PDF exportável

### M5 - Check-ins e Questionários (LiveClin)
- Builder de questionários customizáveis (texto, número, escala, foto, múltipla escolha)
- Agendamento automático (diário, semanal, quinzenal, mensal)
- Lembretes via push notification
- Dashboard de respostas para o profissional
- Comparativo entre períodos

### M6 - Desafios e Competições (Gym Rats)
- Criar/participar de desafios individuais e em equipe
- Modos de pontuação: dias ativos, contagem de check-ins, volume total, pontos customizados
- Prova por foto/vídeo do treino
- Leaderboard em tempo real
- Feed de atividades do desafio
- Verificação anti-trapaça (pose do dia)

### M7 - Comunidade e Social
- Feed social (posts, fotos, conquistas, treinos)
- Reações (like, fogo, forte, palma)
- Comentários com respostas aninhadas
- Perfis públicos com stats e badges
- Sistema de follow
- Grupos/comunidades com feed próprio
- Chat em grupo com reações, @menções, presença online

### M8 - Gestão Financeira (LiveClin)
- Planos de serviço (mensal, trimestral, anual)
- Atribuição de plano ao aluno
- Dashboard de receitas e inadimplência
- Geração de faturas PDF
- Integração Stripe

### M9 - Portal Profissional Branded (LiveClin)
- Logo, cores, domínio personalizado
- Experiência white-label para o aluno
- Página pública do profissional

### M10 - Notificações e Integrações
- Push: novo treino, check-in, mensagem, desafio
- WhatsApp Business API para lembretes
- Apple Health e Google Fit sync
- Email: welcome, digest semanal

### M11 - Admin Dashboard
- Gestão de usuários
- Moderação de conteúdo
- Analytics da plataforma
- Feature flags

---

## Faseamento MVP

### FASE 1 - Core (Meses 1-4) — ~45 telas
**Objetivo:** Trainer consegue gerenciar alunos e prescrever treinos. Aluno executa e registra progresso.

- [x] M1 - Auth completo (sem Nutricionista)
- [x] M2 - Treinos completo
- [x] M4 - Progresso básico (fotos + medidas + charts)
- [x] M5 - Check-ins básico (templates pré-prontos, envio manual)
- [x] M10 - Notificações básicas (push + email essenciais)

### FASE 2 - Engajamento (Meses 5-8) — ~35 telas adicionais
**Objetivo:** Aumentar retenção com nutrição, social e gamificação.

- [x] M3 - Dieta completo + role Nutricionista
- [x] M6 - Desafios completo (individual)
- [x] M7 - Social básico (feed, perfis, follow, reações)
- [x] M5 - Check-ins avançado (builder + automação)
- [x] M4 - Progresso avançado (PRs, adesão, PDF)
- [ ] M10 - WhatsApp integration (requer API externa)

### FASE 3 - Monetização (Meses 9-12) — ~23 telas adicionais
**Objetivo:** Profissionais rodam o negócio inteiro na plataforma.

- [x] M8 - Financeiro completo
- [x] M9 - Portal branded
- [x] M7 - Social completo (grupos, chat)
- [x] M6 - Desafios (equipes pendente)
- [ ] M10 - Device integrations (Health, Fit) (requer build nativo)
- [x] M11 - Admin dashboard

---

## Estrutura de Pastas

```
projeto-academia-app/
├── app/                          # Expo Router (file-based routes)
│   ├── _layout.tsx               # Root: providers, auth guard
│   ├── (auth)/                   # Login, register, forgot-password
│   ├── (student)/                # Bottom tabs: home, workouts, progress, social, chat
│   ├── (trainer)/                # Sidebar (web) / tabs (mobile): dashboard, students, exercises
│   └── (admin)/                  # Admin panel
├── components/
│   ├── ui/                       # Design system (Button, Card, Input, Modal...)
│   ├── workout/                  # ExerciseCard, RestTimer, WorkoutPlayer
│   ├── diet/                     # MealCard, MacroSummary
│   ├── progress/                 # ProgressChart, PhotoComparison
│   ├── social/                   # FeedPost, LeaderboardRow, ChallengeCard
│   └── chat/                     # MessageBubble, ChatInput
├── lib/
│   ├── supabase/                 # client.ts, types.ts (auto-generated)
│   ├── auth/                     # provider.tsx, useAuth.ts, guards.tsx
│   ├── realtime/                 # useChannel.ts, usePresence.ts
│   └── utils/                    # date.ts, media.ts, validation.ts, scoring.ts
├── hooks/
│   ├── queries/                  # useWorkouts.ts, useChallenges.ts, useFeed.ts...
│   └── mutations/                # useLogWorkout.ts, useSendMessage.ts...
├── stores/                       # Zustand: timer, workout session, UI, drafts
├── supabase/
│   ├── migrations/               # SQL migrations
│   ├── functions/                # Edge Functions (push, scoring, webhooks)
│   └── seed.sql                  # Exercícios, grupos musculares
├── assets/                       # Imagens, fontes, animações Lottie
├── app.json                      # Expo config
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Schema do Banco (Entidades Principais)

### Core
- **profiles** — extends auth.users (role, nome, avatar, bio, push_token)
- **trainer_profiles** — CREF, branding, especialidades
- **trainer_students** — relacionamento trainer↔aluno (status, datas)

### Treinos
- **exercises** — nome, vídeo, músculo, equipamento, dificuldade
- **muscle_groups** / **equipment** — lookups
- **workout_plans** — plano atribuído a aluno (nome, datas)
- **workouts** — dia dentro do plano ("Treino A - Peito")
- **workout_exercises** — exercício dentro do treino (sets, reps, carga, descanso, tempo)
- **workout_sessions** — sessão completada (duração, RPE, humor, foto)
- **workout_session_sets** — série logada (reps, peso, RPE)

### Dieta
- **diet_plans** — plano com metas de macros
- **meals** — refeição dentro do plano
- **meal_items** — alimento dentro da refeição (quantidade, macros)

### Progresso
- **body_measurements** — peso, BF%, circunferências por data
- **progress_photos** — URL, pose, data, privacidade

### Check-ins
- **questionnaire_templates** — título, frequência
- **questionnaire_questions** — texto, tipo, opções, ordem
- **check_ins** — instância enviada ao aluno (status: pending/submitted/reviewed)
- **check_in_answers** — respostas individuais

### Social & Gamificação
- **challenges** — título, tipo, regras de pontuação, datas, foto obrigatória
- **challenge_participants** — score total, rank
- **challenge_entries** — check-in com foto/pontos
- **feed_posts** — post social (tipo, conteúdo, mídia, visibilidade)
- **feed_reactions** / **feed_comments** — interações
- **groups** / **group_members** — comunidades
- **achievement_definitions** / **user_achievements** — badges

### Chat
- **conversations** — tipo (direct, group, challenge)
- **conversation_members** — membros com last_read
- **messages** — conteúdo, tipo, mídia

### Financeiro
- **subscription_plans** — planos de serviço do trainer
- **subscriptions** — assinatura do aluno (status, período, Stripe ID)

### Sistema
- **notifications** — tipo, título, corpo, data, lido, pushado

---

## Storage (Supabase Buckets)

| Bucket | Acesso | Uso | Limite |
|--------|--------|-----|--------|
| `avatars` | Público | Fotos de perfil | 5 MB |
| `exercise-videos` | Público | Vídeos de exercícios | 100 MB |
| `progress-photos` | Privado (RLS) | Fotos de progresso | 10 MB |
| `feed-media` | Autenticado | Mídia do feed social | 50 MB |
| `chat-media` | Privado (RLS) | Anexos do chat | 25 MB |
| `brand-assets` | Público | Logos de trainers | 5 MB |

---

## Realtime (Supabase Channels)

| Feature | Canal | Tipo |
|---------|-------|------|
| Chat | `chat:{conversationId}` | Postgres Changes + Broadcast (typing) + Presence |
| Leaderboard | `challenge:{challengeId}` | Postgres Changes |
| Notificações | `notifications:{userId}` | Postgres Changes |
| Treino ao vivo | `workout-live:{sessionId}` | Broadcast |

---

## Primeiro Passo de Implementação (Fase 1)

1. **Setup do projeto Expo** — `npx create-expo-app`, configurar TypeScript, NativeWind, Expo Router
2. **Criar projeto Supabase** — via MCP tools, configurar Auth (email + Google + Apple)
3. **Migrations iniciais** — profiles, trainer_students, exercises, workout_plans, workouts, workout_exercises, workout_sessions, workout_session_sets, body_measurements, progress_photos
4. **RLS policies** — own data, trainer access
5. **Root layout** — providers (QueryClient, Auth, i18n, SafeArea)
6. **Auth flow** — login, register, role selection, onboarding
7. **Navigation** — role-based routing (student tabs / trainer sidebar)
8. **Design system** — componentes ui/ base
9. **Workout engine** — biblioteca de exercícios → builder → execução com timer → log
10. **Progresso** — fotos + medidas + charts

---

## Verificação

- [x] `npx expo start` roda web e mobile sem erros
- [x] Auth flow completo (register → login → role routing)
- [x] Trainer cria exercício com vídeo → aparece na biblioteca
- [x] Trainer cria plano de treino → atribui ao aluno (workout builder 4-step)
- [x] Aluno executa treino com timer → sessão logada no banco
- [x] Aluno faz upload de foto de progresso → visível para trainer
- [x] Aluno registra medidas → gráfico de evolução renderiza (SimpleLineChart + AdherenceRing)
- [x] Push notification recebida ao atribuir novo treino (Edge Function + expo-notifications)
- [x] Web responsivo no desktop (trainer dashboard com sidebar)
