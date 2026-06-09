import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { font } from "../lib/design/tokens";

function P({ children }: { children: React.ReactNode }) {
  return <Text className="text-sm text-text-secondary leading-6 mb-3" style={{ fontFamily: font.regular }}>{children}</Text>;
}
function H({ children }: { children: React.ReactNode }) {
  return <Text className="text-xl text-text-primary mt-6 mb-2" style={{ fontFamily: font.display, letterSpacing: -0.2 }}>{children}</Text>;
}

export default function TermsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ maxWidth: 720, width: "100%", alignSelf: "center" }}>
        <Pressable onPress={() => router.back()} className="mb-4">
          <Text className="text-violet-400 font-medium text-sm">← Voltar</Text>
        </Pressable>
        <Text className="text-4xl text-text-primary mb-1" style={{ fontFamily: font.display, letterSpacing: -0.4 }}>
          Termos de Uso
        </Text>
        <Text className="text-xs text-text-muted mb-4" style={{ fontFamily: font.regular }}>Projeto Gaab · Última atualização: a definir</Text>

        <View className="bg-warning-500/10 border border-warning-500/30 rounded-2xl p-3.5 mb-4">
          <Text className="text-xs text-warning-500" style={{ fontFamily: font.semibold }}>
            RASCUNHO — substituir pelo texto final revisado juridicamente antes do lançamento.
          </Text>
        </View>

        <P>
          Ao criar uma conta no Projeto Gaab, você concorda com estes Termos. O app conecta personal trainers e
          nutricionistas a seus alunos para prescrição e acompanhamento de treino e dieta.
        </P>

        <H>1. Uso do serviço</H>
        <P>
          Você é responsável pela veracidade dos dados e pelo uso adequado da conta. É proibido uso indevido,
          tentativa de acesso a dados de outros usuários ou violação de leis aplicáveis.
        </P>

        <H>2. Disclaimer médico</H>
        <P>
          O conteúdo (treinos, dietas, recomendações) é fornecido por profissionais e tem caráter informativo. Não
          substitui avaliação médica. Consulte um médico antes de iniciar qualquer programa. Em caso de mal-estar,
          interrompa e procure atendimento.
        </P>

        <H>3. Conta e responsabilidades do profissional</H>
        <P>
          Profissionais são responsáveis pela adequação das prescrições aos seus alunos e por suas obrigações
          legais e de conselho de classe (ex.: CREF/CRN).
        </P>

        <H>4. Pagamentos</H>
        <P>
          Planos e cobranças entre profissional e aluno, quando aplicáveis, são de responsabilidade das partes.
          (Detalhar conforme o modelo de cobrança adotado.)
        </P>

        <H>5. Cancelamento e exclusão</H>
        <P>Você pode encerrar sua conta a qualquer momento em Perfil → Excluir conta.</P>

        <H>6. Limitação de responsabilidade</H>
        <P>O app é fornecido "como está". Não nos responsabilizamos por lesões decorrentes do uso indevido. (Revisar com jurídico.)</P>

        <H>7. Contato</H>
        <P>suporte@academiaapp.com (definir).</P>

        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
}
