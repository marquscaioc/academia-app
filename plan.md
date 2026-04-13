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

- [ ] **T1** — Upload funcional de vídeo por exercício (Supabase Storage `exercise-videos` bucket + player inline no ExerciseCard)
- [ ] **T5** — Progressão automática de carga: ao logar série, mostrar "última vez: 40kg x 10" e sugerir +2.5kg se completou todas as reps
- [ ] **T6** — Relatório PDF de evolução: medidas, fotos, PRs, adesão — exportável pelo trainer e pelo aluno
- [ ] **T4** — Substituições de alimentos: UI para o nutricionista definir equivalências e o aluno trocar dentro do plano
- [ ] **T2** — Meta de hidratação personalizada (trainer define ml/dia) + push reminder a cada 2h se não logou água

#### Sprint 4.2 — Check-ins Inteligentes (LiveClin parity)
> Transformar check-ins de formulário passivo em sistema de monitoramento ativo.

- [ ] **L1** — Pontuação ponderada: trainer atribui peso (1-5) por pergunta, score final calculado automaticamente
- [ ] **L2** — Alertas visuais de adesão no dashboard do trainer: 🟢 >80% | 🟡 50-80% | 🔴 <50%, por aluno
- [ ] **L3** — Justificativa obrigatória: quando resposta é negativa/baixa (escala ≤2, "não"), campo de texto abre automaticamente
- [ ] **L4** — Gráficos comparativos entre períodos: sobreposição de scores de check-in semana a semana
- [ ] **L5** — Notificação de plano expirando: push 7 dias e 1 dia antes do vencimento do plano de treino/dieta
- [ ] **L7** — Portal branded funcional: trainer configura logo, cor primária, nome — aluno vê a marca do profissional

#### Sprint 4.3 — Desafios Competitivos (Gym Rats parity)
> Tornar desafios a feature viral do app — motivo pelo qual usuários convidam amigos.

- [ ] **G1** — Check-in de desafio com foto obrigatória: câmera abre ao confirmar, foto salva como prova
- [ ] **G4** — Desafios em equipe: UI para criar times, leaderboard team vs team, score agregado
- [ ] **G2** — Modos de score expandidos: treinos concluídos | minutos ativos | volume total (kg) | check-ins | pontos custom
- [ ] **G3** — "Hustle Points": admin do desafio define tabela de pontos (ex: treino=10pts, cardio=5pts, foto=3pts)
- [ ] **G6** — Anti-trapaça: pose do dia (selfie com gesto específico), bloquear check-in retroativo >24h, flag de foto da galeria
- [ ] **G5** — Converter desafio encerrado → grupo permanente (manter membros e histórico)
- [ ] **G9** — Share de leaderboard: gerar imagem/card do ranking para compartilhar em redes sociais

#### Sprint 4.4 — Comunidade & Engajamento
> Criar o loop social que mantém o usuário abrindo o app todo dia.

- [ ] **C3** — Streaks: contador de dias consecutivos com treino logado, exibido no perfil e no feed (🔥 badge)
- [ ] **C4** — Sistema de badges: UI para exibir conquistas no perfil (schema já existe — criar telas de listagem + notificação ao desbloquear)
- [ ] **C9** — "Compartilhar treino": ao finalizar sessão, botão gera card visual (exercícios, volume, duração) → post no feed com 1 tap
- [ ] **C1** — Follow/unfollow: feed filtrável por "seguindo" vs "todos", contador no perfil
- [ ] **C2** — Perfil público completo: stats (treinos/mês, streak, PRs), badges, fotos recentes, desafios ativos
- [ ] **C5** — Auto shout-outs: quando aluno bate PR, completa 30 dias de streak, ou termina desafio → post automático no feed
- [ ] **C6** — Notificação social: "Fulano acabou de treinar 💪" para quem segue (opt-in)

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
| Paridade Treino.io (prescrição) | 95%+ |
| Paridade LiveClin (check-ins/monitoramento) | 85%+ |
| Paridade Gym Rats (desafios/social) | 90%+ |
| Features de comunidade únicas | 5+ além dos concorrentes |
| DAU/MAU ratio (engajamento) | >40% |
| Retenção D30 | >50% |
