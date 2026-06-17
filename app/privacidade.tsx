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

export default function PrivacyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ maxWidth: 720, width: "100%", alignSelf: "center" }}>
        <Pressable onPress={() => router.back()} className="mb-4">
          <Text className="text-violet-400 font-medium text-sm">← Voltar</Text>
        </Pressable>
        <Text className="text-4xl text-text-primary mb-1" style={{ fontFamily: font.display, letterSpacing: -0.4 }}>
          Política de Privacidade
        </Text>
        <Text className="text-xs text-text-muted mb-6" style={{ fontFamily: font.regular }}>Projeto Gaab · Última atualização: 16 de junho de 2026</Text>

        <P>
          Esta Política de Privacidade descreve como <Text style={{ fontFamily: font.semibold }}>[ RAZÃO SOCIAL ]</Text>, inscrita no CNPJ <Text style={{ fontFamily: font.semibold }}>[ CNPJ ]</Text>, com sede em <Text style={{ fontFamily: font.semibold }}>[ ENDEREÇO ]</Text> ("Projeto Gaab", "nós"), coleta, usa, compartilha e protege seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018).
        </P>

        <H>1. Dados que coletamos</H>
        <P>• <Text style={{ fontFamily: font.semibold }}>Cadastro:</Text> nome completo, endereço de e-mail, foto de perfil, função (aluno ou profissional) e data de nascimento.</P>
        <P>• <Text style={{ fontFamily: font.semibold }}>Saúde e composição corporal:</Text> peso, medidas antropométricas, dobras cutâneas e fotos de progresso. Esses dados são classificados como dados sensíveis nos termos do art. 11 da LGPD.</P>
        <P>• <Text style={{ fontFamily: font.semibold }}>Atividade no app:</Text> treinos realizados, planos alimentares, check-ins, registros de refeições e ingestão hídrica.</P>
        <P>• <Text style={{ fontFamily: font.semibold }}>Técnicos:</Text> token de notificação push, endereço IP, sistema operacional e logs de uso para diagnóstico de erros.</P>

        <H>2. Finalidades e base legal</H>
        <P>• Prestação do serviço (art. 7º, V — execução de contrato): prescrição e acompanhamento de treino e dieta entre profissional e aluno.</P>
        <P>• Envio de notificações e lembretes (art. 7º, I — consentimento): mediante aceite expresso no cadastro.</P>
        <P>• Cumprimento de obrigação legal (art. 7º, II): retenção de logs pelo prazo determinado em lei.</P>
        <P>• Melhoria do serviço e análise estatística anonimizada (art. 7º, IX — legítimo interesse).</P>
        <P>Não vendemos, alugamos nem monetizamos seus dados pessoais a terceiros.</P>

        <H>3. Dados sensíveis de saúde</H>
        <P>
          Fotos corporais, medidas e demais dados de saúde são tratados com base no consentimento expresso (art. 11, I). São acessíveis apenas a você e ao(s) profissional(is) ativamente vinculado(s) à sua conta. Fotos armazenadas são servidas exclusivamente por URLs assinadas temporárias; nenhuma URL pública permanente é gerada.
        </P>

        <H>4. Compartilhamento de dados</H>
        <P>• <Text style={{ fontFamily: font.semibold }}>Profissional vinculado:</Text> acessa apenas os dados dos seus próprios alunos (isolamento por Row Level Security no banco de dados).</P>
        <P>• <Text style={{ fontFamily: font.semibold }}>Supabase (EUA):</Text> provedor de banco de dados e armazenamento. A transferência internacional ocorre mediante cláusulas contratuais adequadas.</P>
        <P>• <Text style={{ fontFamily: font.semibold }}>Autoridades públicas:</Text> quando exigido por lei ou ordem judicial.</P>

        <H>5. Seus direitos (LGPD — art. 18)</H>
        <P>Você pode, a qualquer momento: confirmar a existência de tratamento; acessar seus dados; corrigir dados incompletos ou incorretos; solicitar a anonimização, bloqueio ou eliminação; revogar o consentimento; e solicitar portabilidade.</P>
        <P>A exclusão da conta está disponível em <Text style={{ fontFamily: font.semibold }}>Perfil → Excluir conta</Text> e remove ou anonimiza todos os dados pessoais identificáveis. Dados de uso anonimizados podem ser mantidos para fins estatísticos.</P>

        <H>6. Retenção de dados</H>
        <P>Mantemos seus dados enquanto a conta estiver ativa. Após a exclusão, logs de acesso são retidos por 6 (seis) meses conforme exigência legal (Marco Civil da Internet — Lei 12.965/2014). Demais dados pessoais são eliminados em até 30 dias.</P>

        <H>7. Segurança</H>
        <P>Adotamos criptografia em trânsito (TLS), controle de acesso por função (RBAC), autenticação segura e auditoria de acessos. Não há garantia absoluta de segurança em sistemas digitais; em caso de incidente relevante, notificaremos os titulares e a ANPD nos prazos legais.</P>

        <H>8. Alterações nesta Política</H>
        <P>Podemos atualizar esta Política periodicamente. Notificaremos alterações relevantes por e-mail ou notificação no app com, no mínimo, 10 dias de antecedência.</P>

        <H>9. Contato e Encarregado (DPO)</H>
        <P>Para exercer seus direitos ou tirar dúvidas sobre privacidade, entre em contato com nosso Encarregado de Dados:</P>
        <P>E-mail: <Text style={{ fontFamily: font.semibold }}>[ E-MAIL DPO ]</Text></P>
        <P>Endereço: <Text style={{ fontFamily: font.semibold }}>[ ENDEREÇO ]</Text></P>

        <H>10. Foro</H>
        <P>Fica eleito o foro da comarca de <Text style={{ fontFamily: font.semibold }}>[ CIDADE DO FORO ]</Text> para dirimir eventuais controvérsias decorrentes desta Política.</P>

        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
}
