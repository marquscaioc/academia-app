import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function P({ children }: { children: React.ReactNode }) {
  return <Text className="text-sm text-text-secondary leading-6 mb-3" style={{ fontFamily: "Nunito_400Regular" }}>{children}</Text>;
}
function H({ children }: { children: React.ReactNode }) {
  return <Text className="text-base font-black text-text-primary mt-5 mb-2" style={{ fontFamily: "Nunito_700Bold" }}>{children}</Text>;
}

export default function PrivacyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ maxWidth: 720, width: "100%", alignSelf: "center" }}>
        <Pressable onPress={() => router.back()} className="mb-4">
          <Text className="text-violet-400 font-medium text-sm">← Voltar</Text>
        </Pressable>
        <Text className="text-2xl font-black text-text-primary mb-1">Política de Privacidade</Text>
        <Text className="text-xs text-text-muted mb-4">Academia App · Última atualização: a definir</Text>

        <View className="bg-warning-500/10 border border-warning-500/30 rounded-xl p-3 mb-4">
          <Text className="text-xs text-warning-500" style={{ fontFamily: "Nunito_600SemiBold" }}>
            RASCUNHO — substituir pelo texto final revisado juridicamente antes do lançamento.
          </Text>
        </View>

        <P>
          Esta Política descreve como o Academia App ("nós") coleta, usa e protege seus dados pessoais, em
          conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018).
        </P>

        <H>1. Dados que coletamos</H>
        <P>• Cadastro: nome, e-mail, foto de perfil, função (aluno/personal), data de nascimento.</P>
        <P>• Saúde e composição corporal: peso, medidas, dobras cutâneas, fotos de progresso.</P>
        <P>• Atividade: treinos, dietas, check-ins, registros alimentares e de água.</P>
        <P>• Técnicos: token de notificação push e dados de uso do app.</P>
        <P>• Opcional: número de WhatsApp (mediante consentimento) para lembretes.</P>

        <H>2. Como usamos</H>
        <P>
          Para prestar o serviço (prescrição e acompanhamento entre profissional e aluno), enviar lembretes e
          notificações, gerar relatórios de progresso e melhorar o app. Não vendemos seus dados.
        </P>

        <H>3. Dados sensíveis de saúde</H>
        <P>
          Fotos corporais e medidas são dados sensíveis. São acessíveis apenas a você e ao(s) profissional(is)
          ativamente vinculado(s) a você. Fotos privadas são servidas por URLs assinadas temporárias.
        </P>

        <H>4. Compartilhamento</H>
        <P>
          Compartilhamos dados com o profissional vinculado e com prestadores de infraestrutura (ex.: Supabase
          para banco/armazenamento). Cada profissional só acessa os próprios alunos (isolamento por RLS).
        </P>

        <H>5. Seus direitos (LGPD)</H>
        <P>
          Você pode acessar, corrigir, exportar e excluir seus dados, além de revogar consentimentos. A exclusão
          da conta está disponível no app (Perfil → Excluir conta) e remove/anonimiza seus dados pessoais.
        </P>

        <H>6. Retenção</H>
        <P>Mantemos os dados enquanto a conta existir e pelo prazo legal aplicável após a exclusão. (Definir prazo.)</P>

        <H>7. Contato / Encarregado (DPO)</H>
        <P>Para exercer seus direitos, contate: privacidade@academiaapp.com (definir).</P>

        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
}
