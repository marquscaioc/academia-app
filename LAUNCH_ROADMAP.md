# 🚀 Roadmap de Lançamento — App "Academia" (TREINO)

## 1. Resumo executivo

O app tem **boa espinha dorsal de produto** (jornadas núcleo funcionando, design system coeso, RLS endurecido nas migrations recentes) mas está **longe de pronto para as lojas**. O lançamento **WEB** está a poucos passos de viável; o lançamento nas **LOJAS (iOS/Android)** está praticamente do zero em configuração de build e em compliance. Os dois maiores riscos de bloqueio são: **(a)** ausência total de infraestrutura de build de loja (`eas.json`, permissões nativas, `projectId`) e **(b)** compliance/LGPD inexistente (sem exclusão de conta in-app, sem Política de Privacidade nem Termos), que causa **rejeição automática** em ambas as lojas. Há ainda **2 blockers de segurança** (chave master Evolution exposta no bundle; push-notification com `service_role` confiando em `user_id` do client) e **1 blocker de QA** (jornada de check-in quebrada no lado do aluno).

### Prontidão % por área

| Área | Prontidão | Estado | Bloqueia loja? |
|---|---:|---|---|
| QA / Jornadas críticas | 62% | 🟡 Núcleo OK, 1 jornada quebrada | Parcial |
| Performance & Polimento | 62% | 🟡 Sólido p/ MVP, polish web pendente | Não |
| Hardening / Segurança | 38% | 🔴 2 blockers de chave/IDOR | Sim (responsável) |
| Assets de loja & Onboarding | 35% | 🔴 Ícone c/ alpha, assets duplicados | Sim |
| Build & Lojas (EAS) | 22% | 🔴 Sem eas.json, sem permissões iOS | Sim |
| Compliance / LGPD | 12% | 🔴 Sem delete de conta, sem políticas | Sim |
| **Média ponderada (loja)** | **~38%** | 🔴 **Não publicável ainda** | — |
| **Trilha WEB isolada** | **~70%** | 🟡 **Próxima de viável** | — |

### Veredito — "quanto falta para lançar"

- **WEB responsável (MVP):** curto — falta endurecer os 2 blockers de segurança (rotacionar/proxy da chave Evolution; corrigir push-notification), publicar Política de Privacidade + Termos + exclusão de conta, e fechar o check-in. Estimativa: **~1 a 1,5 semana** de trabalho concentrado (agente + decisões do mantenedor).
- **LOJAS (iOS + Android):** mais longo — depende de **contas pagas** (Apple 99 USD/ano, Google 25 USD), criação de credenciais de signing, assets corretos, formulários de privacidade (Nutrition Labels / Data Safety) e a fila de **review** das lojas. Estimativa realista: **~3 a 4 semanas** até submeter, mais o tempo de revisão das lojas (dias a ~2 semanas).

Honestamente: o **caminho mais curto e responsável é lançar a WEB primeiro** (sem dependência de contas de loja nem review) enquanto se prepara, em paralelo, a trilha das lojas.

---

## 2. 🚧 Bloqueadores de lançamento (o que IMPEDE publicar)

> "Blocker" aqui = impede publicar e/ou causa rejeição/crash/risco legal-segurança inaceitável.

### Compliance / LGPD (iguais p/ Apple, Google e Web responsável)
1. **Exclusão de conta in-app ausente** — exigência Apple (5.1.1v), Google e LGPD art. 18. *Agente* implementa tela + edge function de delete; *mantenedor* define política de retenção (apagar × anonimizar, obrigação fiscal do trainer).
2. **Política de Privacidade inexistente** (sem texto e sem URL) — obrigatória nos formulários das lojas E acessível no app, ainda mais por coletar dados de saúde. *Mantenedor* redige/hospeda; *agente* adiciona URL e rota/links.
3. **Termos de Uso inexistentes** — SaaS pago com prescrição de treino/dieta exige EULA + disclaimer médico. *Mantenedor* redige; *agente* linka.
4. **Privacy Nutrition Labels (Apple) / Data Safety (Google) não preenchidos** — app coleta saúde, biometria, fotos, push token. *Mantenedor* preenche formulários; *agente* mapeia o que é coletado e garante as strings de permissão.

