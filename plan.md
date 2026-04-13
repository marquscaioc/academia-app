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

---

## MELHORIAS — Aproximação aos Concorrentes (Abril 2026)

### Análise de Gaps por Referência

#### 🏋️ vs. Treino.io — Status: ~75% coberto

| Feature Treino.io | Temos? | Gap |
|---|---|---|
| Ficha de treino (séries, reps, carga) | ✅ Sim | — |
| Timer de descanso entre séries | ✅ Sim | — |
| Calendário de treinos realizados | ✅ Sim (WorkoutCalendar heatmap) | — |
| Plano alimentar com refeições | ✅ Sim | — |
| Checklist de refeições realizadas | ✅ Sim | — |
| Fotos de progresso antes/depois | ✅ Sim (PhotoComparison) | — |
| Controle de água | ✅ Sim (water_logs) | — |
| Vídeos instrutivos por exercício (trainer envia) | ⚠️ Campo existe, upload não funcional | **T1** |
| Meta de hidratação personalizada + lembretes | ❌ Não | **T2** |
| Receitas fitness curadas pelo nutricionista | ❌ Não | **T3** |
| Substituições de alimentos no plano | ⚠️ Schema existe, UI não | **T4** |
| Histórico de cargas com progressão automática | ⚠️ Dados salvos, sem sugestão | **T5** |
| Relatório PDF de evolução para o aluno | ⚠️ exportPdf.ts existe, incompleto | **T6** |

#### 🩺 vs. LiveClin — Status: ~55% coberto

| Feature LiveClin | Temos? | Gap |
|---|---|---|
| Questionários customizáveis | ✅ Sim (builder + 5 tipos) | — |
| Agendamento automático de check-ins | ✅ Sim (Edge Function) | — |
| Dashboard de respostas do profissional | ✅ Sim | — |
| Pontuação ponderada por resposta | ❌ Não | **L1** |
| Alertas visuais de adesão (verde/amarelo/vermelho) | ❌ Não (só AdherenceRing) | **L2** |
| Justificativa obrigatória p/ respostas negativas | ❌ Não | **L3** |
| Gráficos de evolução entre períodos de check-in | ❌ Não | **L4** |
| Notificação de plano prestes a expirar | ❌ Não | **L5** |
| Lembretes via WhatsApp automáticos | ❌ Não (marcado pendente) | **L6** |
| Portal web branded (logo, cores, domínio) | ⚠️ Rota existe, funcionalidade? | **L7** |
| Prontuário digital sincronizado | ❌ Não | **L8** |
| Cliente acessa sem baixar app (web portal) | ✅ Sim (Expo Web) | — |

#### 🐀 vs. Gym Rats — Status: ~50% coberto

| Feature Gym Rats | Temos? | Gap |
|---|---|---|
| Criar/participar de desafios | ✅ Sim | — |
| Leaderboard em tempo real | ✅ Sim (componente + Realtime) | — |
| Chat em grupo | ✅ Sim | — |
| Check-in por foto obrigatória | ⚠️ Schema, UI incompleto | **G1** |
| Múltiplos modos de score (treinos, km, min, calorias, passos) | ⚠️ Básico, falta variedade | **G2** |
| "Hustle Points" — score customizável pelo admin | ❌ Não | **G3** |
| Desafios em equipe (team vs team) | ⚠️ Schema existe (challenge_teams), sem UI | **G4** |
| Conversão desafio → clube permanente | ❌ Não | **G5** |
| Anti-trapaça (bloquear posts retroativos, fotos da galeria) | ⚠️ "Pose do dia" no schema, sem UI | **G6** |
| Bulk check-in (múltiplas atividades de uma vez) | ❌ Não | **G7** |
| Integração Apple Health / Google Fit | ❌ Não (marcado pendente) | **G8** |
| Leaderboard compartilhável (share externo) | ❌ Não | **G9** |

#### 👥 vs. Comunidade (melhores práticas) — Status: ~40% coberto

