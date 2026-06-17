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
        <Text className="text-xs text-text-muted mb-6" style={{ fontFamily: font.regular }}>Projeto Gaab · Última atualização: 16 de junho de 2026</Text>

        <P>
          Ao criar uma conta no Projeto Gaab, aplicativo de gestão de treino e nutrição operado por <Text style={{ fontFamily: font.semibold }}>[ RAZÃO SOCIAL ]</Text>, CNPJ <Text style={{ fontFamily: font.semibold }}>[ CNPJ ]</Text> ("nós"), você declara ter lido, compreendido e aceito integralmente estes Termos de Uso. Se não concordar, não utilize o serviço.
        </P>

        <H>1. O serviço</H>
        <P>
          O Projeto Gaab é uma plataforma SaaS que conecta profissionais de educação física e nutrição (personal trainers, nutricionistas) aos seus alunos e pacientes para prescrição, acompanhamento e registro de treinos e dietas. O acesso é mediante convite do profissional ou cadastro aprovado.
        </P>

        <H>2. Elegibilidade e conta</H>
        <P>• Você deve ter no mínimo 18 anos ou ser emancipado legalmente para criar uma conta.</P>
        <P>• Você é responsável pela veracidade das informações fornecidas no cadastro e por manter sua senha confidencial.</P>
        <P>• Cada pessoa pode manter uma única conta ativa. Contas compartilhadas são vedadas.</P>
        <P>• Reservamo-nos o direito de suspender contas que violem estes Termos.</P>

        <H>3. Uso permitido e proibições</H>
        <P>É vedado: (i) tentar acessar dados de outros usuários; (ii) realizar engenharia reversa do app; (iii) utilizar o serviço para fins ilegais; (iv) enviar conteúdo ofensivo, spam ou malware; (v) revender ou sublicenciar o acesso.</P>

        <H>4. Disclaimer de saúde</H>
        <P>
          O conteúdo disponibilizado (treinos, planos alimentares, orientações) é elaborado por profissionais habilitados e tem caráter informativo e de suporte à prática profissional. <Text style={{ fontFamily: font.semibold }}>Não substitui avaliação ou acompanhamento médico.</Text> Consulte um médico antes de iniciar qualquer programa de exercícios ou mudança alimentar. Em caso de sintomas adversos, interrompa imediatamente e procure atendimento de emergência.
        </P>

        <H>5. Responsabilidades do profissional</H>
        <P>
          Profissionais (personal trainers, nutricionistas) são os únicos responsáveis pela adequação técnica das prescrições a cada aluno, pelo cumprimento dos códigos de ética e das obrigações legais perante seus conselhos de classe (CREF, CRN, CRM, etc.), e por obter o consentimento informado dos alunos para o tratamento de dados de saúde.
        </P>

        <H>6. Conteúdo do usuário</H>
        <P>
          Você mantém a propriedade do conteúdo que inserir (fotos, registros, anotações). Ao inserir conteúdo, concede a nós uma licença não exclusiva, gratuita e limitada para armazená-lo e exibi-lo exclusivamente para a prestação do serviço. Não utilizamos seu conteúdo para treinamento de modelos de IA.
        </P>

        <H>7. Pagamentos e assinaturas</H>
        <P>
          Funcionalidades premium podem exigir assinatura paga. Valores, periodicidade e condições de cancelamento serão exibidos no momento da contratação. Reembolsos seguem a política descrita no ato da compra e as regras das lojas de aplicativos (App Store / Google Play).
        </P>

        <H>8. Suspensão e encerramento</H>
        <P>Você pode excluir sua conta a qualquer momento em <Text style={{ fontFamily: font.semibold }}>Perfil → Excluir conta</Text>. Podemos suspender ou encerrar contas que violem estes Termos, mediante aviso prévio quando possível.</P>

        <H>9. Limitação de responsabilidade</H>
        <P>
          O serviço é fornecido "no estado em que se encontra". Na máxima extensão permitida em lei, não nos responsabilizamos por danos indiretos, lucros cessantes ou lesões decorrentes do uso indevido das prescrições. Nossa responsabilidade total fica limitada ao valor pago pelo usuário nos últimos 12 meses.
        </P>

        <H>10. Propriedade intelectual</H>
        <P>O app, marca "Projeto Gaab", design e código-fonte são de nossa propriedade exclusiva ou licenciados a nós. O uso do serviço não transfere nenhum direito de propriedade intelectual ao usuário.</P>

        <H>11. Alterações nos Termos</H>
        <P>Podemos alterar estes Termos a qualquer momento. Notificaremos mudanças relevantes com pelo menos 10 dias de antecedência. O uso continuado após a vigência das alterações configura aceite.</P>

        <H>12. Lei aplicável e foro</H>
        <P>Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de <Text style={{ fontFamily: font.semibold }}>[ CIDADE DO FORO ]</Text> para dirimir eventuais litígios, com renúncia a qualquer outro.</P>

        <H>13. Contato</H>
        <P>Dúvidas sobre estes Termos: <Text style={{ fontFamily: font.semibold }}>[ E-MAIL DPO ]</Text></P>

        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
}