### Build & Lojas
5. **Não existe `eas.json`** — sem ele, `eas build`/`eas submit` são impossíveis. *Agente* cria.
6. **Sem usage descriptions iOS (câmera/galeria/microfone)** — causa **crash** ao pedir permissão e rejeição na review. *Agente* corrige via plugins/infoPlist.
7. **Config plugins de `expo-camera` / `expo-image-picker` / `expo-av` ausentes em `plugins[]`** — sem eles as permissões nativas nunca entram no binário. *Agente* corrige.
8. **Conta Apple Developer + signing iOS** — 99 USD/ano, App ID `com.academiaapp`, ASC API key. *Mantenedor*.
9. **Conta Google Play + service account (EAS Submit)** — 25 USD único, app `com.academiaapp`, service account JSON. *Mantenedor*.

### Assets de loja
10. **Ícone iOS com canal alpha/transparência** — **rejeição automática** na App Store. *Agente* achata sobre fundo sólido; *mantenedor* aprova arte.
11. **Os 4 assets (icon/adaptive/splash/favicon) são o MESMO arquivo** — adaptive Android corta o rino (sem safe-zone), favicon superdimensionado. *Agente* gera variantes corretas.

### Hardening / Segurança (blocker de lançamento responsável, web inclusive)
12. **Chave master Evolution API no bundle do client (`EXPO_PUBLIC_EVOLUTION_KEY`)** — qualquer um extrai a chave GLOBAL e controla todas as instâncias WhatsApp. *Agente* cria proxy edge function c/ JWT; *mantenedor* **ROTACIONA** a chave.
13. **`push-notification` usa `service_role` e confia em `user_id` do body (IDOR/spam)** — qualquer usuário notifica qualquer outro. *Agente* valida JWT / move p/ trigger server-side.

### QA
14. **Jornada de check-in quebrada no lado do aluno** — instância é criada por cron mas o aluno **nunca** tem como abrir/responder (sem link, sem banner, sem rota no notification observer). *Agente* adiciona `usePendingCheckins` + banner/lista + rota.

---

## 3. Roadmap faseado

### Fase L1 — Build & Config (destrava qualquer binário de loja)
**Objetivo:** produzir `.ipa`/`.aab` válidos e um app que não crasha por permissão.
**Itens:**
- Criar `eas.json` com perfis `development/preview/production` + bloco `submit` (placeholders de IDs). *(agente)*
- Adicionar `expo-camera`, `expo-image-picker`, `expo-av` em `plugins[]` com as usage descriptions iOS e permissões Android (CAMERA, READ_MEDIA_IMAGES, RECORD_AUDIO, POST_NOTIFICATIONS). *(agente)*
- Adicionar `ios.infoPlist` com `NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription`, `NSPhotoLibraryAddUsageDescription`, `NSMicrophoneUsageDescription` (e `NSHealthShareUsageDescription` se HealthKit). *(agente)*
- Definir `runtimeVersion` (ex.: `{"policy":"appVersion"}`). *(agente)*
- `eas init` → preencher `extra.eas.projectId` + `owner`. *(mantenedor autentica Expo; agente aplica)*
- Mapear env de produção (`EXPO_PUBLIC_SUPABASE_URL/ANON_KEY`, `EVOLUTION_*`) em `eas.json` env por perfil / EAS Secrets. *(agente configura; mantenedor fornece valores)*
- Config completo de `expo-notifications` (`icon`, `color`). *(agente)*

**Critério de pronto:** `eas build --profile preview` gera binário; app instala e abre câmera/galeria sem crash em device iOS/Android; push token retorna em build standalone.