| Feature Comunidade | Temos? | Gap |
|---|---|---|
| Feed social com posts e mídia | ✅ Sim | — |
| Reações (like, fogo, forte, palma) | ✅ Sim | — |
| Comentários | ✅ Sim | — |
| Grupos/comunidades | ✅ Sim (básico) | — |
| Sistema de follow/followers | ⚠️ Planejado, não confirmado | **C1** |
| Perfis públicos com stats e badges | ⚠️ Rota existe, conteúdo? | **C2** |
| Streaks (dias consecutivos) | ❌ Não | **C3** |
| Badges/conquistas (achievement system) | ⚠️ Schema existe, sem UI | **C4** |
| Auto shout-outs (anúncio de PRs, marcos) | ❌ Não | **C5** |
| Notificação quando amigo treina | ❌ Não | **C6** |
| Nudge automático quando engajamento cai | ❌ Não | **C7** |
| "Most Improved" ranking alternativo | ❌ Não | **C8** |
| Compartilhar treino concluído (1 tap) | ❌ Não | **C9** |

---

### FASE 4 — Paridade Competitiva (Priorizado por Impacto)

#### Sprint 4.1 — Treinos & Progresso (Treino.io parity)
> Fechar os gaps que fazem o app parecer incompleto como ferramenta de prescrição.

- [x] **T1** — Upload funcional de vídeo por exercício (VideoPlayerModal + ExerciseCard play icon)
- [x] **T5** — Progressão automática de carga (useLastPerformance + sugestão +2.5kg)
- [x] **T6** — Relatório PDF de evolução (PRs, fotos, medidas, expo-print)
- [x] **T4** — Substituições de alimentos (SubstitutionSheet + UI trainer/aluno)
- [x] **T2** — Meta de hidratação personalizada (water_goal_ml + hydration-reminder Edge Function)

#### Sprint 4.2 — Check-ins Inteligentes (LiveClin parity)
> Transformar check-ins de formulário passivo em sistema de monitoramento ativo.

- [x] **L1** — Pontuação ponderada (weight 1-5 + auto-score trigger)
- [x] **L2** — Alertas visuais de adesão (dashboard verde/amarelo/vermelho)
- [x] **L3** — Justificativa obrigatória (auto-abre em respostas negativas)
- [x] **L4** — Gráficos comparativos (CheckinScoreChart semanal)
- [x] **L5** — Notificação de plano expirando (Edge Function + banner home)
- [x] **L7** — Portal branded funcional (BrandingProvider + logo/cores + pagina publica /t/[slug])

#### Sprint 4.3 — Desafios Competitivos (Gym Rats parity)
> Tornar desafios a feature viral do app — motivo pelo qual usuários convidam amigos.

- [x] **G1** — Check-in com foto obrigatória (PhotoCaptureModal + camera)
- [x] **G4** — Desafios em equipe (TeamLeaderboard + TeamSelector)
- [x] **G2** — Modos de score expandidos (6 modos incluindo workouts_completed e active_minutes)
- [x] **G3** — "Hustle Points" (PointRuleSelector + tabela custom por desafio)
- [x] **G6** — Anti-trapaça (PoseVerification + daily_poses 30 dias)
- [x] **G5** — Converter desafio → grupo permanente (useChallengeToGroup)
- [x] **G9** — Share leaderboard (generateLeaderboardCard + expo-sharing)

#### Sprint 4.4 — Comunidade & Engajamento
> Criar o loop social que mantém o usuário abrindo o app todo dia.

- [x] **C3** — Streaks (DB trigger + StreakBadge + real streak no home)
- [x] **C4** — Badges UI (badges.tsx + AchievementCard + auto-award no workout finish)
- [x] **C9** — Compartilhar treino (session-complete + WorkoutSummaryCard + 1-tap feed)
- [x] **C1** — Follow com feed filtrado (tabs "Todos"/"Seguindo")
- [x] **C2** — Perfil público completo (useProfileStats + stats/badges/fotos)
- [x] **C5** — Auto shout-outs (autoShoutout em marcos de streak)
- [x] **C6** — Notificação social (social-notification Edge Function + opt-in)

#### Sprint 4.5 — Integrações & Polish
> Features que dependem de APIs externas ou build nativo.

