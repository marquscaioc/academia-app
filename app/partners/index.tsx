import { Redirect, router } from "expo-router";
import { useState } from "react";
import { Linking, Modal, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../lib/auth/provider";
import { font, palette } from "../../lib/design/tokens";
import { PARTNER_PROFESSIONS, PartnerDraft, PartnerProfession, normalizeProfessionalUrl, validatePartnerDraft, whatsappContactUrl } from "../../lib/partners/contact";
import { ProfessionalPartner, useDeleteProfessionalPartner, useProfessionalPartners, useSaveProfessionalPartner, useSaveTrainerContact, useTrainerContacts } from "../../hooks/queries/useProfessionalPartners";
import { AppIcon, Button, DisplayHeading, EmptyState, Input, LoadingScreen } from "../../components/ui";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { WebContainer } from "../../components/layout/WebContainer";
import { toast } from "../../stores/useToastStore";

async function openContact(url: string | null) {
  if (!url) {
    toast.error("Contato indisponível", "Peça ao treinador para atualizar este contato.");
    return;
  }
  try {
    await Linking.openURL(url);
  } catch {
    toast.error("Não foi possível abrir o link", "Tente novamente ou verifique seu aplicativo de navegação.");
  }
}

function ErrorNotice({ retry }: { retry: () => void }) {
  return <View className="gap-3 rounded-2xl border border-surface-border bg-surface-card p-5">
    <Text className="text-sm text-text-secondary" style={{ fontFamily: font.regular }}>Não foi possível carregar os contatos.</Text>
    <Button title="Tentar novamente" variant="outline" onPress={retry} />
  </View>;
}

function TrainerContactEditor({ trainerId, initial }: { trainerId: string; initial: string }) {
  const [phone, setPhone] = useState(initial);
  const save = useSaveTrainerContact(trainerId);
  const submit = async () => {
    try {
      await save.mutateAsync(phone);
      toast.success(phone.trim() ? "Contato publicado" : "Contato removido");
    } catch (error) {
      toast.error("Não foi possível salvar", error instanceof Error ? error.message : "Verifique os dados e tente novamente.");
    }
  };
  return <View className="rounded-3xl border border-surface-border bg-surface-card p-5 gap-4">
    <Text className="text-lg text-text-primary" style={{ fontFamily: font.semibold }}>Seu WhatsApp profissional</Text>
    <Text className="text-sm text-text-secondary" style={{ fontFamily: font.regular }}>Publique um contato para seus alunos ativos. Deixe em branco para remover.</Text>
    <Input label="WhatsApp com código do país e DDD" value={phone} onChangeText={setPhone} placeholder="+55 11 99999-9999" keyboardType="phone-pad" maxLength={30} />
    <Button title="Salvar contato" variant="outline" onPress={submit} loading={save.isPending} />
  </View>;
}

function PartnerEditor({ partner, trainerId, onClose }: { partner?: ProfessionalPartner; trainerId: string; onClose: () => void }) {
  const [draft, setDraft] = useState<PartnerDraft>({
    full_name: partner?.full_name ?? "", profession: partner?.profession ?? "nutritionist",
    specialty: partner?.specialty ?? "", registration: partner?.registration ?? "",
    bio: partner?.bio ?? "", whatsapp_number: partner?.whatsapp_number ?? "",
    booking_url: partner?.booking_url ?? "", content_url: partner?.content_url ?? "",
    is_active: partner?.is_active ?? true,
  });
  const [error, setError] = useState<string | null>(null);
  const save = useSaveProfessionalPartner(trainerId);
  const field = (name: keyof PartnerDraft, value: string | boolean) => setDraft((current) => ({ ...current, [name]: value }));
  const submit = async () => {
    setError(null);
    try {
      validatePartnerDraft(draft);
      await save.mutateAsync({ id: partner?.id, draft });
      toast.success(partner ? "Profissional atualizado" : "Profissional cadastrado");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar. Confira os dados e tente novamente.");
    }
  };
  return <Modal visible transparent animationType="slide" onRequestClose={save.isPending ? undefined : onClose}>
    <SafeAreaView className="flex-1 bg-black/70 items-center justify-center p-4">
      <View className="w-full max-w-[620px] max-h-[94%] bg-dark-200 border border-surface-border rounded-3xl overflow-hidden" accessibilityViewIsModal aria-modal>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="p-6 gap-5">
          <DisplayHeading size="md">{partner ? "Editar profissional" : "Indicar profissional"}</DisplayHeading>
          <Input label="Nome profissional" value={draft.full_name} onChangeText={(v) => field("full_name", v)} maxLength={120} />
          <View className="flex-row flex-wrap gap-2">
            {(Object.keys(PARTNER_PROFESSIONS) as PartnerProfession[]).map((profession) => <Pressable key={profession} accessibilityRole="radio" aria-checked={draft.profession === profession} onPress={() => field("profession", profession)} className={`rounded-2xl border px-4 py-3 ${draft.profession === profession ? "bg-violet-500/20 border-violet-500" : "border-surface-border"}`}>
              <Text className="text-sm text-text-primary" style={{ fontFamily: font.semibold }}>{PARTNER_PROFESSIONS[profession]}</Text>
            </Pressable>)}
          </View>
          <Input label="Especialidade / área de atuação" value={draft.specialty} onChangeText={(v) => field("specialty", v)} maxLength={160} />
          <Input label="CRN ou CRM/RQE (opcional)" value={draft.registration} onChangeText={(v) => field("registration", v)} maxLength={80} />
          <Input label="Apresentação (opcional)" value={draft.bio} onChangeText={(v) => field("bio", v)} multiline maxLength={1200} />
          <Input label="WhatsApp com código do país e DDD" value={draft.whatsapp_number} onChangeText={(v) => field("whatsapp_number", v)} placeholder="+55 11 99999-9999" keyboardType="phone-pad" maxLength={30} />
          <Input label="Link de agendamento (opcional)" value={draft.booking_url} onChangeText={(v) => field("booking_url", v)} placeholder="https://" autoCapitalize="none" keyboardType="url" maxLength={2000} />
          <Input label="Site com conteúdos do profissional (opcional)" value={draft.content_url} onChangeText={(v) => field("content_url", v)} placeholder="https://" autoCapitalize="none" keyboardType="url" maxLength={2000} />
          <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>Preencha ao menos um WhatsApp ou link de agendamento.</Text>
          <View className="flex-row items-center justify-between gap-3">
            <Text className="text-sm text-text-primary flex-1" style={{ fontFamily: font.semibold }}>Visível para seus alunos</Text>
            <Switch value={draft.is_active} onValueChange={(value) => field("is_active", value)} accessibilityLabel="Visível para seus alunos" trackColor={{ true: palette.violet500 }} />
          </View>
          {error ? <Text accessibilityRole="alert" className="text-sm text-danger-500" style={{ fontFamily: font.regular }}>{error}</Text> : null}
          <Button title="Salvar profissional" onPress={submit} loading={save.isPending} />
          <Button title="Cancelar" variant="ghost" onPress={onClose} disabled={save.isPending} />
        </ScrollView>
      </View>
    </SafeAreaView>
  </Modal>;
}

function PartnersContent({ userId, isTrainer }: { userId: string; isTrainer: boolean }) {
  const partners = useProfessionalPartners(userId, isTrainer);
  const contacts = useTrainerContacts(userId, isTrainer);
  const remove = useDeleteProfessionalPartner(isTrainer ? userId : undefined);
  const [editing, setEditing] = useState<ProfessionalPartner | "new" | null>(null);
  const [deleting, setDeleting] = useState<ProfessionalPartner | null>(null);
  const [filter, setFilter] = useState<PartnerProfession | null>(null);
  const chat = () => router.push((isTrainer ? "/(trainer)/chat" : "/(student)/(chat)") as never);
  const ownContact = contacts.data?.find((contact) => contact.id === userId);
  const visible = partners.data?.filter((partner) => !filter || partner.profession === filter) ?? [];
  const deletePartner = async () => {
    if (!deleting) return;
    try {
      await remove.mutateAsync(deleting.id);
      setDeleting(null);
      toast.success("Profissional removido");
    } catch {
      toast.error("Não foi possível remover", "Tente novamente.");
    }
  };
  return <SafeAreaView className="flex-1 bg-dark-400">
    <ScrollView contentContainerClassName="pb-12">
      <WebContainer maxWidth={850}>
        <View className="px-6 pt-6 gap-6">
          <Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={() => router.canGoBack() ? router.back() : router.replace("/")} className="self-start p-2 -ml-2"><AppIcon name="arrow-left" size={22} color="#52525B" /></Pressable>
          <View className="gap-3"><DisplayHeading>Rede de apoio</DisplayHeading><Text className="text-sm text-text-secondary" style={{ fontFamily: font.regular }}>{isTrainer ? "Compartilhe contatos profissionais com seus alunos." : "Nutricionistas e médicos indicados pelo seu treinador."}</Text></View>
          {contacts.isError ? <ErrorNotice retry={() => { void contacts.refetch(); }} /> : contacts.isLoading ? <Text className="text-sm text-text-muted font-sans">Carregando contatos…</Text> : isTrainer ? <TrainerContactEditor key={ownContact?.contact_whatsapp ?? "empty"} trainerId={userId} initial={ownContact?.contact_whatsapp ?? ""} /> : <View className="gap-3">
            {(contacts.data ?? []).filter((contact) => !!contact.contact_whatsapp).map((contact) => <View key={contact.id} className="rounded-3xl border border-surface-border bg-surface-card p-5 gap-3">
              <Text className="text-lg text-text-primary" style={{ fontFamily: font.semibold }}>{contact.brand_name || "Seu treinador"}</Text>
              {contact.specializations?.length ? <Text className="text-sm text-text-secondary" style={{ fontFamily: font.regular }}>{contact.specializations.join(" · ")}</Text> : null}
              <Button title="Conversar pelo WhatsApp" variant="outline" onPress={() => { void openContact(whatsappContactUrl(contact.contact_whatsapp!, "Olá! Gostaria de conversar sobre meu acompanhamento no Projeto Gaab.")); }} />
            </View>)}
          </View>}
          <Button title={isTrainer ? "Abrir conversas com alunos" : "Conversar pelo chat"} variant="secondary" onPress={chat} />
          <View className="gap-3"><DisplayHeading size="md">Profissionais indicados</DisplayHeading>{isTrainer ? <Button title="Indicar profissional" onPress={() => setEditing("new")} /> : null}</View>
          <View className="flex-row flex-wrap gap-2">{([null, "nutritionist", "sports_doctor"] as const).map((value) => <Pressable key={value ?? "all"} accessibilityRole="radio" aria-checked={filter === value} onPress={() => setFilter(value)} className={`rounded-2xl border px-4 py-2.5 ${filter === value ? "bg-violet-500/20 border-violet-500" : "border-surface-border"}`}><Text className="text-sm text-text-primary" style={{ fontFamily: font.medium }}>{value ? PARTNER_PROFESSIONS[value] : "Todos"}</Text></Pressable>)}</View>
          {partners.isError ? <ErrorNotice retry={() => { void partners.refetch(); }} /> : partners.isLoading ? <Text className="text-sm text-text-muted font-sans">Carregando profissionais…</Text> : !visible.length ? <EmptyState iconName="user" title="Nenhum profissional" description={isTrainer ? "Cadastre um profissional para apresentar sua rede aos alunos." : "Os profissionais indicados pelo seu treinador aparecerão aqui."} /> : visible.map((partner) => <View key={partner.id} className="rounded-3xl border border-surface-border bg-surface-card p-6 gap-3">
            <Text className="text-xs text-violet-300 uppercase" style={{ fontFamily: font.semibold, letterSpacing: 1 }}>{PARTNER_PROFESSIONS[partner.profession]}{!partner.is_active ? " · Oculto" : ""}</Text>
            <DisplayHeading size="sm">{partner.full_name}</DisplayHeading>
            <Text className="text-sm text-text-primary" style={{ fontFamily: font.medium }}>{partner.specialty}</Text>
            {partner.registration ? <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>{partner.registration}</Text> : null}
            {partner.bio ? <Text className="text-sm text-text-secondary leading-6" style={{ fontFamily: font.regular }}>{partner.bio}</Text> : null}
            {partner.whatsapp_number ? <Button title="Conversar pelo WhatsApp" variant="outline" onPress={() => { void openContact(whatsappContactUrl(partner.whatsapp_number!, `Olá, ${partner.full_name}! Recebi sua indicação pelo Projeto Gaab e gostaria de informações sobre o atendimento.`)); }} /> : null}
            {partner.booking_url ? <Button title="Agendar atendimento" variant="secondary" onPress={() => { void openContact(normalizeProfessionalUrl(partner.booking_url!)); }} /> : null}
            {partner.content_url ? <Button title="Ver conteúdos do profissional" variant="ghost" onPress={() => { void openContact(normalizeProfessionalUrl(partner.content_url!)); }} /> : null}
            {isTrainer ? <View className="flex-row flex-wrap gap-3 pt-2"><Button title="Editar" variant="ghost" fullWidth={false} onPress={() => setEditing(partner)} /><Button title="Remover" variant="ghost" fullWidth={false} onPress={() => setDeleting(partner)} /></View> : null}
          </View>)}
        </View>
      </WebContainer>
    </ScrollView>
    {editing && isTrainer ? <PartnerEditor partner={editing === "new" ? undefined : editing} trainerId={userId} onClose={() => setEditing(null)} /> : null}
    <ConfirmDialog visible={!!deleting} title="Remover profissional?" message={deleting ? `${deleting.full_name} deixará de aparecer para seus alunos.` : undefined} confirmLabel="Remover" destructive loading={remove.isPending} onConfirm={() => { void deletePartner(); }} onCancel={() => setDeleting(null)} />
  </SafeAreaView>;
}

export default function PartnersScreen() {
  const { user, role, profile, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!user) return <Redirect href="/(auth)/login" />;
  if (!profile?.onboarding_completed) return <Redirect href="/(auth)/onboarding" />;
  if (role !== "trainer" && role !== "student") return <Redirect href="/" />;
  return <PartnersContent key={user.id} userId={user.id} isTrainer={role === "trainer"} />;
}