### Fase L2 — Compliance / LGPD (destrava review e lançamento responsável)
**Objetivo:** ser publicável legalmente e passar na review de privacidade.
**Itens:**
- **Exclusão de conta in-app**: tela de confirmação + edge function (`auth.admin.deleteUser` + limpeza/anonimização respeitando FKs/RLS) + caminho web. *(agente)* / política de retenção *(mantenedor)*.
- **Política de Privacidade + Termos**: redação/hospedagem *(mantenedor)*; URL em `app.json/extra` + rotas web `/privacidade` e `/termos` + links em login/register/perfil *(agente)*.
- **Consentimento no cadastro**: checkbox obrigatório + texto com links + gravar `terms_accepted_at`/`privacy_version`. *(agente)*
- **Age gate / data de nascimento** + idade mínima. *(agente implementa; mantenedor decide limite)*.
- **Formulários de privacidade das lojas** (Nutrition Labels / Data Safety) com categorias reais. *(mantenedor preenche; agente fornece o mapa de dados coletados)*.
- **Canal de direitos do titular / DPO** exposto na tela de privacidade. *(mantenedor define e-mail; agente exibe)*.
- (Desejável, não blocker) Export estruturado de dados (portabilidade) + timestamp de consentimento do WhatsApp. *(agente)*

**Critério de pronto:** usuário consegue excluir a conta e ver dados removidos; políticas acessíveis por URL pública e in-app; cadastro exige aceite; formulários das lojas preenchidos.

### Fase L3 — QA, Segurança & Polish (qualidade D1)
**Objetivo:** jornadas íntegras, sem vazamento de chave, e percepção de qualidade.
**Itens (segurança — prioridade):**
- **Rotacionar** chave Evolution + mover chamadas WhatsApp p/ edge function com JWT (remover do client). *(mantenedor rotaciona; agente proxia)*.
- Corrigir `push-notification` (validar JWT / trigger server-side). *(agente)*.
- Webhook WhatsApp com verificação de assinatura; `ErrorBoundary` global; rodar **Security Advisor** do Supabase. *(agente + mantenedor roda advisor)*.

**Itens (QA):**
- **Fechar check-in do aluno**: `usePendingCheckins` + banner/lista na home + rota no notification observer; expor envio manual (`useSendCheckIn`). *(agente)*.
- Tratar **'Confirm email'** do Supabase (estado "verifique seu email" no register). *(mantenedor decide config; agente implementa)*.
- **Route guards** nos layouts `(student)/(trainer)/(admin)` (deep-links web). *(agente)*.
- Aplicar **seeds** (`seed.sql` + `exercises_seed.sql` na ordem) em produção. *(agente prepara script; mantenedor executa)*.
- Corrigir card "Treino de hoje" hardcoded; `try/catch`/feedback de erro nos `mutateAsync` das jornadas núcleo. *(agente)*.

**Itens (polish/assets):**
- Gerar assets corretos (ícone iOS sem alpha, adaptive c/ safe-zone, favicon pequeno). *(agente; mantenedor aprova)*.
- `+html.tsx` (title/lang pt-BR/meta/OG) + `+not-found.tsx`; container `max-width` web; `ErrorState` + pull-to-refresh; acessibilidade básica (`accessibilityLabel/Role`). *(agente)*.
- Decidir **nome de marca** (Academia App × TREINO × `com.academiaapp`) — bundle id não muda após publicar. *(mantenedor)*.

**Critério de pronto:** smoke test manual das 8 jornadas passa; nenhuma chave sensível no bundle; check-in funciona ponta a ponta; web não parece "mobile esticado".

### Fase L4 — Submissão & Go-live
**Objetivo:** publicar.
**Itens:**
- Contas pagas Apple + Google criadas; signing/keystore (EAS gerencia). *(mantenedor)*.
- Screenshots por tamanho de tela (inclui iPad — `supportsTablet=true`) + feature graphic + descrições/keywords/categoria (Health & Fitness, pt-BR primário). *(agente rascunha/captura; mantenedor finaliza marketing)*.
- `eas build --profile production` + `eas submit` para ambas as lojas. *(agente roda; mantenedor autoriza credenciais)*.
- Deploy WEB de produção (re-export, build atual está stale de abril). *(agente)*.

**Critério de pronto:** builds enviados às lojas e em review; web no ar com políticas linkadas.

---

## 4. Divisão de trabalho