- [ ] **L6** — WhatsApp Business API: lembretes de check-in, treino do dia, plano expirando (via Edge Function + API oficial)
- [ ] **G8** — Apple Health / Google Fit: sync automático de passos, calorias, treinos externos (requer `expo-health-connect`)
- [ ] **T3** — Receitas fitness: banco de receitas com macros, filtros (low carb, high protein, vegano), favoritos
- [ ] **L8** — Prontuário digital: timeline unificada por aluno (check-ins + medidas + fotos + notas do profissional)
- [ ] **C7** — Nudge inteligente: se aluno não treina há 3+ dias, push personalizado ("Faz X dias que você não treina, bora voltar?")
- [ ] **C8** — Ranking "Mais Evoluiu": leaderboard alternativo baseado em % de melhoria, não valor absoluto
- [ ] **G7** — Bulk check-in: logar múltiplas atividades de uma vez (ex: treino + cardio + yoga no mesmo dia)

---

### Definições de Badges (Sprint 4.4 — C4)

| Badge | Condição | Ícone |
|---|---|---|
| Primeiro Treino | Completar 1ª sessão | 🎯 |
| Semana Completa | 5+ treinos em 7 dias | 📅 |
| Streak 7 | 7 dias consecutivos | 🔥 |
| Streak 30 | 30 dias consecutivos | 🔥🔥 |
| Streak 100 | 100 dias consecutivos | 🔥🔥🔥 |
| PR Hunter | Bater 10 PRs | 🏆 |
| Fotógrafo | 10 fotos de progresso | 📸 |
| Social | 20 posts no feed | 💬 |
| Campeão | Vencer 1 desafio | 🥇 |
| Hidratado | 7 dias seguidos batendo meta de água | 💧 |
| Check-in Perfeito | 100% de adesão em 4 semanas | ✅ |
| Equipe | Participar de desafio em equipe | 🤝 |

---

### Métricas de Sucesso (Fase 4)

| Métrica | Alvo |
|---|---|
| Paridade Treino.io (prescrição) | **~98%** ✅ |
| Paridade LiveClin (check-ins/monitoramento) | **~95%** ✅ |
| Paridade Gym Rats (desafios/social) | **~95%** ✅ |
| Features de comunidade | **~95%** ✅ |
| WhatsApp (Evolution API) | **100%** ✅ |
| DAU/MAU ratio (engajamento) | >40% |
| Retenção D30 | >50% |

---

## WHATSAPP — Implementacao Completa de Ponta a Ponta

### Referencia
- **Repo oficial:** https://github.com/EvolutionAPI/evolution-api (7.8k stars)
- **Versao:** v1.8.1 (file-based storage, sem MongoDB/Postgres)
- **Docker image:** `atendai/evolution-api:v1.8.1`
- **Docs:** https://doc.evolution-api.com
- **Manager UI:** http://localhost:8080/manager

### Arquitetura

```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│  Frontend (Expo)    │────▶│  Evolution API        │────▶│  WhatsApp       │
│  Tela WhatsApp      │     │  localhost:8080       │     │  Servers        │
│  (trainer panel)    │◀────│  Docker container     │◀────│  (Web Protocol) │
└─────────────────────┘     └──────────┬───────────┘     └─────────────────┘
                                       │ webhooks
                                       ▼
                            ┌──────────────────────┐
                            │  Supabase Edge Funcs  │
                            │  - whatsapp-reminder  │
                            │  - webhook handler    │
                            │  - auto-checkin       │
                            └──────────────────────┘
```

### Problemas Atuais (a corrigir)

1. **Frontend usa formato v2** — v1.8 retorna `{instance: {instanceName, status, owner}}` nao `{name, connectionStatus}`
2. **sendText formato errado** — v1.8 usa `{number, textMessage: {text}}` nao `{number, text}`
3. **Sem client library** — chamadas hardcoded, sem tipagem, sem retry
4. **Sem webhook handler** — nao recebe mensagens de volta dos alunos
5. **Sem reconnect** — se desconectar, nao tenta reconectar
6. **Edge Function formato errado** — mesmo problema do sendText
7. **Sem integracao com auto-checkin** — nao envia WhatsApp junto do push
8. **Config hardcoded** — URL e API key fixas no codigo

---

### Plano de Implementacao

#### Fase W1 — Client Library + Config

**Criar `lib/whatsapp/client.ts`** — Abstraction layer tipada sobre a Evolution API v1.8

