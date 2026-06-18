# 🏪 Checklist de Publicação nas Lojas — Projeto Gaab

O **lançamento WEB** está coberto pelo PR do *web launch cut*. Esta lista cobre a
**publicação iOS/Android via EAS**, que depende de contas pagas e credenciais que
só o mantenedor pode prover.

## ✅ Resolvido neste PR (`feat/store-track`)
- **Ícones de loja** regenerados a partir do logo (rinoceronte) — `npm run icons`
  (`scripts/gen-app-icons.mjs`, usa `sharp`):
  - `assets/icon.png` — 1024×1024 **opaco, sem canal alpha** (Apple rejeita ícone com alpha). Verificado: `channels=3, hasAlpha=false`.
  - `assets/adaptive-icon.png` — foreground Android dentro da **safe-zone (~60%)**; fundo vem do `backgroundColor #0B0811` do `app.json`.
  - `assets/splash-icon.png` — mark menor (~42%), transparente (splash usa `contain` + bg escuro).
  - `assets/favicon.png` — **196×196** opaco (era 1024, superdimensionado).
  - Antes os 4 eram **cópias byte-a-byte** do mesmo PNG transparente. Para regenerar após mudar o logo: `npm run icons`.
- `app.json` já correto: `name "Projeto Gaab"`, `ios.bundleIdentifier`/`android.package` `com.academiaapp`, permissões iOS via plugins (câmera/fotos/microfone), `runtimeVersion {policy:appVersion}`, `newArchEnabled`.
- `eas.json` já tem perfis `development`/`preview`/`production`.

## 🔴 Pendências do mantenedor (gated por conta/credencial — não dá para automatizar)

### 1. Contas
- [ ] **Apple Developer Program** — US$ 99/ano · https://developer.apple.com/programs/
- [ ] **Google Play Console** — US$ 25 (único) · https://play.google.com/console/signup
- [ ] Conta **Expo** (gratuita) · https://expo.dev

### 2. Linkar o projeto ao EAS (resolve o blocker `extra.eas.projectId`/`owner`)
```bash
npm i -g eas-cli
eas login
eas init     # cria o projeto no Expo e grava expo.extra.eas.projectId + owner no app.json
```
> ⚠️ O `app.json` **não** tem `extra.eas.projectId` de propósito — não commitar um valor falso (quebra `eas build`). O `eas init` grava o real.

### 3. Credenciais de submit (preencher os `PREENCHER_*` do `eas.json`)
- **iOS:** `appleId`, `ascAppId` (App Store Connect App ID), `appleTeamId`.
- **Android:** `serviceAccountKeyPath` → JSON da service account do Google Play (**gitignore** esse arquivo).

### 4. Build & Submit
```bash
eas build  --platform ios     --profile production
eas build  --platform android --profile production
eas submit --platform ios     --profile production
eas submit --platform android --profile production
```
(EAS gerencia signing/certificados automaticamente.)

### 5. Compliance de loja (além do código)
- [ ] **Política/Termos** com texto jurídico final (hoje é RASCUNHO no app — ver B6 do web launch cut). As rotas `/privacidade` e `/termos` servem como URL pública.
- [ ] **App Privacy (Apple)** / **Data Safety (Google)** — declarar coleta: nome, email, **data de nascimento**, **fotos corporais/medidas (dados de saúde sensíveis)**, uso de câmera/fotos/notificações.
- [x] **Exclusão de conta in-app** — já existe (`delete-account` + "Zona de perigo" no perfil).

### 6. Assets de listagem (criar)
- [ ] **Screenshots** iOS (6.7" e 5.5") e Android (telefone + tablet) — capturar das telas reais.
- [x] **Ícone de loja** 1024×1024 — gerado (`assets/icon.png`).
- [ ] **Feature graphic** Android 1024×500.
- [ ] Descrição curta/longa, palavras-chave, **categoria Saúde & Fitness**, classificação etária (16+).

## Verificação local antes do build nativo
```bash
npm run icons        # regenera os ícones se o logo mudar
npx expo-doctor      # checagem de config/deps (opcional)
```