### ✅ O agente pode fazer agora (em código/config)
- Criar `eas.json` (perfis + bloco submit com placeholders).
- Adicionar config plugins (`expo-camera`/`expo-image-picker`/`expo-av`) + usage descriptions iOS + permissões Android.
- Definir `runtimeVersion`; config completo de `expo-notifications`.
- Mapear env de build (estrutura em `eas.json`/Secrets — sem os valores).
- Implementar **exclusão de conta** (tela + edge function) e caminho web.
- Criar rotas web `/privacidade` e `/termos`, linkar em login/register/perfil; adicionar URLs em `app.json`.
- Checkbox de consentimento + gravação de `terms_accepted_at`/`privacy_version`; campo de data de nascimento + age gate.
- Export estruturado de dados (portabilidade) e timestamp de consentimento WhatsApp.
- **Proxy edge function** p/ WhatsApp + remover chave do client; corrigir `push-notification` (JWT/trigger); webhook assinado; `ErrorBoundary`.
- **Fechar check-in**: `usePendingCheckins` + banner/lista + rota no notification observer + UI de envio manual.
- Route guards nos layouts; `try/catch` nos `mutateAsync`; corrigir card "Treino de hoje".
- Preparar script de aplicação dos seeds (validado).
- Gerar assets corretos (ícone sem alpha, adaptive safe-zone, favicon pequeno).
- `+html.tsx` / `+not-found.tsx`; container `max-width` web; `ErrorState` + pull-to-refresh; acessibilidade; ícones vetoriais.
- Rascunhar textos de loja e capturar screenshots base; re-exportar build web.

### 🙋 Precisa do mantenedor (contas / credenciais / legal / decisão)
- **Contas pagas:** Apple Developer (99 USD/ano) e Google Play Console (25 USD).
- **Credenciais:** login Apple/ASC API key, Apple Team ID, ASC App ID; service account Google Play (JSON); autenticar conta Expo (`eas init`) e definir `owner`.
- **Valores de produção** das env vars (Supabase URL/key, Evolution) e **rotação** da chave Evolution exposta.
- **Textos legais:** Política de Privacidade e Termos de Uso (redação + hospedagem); definir DPO/canal de privacidade e política de retenção de dados.
- **Formulários das lojas:** Privacy Nutrition Labels (Apple) e Data Safety (Google); classificação etária / idade mínima.
- **Decisões de produto/marca:** nome público (Academia App × TREINO), config "Confirm email" no Supabase, rodar Security Advisor, executar seeds em produção, marketing das screenshots/descrições.

---

## 5. Os 5 próximos passos (começar já)

1. **Decidir a estratégia de release: WEB primeiro.** É o caminho mais curto e responsável (sem contas de loja nem review). Trava o escopo de L2/L3 mínimo para a web e libera a trilha de lojas em paralelo.
2. **Mantenedor: abrir as contas pagas e autenticar Expo** — Apple Developer + Google Play + `eas init` (entregar `projectId`/`owner`) e **rotacionar a chave Evolution**. São os itens de maior lead time e bloqueiam L1/L4.
3. **Agente: criar `eas.json` + plugins/permissões iOS-Android + `runtimeVersion`** em um único PR de "build config" — destrava todos os builds de loja e elimina o crash de permissão.
4. **Agente: implementar exclusão de conta in-app + rotas/links de Política e Termos** (com placeholders de copy até o mantenedor entregar o texto legal). São os blockers de compliance mais "mecânicos".
5. **Agente: fechar a jornada de check-in + corrigir os 2 blockers de segurança** (`push-notification` e proxy WhatsApp), depois rodar o **smoke test manual das 8 jornadas** com 2 contas (trainer + aluno) antes de qualquer submissão.

---

> **Resumo do caminho mais curto:** Web em ~1–1,5 semana (segurança + compliance + check-in + re-export). Lojas em ~3–4 semanas até submeter (limitadas por contas pagas, assets e formulários de privacidade), mais o tempo de review. Priorize L1 (config) e L2 (compliance) em paralelo, pois são os gargalos que travam tudo o resto.