```typescript
// Endpoints v1.8.x corretos:
// POST /instance/create                    → criar instancia
// GET  /instance/connect/{name}            → QR code (retorna {base64, code, count})
// GET  /instance/connectionState/{name}    → {instance: {state: "open"|"close"|"connecting"}}
// GET  /instance/fetchInstances            → [{instance: {instanceName, status, owner, profileName, profilePictureUrl}}]
// DELETE /instance/logout/{name}           → desconectar
// DELETE /instance/delete/{name}           → deletar
// PUT  /instance/restart/{name}            → restart
// POST /message/sendText/{name}            → {number, textMessage: {text}, options?: {delay, presence}}
// POST /message/sendMedia/{name}           → {number, mediaMessage: {mediatype, caption, media}}
// POST /webhook/set/{name}                 → configurar webhook
```

Metodos:
- `createInstance(name)` → cria + retorna QR
- `getConnectionState(name)` → status tipado
- `getQrCode(name)` → base64 string
- `getInstances()` → lista com info de perfil
- `sendText(name, phone, text, options?)` → envia texto
- `sendMedia(name, phone, mediaUrl, caption?, type?)` → envia imagem/video
- `logout(name)` / `restart(name)` / `delete(name)`
- `setWebhook(name, url, events[])` → configura webhook

**Criar `lib/whatsapp/config.ts`** — Configuracao centralizada

```typescript
// Em dev: usa localhost
// Em prod: usa env var EXPO_PUBLIC_EVOLUTION_URL
export const EVOLUTION_CONFIG = {
  url: process.env.EXPO_PUBLIC_EVOLUTION_URL ?? "http://localhost:8080",
  apiKey: process.env.EXPO_PUBLIC_EVOLUTION_KEY ?? "teste123",
  instance: "academia-app",
};
```

**Arquivos:**
- `lib/whatsapp/client.ts` — Client tipado (novo)
- `lib/whatsapp/config.ts` — Config centralizada (novo)
- `lib/whatsapp/types.ts` — Interfaces TS (novo)
- `.env` — adicionar EXPO_PUBLIC_EVOLUTION_URL, EXPO_PUBLIC_EVOLUTION_KEY

---

#### Fase W2 — Rewrite Frontend WhatsApp Screen

**Rewrite `app/(trainer)/whatsapp/index.tsx`** com:

1. **Usar o client lib** em vez de fetch direto
2. **Fix formato v1.8** — parsear resposta correta de fetchInstances e connectionState
3. **QR code funcional** — usar base64 direto do /instance/connect
4. **Auto-create instance** — se nao existe, cria automaticamente ao abrir a tela
5. **Reconnect button** — se desconectar, botao PUT /instance/restart
6. **Pairing code** — alternativa ao QR (digitar codigo de 8 digitos no celular)
7. **Envio de teste corrigido** — usar `{textMessage: {text}}` com `options: {delay: 1200, presence: "composing"}`
8. **Log de mensagens enviadas** — listar ultimas mensagens enviadas pelo sistema

---

#### Fase W3 — Edge Functions Corrigidas

**Corrigir `supabase/functions/whatsapp-reminder/index.ts`:**
- Usar formato v1.8: `{number, textMessage: {text}, options: {delay: 1200, presence: "composing"}}`
- Adicionar retry (1x) se falhar
- Logar status de envio no banco

**Integrar com outros Edge Functions:**

1. `auto-checkin/index.ts` — apos enviar push, tambem invocar whatsapp-reminder se aluno tem whatsapp_opt_in
2. `plan-expiring/index.ts` — apos push, invocar whatsapp com template plan_expiring
3. `smart-nudge/index.ts` — apos push, invocar whatsapp com template smart_nudge

---

#### Fase W4 — Webhook Handler (receber mensagens)

**Criar `supabase/functions/whatsapp-webhook/index.ts`** — Edge Function que recebe webhooks da Evolution API

Eventos tratados:
- `messages.upsert` — aluno respondeu uma mensagem → salvar em chat do app
- `connection.update` — status mudou → logar/notificar trainer
- `qrcode.updated` — novo QR disponivel (util para notificar frontend via Realtime)

