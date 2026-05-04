import { motion } from "framer-motion";
import { pageVariants } from "../hooks/useMascotAnimation";
import PublicPageLayout from "../components/PublicPageLayout";

const sections = [
  {
    id: "overview",
    title: "1. Visão Geral",
    content: `Esta Política de Privacidade descreve como o Programático coleta, usa, armazena e protege as informações pessoais dos usuários. Ao usar nossa plataforma, você concorda com as práticas descritas neste documento. Se não concordar, por favor não utilize nossos serviços.`,
  },
  {
    id: "data-collected",
    title: "2. Dados que Coletamos",
    content: `Coletamos as seguintes informações:

• Dados de cadastro: nome de usuário, endereço de e-mail e idade, fornecidos no momento do registro.
• Dados de uso: progresso nos exercícios, XP acumulado, ofensivas, módulos concluídos e nível de habilidade.
• Dados técnicos: endereço IP, tipo de navegador e sistema operacional, usados exclusivamente para segurança e melhoria da plataforma.

Não coletamos dados de pagamento diretamente — quando aplicável, esse processamento é feito por parceiros certificados PCI-DSS.`,
  },
  {
    id: "data-use",
    title: "3. Como Usamos os Dados",
    content: `Utilizamos seus dados para:

• Criar e gerenciar sua conta na plataforma.
• Personalizar sua experiência de aprendizado de acordo com seu nível e progresso.
• Enviar comunicações essenciais, como códigos de ativação, redefinição de senha e confirmações de segurança.
• Analisar o uso da plataforma para melhorar funcionalidades e conteúdos.
• Detectar e prevenir fraudes ou abusos.

Não utilizamos seus dados para publicidade de terceiros.`,
  },
  {
    id: "data-sharing",
    title: "4. Compartilhamento de Dados",
    content: `O Programático não vende, aluga ou compartilha seus dados pessoais com terceiros para fins comerciais. Podemos compartilhar informações apenas nas seguintes situações:

• Com prestadores de serviço técnico (como provedores de e-mail e hospedagem) estritamente necessários para o funcionamento da plataforma, sempre sob acordo de confidencialidade.
• Quando exigido por lei ou ordem judicial.
• Com seu consentimento explícito.`,
  },
  {
    id: "data-storage",
    title: "5. Armazenamento e Segurança",
    content: `Seus dados são armazenados em servidores seguros com criptografia em repouso e em trânsito (HTTPS/TLS). Senhas nunca são armazenadas em texto puro — utilizamos algoritmos de hash seguros. Adotamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição.`,
  },
  {
    id: "retention",
    title: "6. Retenção de Dados",
    content: `Mantemos seus dados enquanto sua conta estiver ativa. Ao solicitar a exclusão da conta, todos os seus dados pessoais são permanentemente removidos dos nossos sistemas em até 30 dias, exceto quando a retenção for exigida por obrigação legal.`,
  },
  {
    id: "your-rights",
    title: "7. Seus Direitos",
    content: `De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:

• Acesso: solicitar uma cópia dos seus dados pessoais armazenados.
• Correção: atualizar dados incorretos ou incompletos diretamente no seu perfil.
• Exclusão: solicitar a exclusão permanente da sua conta e dados.
• Portabilidade: solicitar seus dados em formato estruturado.
• Oposição: manifestar-se contra o tratamento de dados em determinadas situações.

Para exercer qualquer desses direitos, entre em contato pelo e-mail: privacidade@programatico.com.br`,
  },
  {
    id: "cookies",
    title: "8. Cookies e Armazenamento Local",
    content: `Utilizamos armazenamento local (localStorage) no seu navegador exclusivamente para manter sua sessão autenticada de forma segura. Não utilizamos cookies de rastreamento de terceiros ou técnicas de fingerprinting.`,
  },
  {
    id: "minors",
    title: "9. Menores de Idade",
    content: `A plataforma é voltada a usuários com 13 anos ou mais. Não coletamos intencionalmente dados de crianças menores de 13 anos. Se tomarmos conhecimento de que coletamos dados de uma criança abaixo dessa idade sem o consentimento dos responsáveis, removeremos essas informações imediatamente.`,
  },
  {
    id: "updates",
    title: "10. Atualizações desta Política",
    content: `Podemos atualizar esta Política de Privacidade periodicamente. Quando forem feitas alterações relevantes, você será notificado por e-mail ou por aviso na plataforma. A data da última atualização será sempre indicada no topo desta página.`,
  },
  {
    id: "contact",
    title: "11. Contato",
    content: `Para dúvidas, solicitações ou reclamações relacionadas à privacidade e ao tratamento dos seus dados, entre em contato pelo e-mail: privacidade@programatico.com.br. Respondemos em até 10 dias úteis.`,
  },
];

export default function PrivacyPage() {
  return (
    <PublicPageLayout>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="max-w-3xl mx-auto px-6 md:px-8 py-12 md:py-16"
      >
        {/* ── Header ── */}
        <div className="mb-10">
          <span className="inline-block text-base font-semibold tracking-widest text-accent-light bg-accent/20 border border-accent/40 rounded-full px-4 py-1 uppercase mb-4">
            Legal
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Política de Privacidade
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Última atualização: Janeiro de 2026
          </p>
          <div className="mt-5 p-4 bg-bg-card-inner border border-gray-border rounded-xl">
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
              Sua privacidade é uma prioridade para o Programático. Este
              documento explica de forma clara e transparente como tratamos as
              suas informações pessoais, em conformidade com a{" "}
              <strong className="text-white">LGPD (Lei nº 13.709/2018)</strong>.
            </p>
          </div>
        </div>

        {/* ── Índice ── */}
        <nav className="mb-10 p-5 bg-bg-card border border-gray-border rounded-2xl">
          <p className="text-base font-semibold text-text-muted uppercase tracking-widest mb-3">
            Índice
          </p>
          <ol className="flex flex-col gap-1">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-lg text-text-secondary hover:text-white transition-colors"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ── Sections ── */}
        <div className="flex flex-col gap-10">
          {sections.map((s, i) => (
            <motion.section
              key={s.id}
              id={s.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
            >
              <h2 className="text-xl font-bold text-white mb-3">{s.title}</h2>
              <div className="w-8 h-0.5 bg-accent rounded-full mb-4" />
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed whitespace-pre-line">
                {s.content}
              </p>
            </motion.section>
          ))}
        </div>
      </motion.div>
    </PublicPageLayout>
  );
}
