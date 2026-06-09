# Code Review — Últimos 5 Commits

**Escopo:** Evolution v2 fix, courses module, reactivate students, entry comments, audit fixes (38 arquivos, 17570 inserções)

**Método:** 3 agentes paralelos (bugs, segurança, qualidade) — apenas issues com confiança ≥ 80

---

## 🔴 BUGS CRÍTICOS (corrigir primeiro)

### [90] `app/(trainer)/students/index.tsx:64-65` — Contadores de filtro errados
```ts
const activeCount = students?.filter((s) => s.status === "active").length ?? 0;
const pausedCount = students?.filter((s) => s.status !== "active").length ?? 0;
```
**Bug:** `students` já vem filtrado pelo `filter` ativo. Quando filter="active", `pausedCount` sempre será 0. Tabs mostram contagens incorretas.
**Fix:** Fazer 2ª query separada `useStudentCounts(trainerId)` que conta TODOS sem filtro, OU buscar tudo e filtrar client-side.

### [85] `app/(trainer)/courses/[courseId].tsx:40-43` — Upload de vídeo sem error handling
```ts
const { error: upErr } = await supabase.storage.from("exercise-videos").upload(...);
if (!upErr) { videoUrl = publicUrl; }
// se upErr → silenciosamente cria lesson sem video, sem feedback ao trainer
```
**Fix:** Mostrar erro UI + abortar a criação da lesson se upload falhar.

### [82] `hooks/queries/useCourses.ts:39-40` — Student não filtra por trainer
```ts
if (opts.trainerId) query = query.eq("trainer_id", opts.trainerId);
else query = query.eq("is_published", true);  // <-- mostra TODOS os trainers
```
**Bug:** `studentId` é aceito mas não usado no filter. Aluno vê cursos publicados de QUALQUER trainer, não só dos seus.
**Fix:** Filtrar por `trainer_id IN (SELECT trainer_id FROM trainer_students WHERE student_id = ? AND status = 'active')`. RLS do migration 00016 já restringe no server, mas client deveria filtrar para coerência.

---

## 🟡 QUALIDADE (refactor recomendado)

### [94] Loading screens duplicados
Mesmo `<SafeAreaView><ActivityIndicator/></SafeAreaView>` em:
- `app/(student)/(courses)/[courseId].tsx:16-22`
- `app/(trainer)/courses/[courseId].tsx:59-65`
- `app/challenges/[challengeId].tsx`
- vários outros

**Fix:** Criar `components/ui/LoadingScreen.tsx` reutilizável.

### [92] Reset de modal espalhado nas mutations
```ts
// students/index.tsx:40-41
onSuccess: () => { setWaterModal(null); setWaterGoal(""); }
// EntryComments.tsx:31
onSuccess: () => setText("")
// useCourseMutations.ts:27-45
```
**Fix:** Hook `useModalState(initial)` que auto-reseta na mutation.

### [88] Lessons UI duplicada (trainer vs student)
`app/(trainer)/courses/[courseId].tsx:120-135` ≈ `app/(student)/(courses)/[courseId].tsx:95-126`
**Fix:** `<LessonCard variant="trainer|student" />` em `components/courses/`.

### [87] Invalidação de query muito ampla
```ts
// students/index.tsx:42 (water goal mutation)
queryClient.invalidateQueries({ queryKey: ["trainer", "students"] });
// invalida TODAS as 3 abas (active/paused/all) → refetch desnecessário
```
**Fix:** Patch otimista no cache em vez de invalidar.

### [85] `useExercises` carrega 873 exercícios para filtrar client-side
```ts
// hooks/queries/useExercises.ts:62-73
select: (data) => { ... data.filter ... }
```
**Trade-off conhecido:** Permite busca em PT-BR + accent-insensitive sem loops de network. Aceitável para 873 itens (~250KB JSON cacheado).
**Alternativa futura:** Adicionar coluna `name_pt` no banco e fazer ilike server-side.

### [83] Inconsistência: `useCourseDetail` com/sem userId
- Trainer: `useCourseDetail(courseId)`
- Student: `useCourseDetail(courseId, user.id)` ← busca progress
**Fix:** Separar em `useTrainerCourseDetail()` e `useStudentCourseDetail()`.

### [81] `<StudentCard>` inline em FlatList
52 linhas de UI no `renderItem` de `students/index.tsx`. Difícil reutilizar.
**Fix:** Extrair `components/trainer/StudentCard.tsx`.

### [80] Erros silenciados em `lib/whatsapp/client.ts`
```ts
// getQrCode (54-68), getWebhook (142-171)
catch { return null; }  // sem log, sem context
```
**Fix:** `catch (e) { console.error("getQrCode failed:", e); return null; }`.

---

## ✅ Não foram encontrados problemas em
- Tipos TypeScript (zero `tsc --noEmit` errors)
- React hook violations
- Memory leaks (intervals limpos corretamente)
- SQL injection (Supabase client previne)
- Hardcoded secrets em `.env.example`

---

## Prioridade sugerida
1. **3 bugs críticos** (40min) — afetam funcionalidade real
2. **LoadingScreen + LessonCard + StudentCard** (1h) — reduz duplicação
3. **useModalState hook** (30min) — DX melhor
4. **Logs em error catches** (15min) — facilita debug

**Total estimado:** ~2.5h