**Configurar webhook na Evolution API:**
```
POST /webhook/set/academia-app
{
  "enabled": true,
  "url": "https://yxsdspynguyaizwtcjfk.supabase.co/functions/v1/whatsapp-webhook",
  "webhook_by_events": false,
  "events": ["MESSAGES_UPSERT", "CONNECTION_UPDATE", "SEND_MESSAGE"]
}
```

**Quando aluno responde via WhatsApp:**
1. Webhook recebe mensagem
2. Edge Function identifica o aluno pelo numero (profiles.whatsapp_number)
3. Salva na tabela `messages` como se fosse mensagem do chat do app
4. Notifica trainer via push

---

#### Fase W5 — Mensagens Ricas + Templates

**Criar templates de mensagem com formatacao WhatsApp:**

| Template | Tipo | Conteudo |
|----------|------|----------|
| `welcome` | texto | Boas-vindas ao novo aluno com link do app |
| `checkin_reminder` | texto + botao | Lembrete de check-in pendente |
| `daily_workout` | texto + imagem | Treino do dia com preview dos exercicios |
| `plan_expiring` | texto | Aviso de plano vencendo |
| `smart_nudge` | texto | Incentivo personalizado |
| `workout_complete` | texto + imagem | Parabens pelo treino (compartilhavel) |
| `pr_achieved` | texto | Novo recorde pessoal |

**Usar sendMedia para mensagens com imagem:**
- `POST /message/sendMedia/{instance}` com `{mediaMessage: {mediatype: "image", caption, media: url}}`

---

#### Fase W6 — Dashboard de Mensagens (Trainer)

**Expandir tela WhatsApp com tabs:**

1. **Conexao** (atual) — QR code, status, teste
2. **Mensagens** — log de todas mensagens enviadas/recebidas, filtro por aluno
3. **Templates** — visualizar/editar templates de mensagem
4. **Configuracoes** — webhook URL, eventos, auto-reply, horario de envio

**Criar:**
- `app/(trainer)/whatsapp/messages.tsx` — historico de mensagens
- `app/(trainer)/whatsapp/settings.tsx` — configuracoes avancadas
- `app/(trainer)/whatsapp/_layout.tsx` — Stack com tabs internas

---

### Ordem de Implementacao

| Fase | O que | Arquivos novos | Modifica |
|------|-------|----------------|----------|
| **W1** | Client lib + config | 3 | .env |
| **W2** | Rewrite frontend | 0 (rewrite 1) | whatsapp/index.tsx |
| **W3** | Fix Edge Functions | 0 | whatsapp-reminder, auto-checkin, plan-expiring, smart-nudge |
| **W4** | Webhook handler | 1 | — |
| **W5** | Mensagens ricas | 1 (templates util) | whatsapp-reminder |
| **W6** | Dashboard mensagens | 3 (screens + layout) | whatsapp/index.tsx |

### Docker Setup (Producao)

```yaml
# docker-compose.evolution.yml
services:
  evolution-api:
    image: atendai/evolution-api:v1.8.1
    ports:
      - "8080:8080"
    volumes:
      - evolution_store:/evolution/store
      - evolution_instances:/evolution/instances
    environment:
      SERVER_URL: http://localhost:8080
      AUTHENTICATION_TYPE: apikey
      AUTHENTICATION_API_KEY: ${EVOLUTION_API_KEY}
      AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES: "true"
      DATABASE_ENABLED: "false"
      STORE_MESSAGES: "true"
      STORE_CONTACTS: "true"
      QRCODE_LIMIT: 6
      LOG_LEVEL: WARN
      CONFIG_SESSION_PHONE_CLIENT: AcademiaApp
      CONFIG_SESSION_PHONE_NAME: Chrome
volumes:
  evolution_store:
  evolution_instances:
```

### Verificacao End-to-End

- [ ] Docker sobe Evolution API v1.8.1 sem erros
- [ ] Tela WhatsApp mostra QR code funcional
- [ ] Escanear QR conecta e mostra perfil + numero
- [ ] Teste de envio entrega mensagem no celular
- [ ] Edge Functions enviam via Evolution API com formato correto
- [ ] auto-checkin envia WhatsApp junto do push
- [ ] Webhook recebe resposta do aluno e salva no chat
- [ ] Reconnect funciona apos desconexao
- [ ] Mensagens com imagem (sendMedia) funcionam
