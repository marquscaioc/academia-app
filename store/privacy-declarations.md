# 🔐 Declarações de privacidade das lojas — Projeto Gaab

Rascunho das respostas para **App Privacy (Apple)** e **Data Safety (Google Play)**,
derivado do modelo de dados auditado. **Revisar contra o conjunto final de features e
obter sign-off jurídico antes de submeter.**

Premissas verificadas no código:
- Backend único = **Supabase** (processador). Não há SDK de anúncios nem rastreamento entre apps.
- **Nenhum compartilhamento** de dados pessoais com terceiros para publicidade. (TACO e Open
  Food Facts são *fontes* de dados de alimentos — não recebem dados do usuário.)
- **Criptografia em trânsito**: sim (HTTPS/Supabase).
- **Exclusão de conta in-app**: sim (`delete-account` + "Zona de perigo" no perfil).
- Sem rastreamento (Apple "Used to Track You" = **Não** para todos os tipos).

---

## 🍎 Apple — App Privacy (por tipo de dado: coletado? vinculado à identidade? usado p/ rastrear?)

| Tipo de dado | Coletado | Vinculado ao usuário | Rastreamento | Finalidade |
|---|---|---|---|---|
| **Nome** | Sim | Sim | Não | Funcionalidade do app |
| **Email** | Sim | Sim | Não | Funcionalidade do app (auth) |
| **Dados de saúde** (medidas corporais) | Sim | Sim | Não | Funcionalidade do app |
| **Dados de fitness** (treinos, sessões) | Sim | Sim | Não | Funcionalidade do app |
| **Fotos** (progresso, feed, avatar) | Sim | Sim | Não | Funcionalidade do app |
| **Conteúdo do usuário** (posts, mensagens, check-ins) | Sim | Sim | Não | Funcionalidade do app |
| **ID do usuário** | Sim | Sim | Não | Funcionalidade do app |
| **Outros dados** (data de nascimento — gate 16+) | Sim | Sim | Não | Funcionalidade do app |
| **Token de push** (ID de dispositivo) | Sim | Sim | Não | Funcionalidade do app (notificações) |

> Fotos e medidas corporais são **dados de saúde sensíveis** — destacar isolamento por
> profissional (RLS) e acesso via URL assinada na descrição de privacidade.

## 🤖 Google Play — Data Safety

**Coleta e segurança (geral):**
- Dados criptografados em trânsito: **Sim**.
- Usuário pode **solicitar exclusão** dos dados: **Sim** (exclusão de conta in-app).
- Coleta obrigatória vs. opcional: email/nome/DOB obrigatórios no cadastro; fotos/medidas opcionais.

**Tipos coletados (Coletado · Compartilhado=Não · Finalidade=Funcionalidade do app):**
- **Informações pessoais:** Nome, Email, Data de nascimento.
- **Informações de saúde e fitness:** Health info (medidas corporais), Fitness info (treinos).
- **Fotos e vídeos:** Fotos (progresso/feed/avatar).
- **Mensagens:** mensagens no app (chat) e conteúdo do feed/check-ins.
- **IDs do app/dispositivo:** ID do usuário; token de push.

> Nenhum tipo marcado como **"Compartilhado com terceiros"**. Nenhum dado usado para
> publicidade/marketing de terceiros.

---

## ⚠️ Antes de submeter
- Confirmar se alguma feature ainda coleta **localização** (hoje **não** há captura de geolocalização — não declarar).
- Confirmar **microfone** (declarado em permissões para vídeos curtos): se a gravação de áudio não
  for usada na v1, considerar remover a permissão para simplificar a declaração.
- Finalizar Política/Privacidade (texto jurídico) e publicar a URL.
- Validar com profissional jurídico (dados de saúde = categoria sensível na LGPD).
