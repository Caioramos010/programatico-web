import { motion } from "framer-motion";
import { pageVariants } from "../hooks/useMascotAnimation";
import PublicPageLayout from "../components/PublicPageLayout";

const sections = [
  {
    id: "aceitacao",
    title: "1. Aceitação dos Termos",
    content: `Ao acessar ou usar o Programático, você concorda com estes Termos de Uso. Se não concordar com qualquer parte destes termos, não utilize a plataforma. O uso contínuo da plataforma após alterações nos termos constitui aceitação das mudanças.`,
  },
  {
    id: "descricao",
    title: "2. Descrição do Serviço",
    content: `O Programático é uma plataforma educacional online focada no ensino de lógica de programação. Oferecemos exercícios interativos, sistema de gamificação com XP e ofensivas, além de conteúdos progressivos adaptados ao nível do usuário. O acesso básico à plataforma é gratuito.`,
  },
  {
    id: "conta",
    title: "3. Registro e Conta",
    content: `Para utilizar os recursos da plataforma, você deve criar uma conta com informações verdadeiras e completas. Você é responsável por manter a confidencialidade do acesso à sua conta e por todas as atividades realizadas com ela. O nome de usuário escolhido deve ser único na plataforma e não pode conter conteúdo ofensivo, enganoso ou que viole direitos de terceiros.`,
  },
  {
    id: "uso",
    title: "4. Uso Aceitável",
    content: `Você concorda em não usar a plataforma para: (a) violar qualquer lei ou regulamento aplicável; (b) publicar conteúdo falso, enganoso, ofensivo, difamatório ou que incite ódio; (c) tentar acessar sistemas ou dados sem autorização; (d) interferir no funcionamento normal da plataforma; (e) criar contas múltiplas para burlar restrições ou sistemas de ranking; (f) reproduzir, distribuir ou comercializar conteúdo da plataforma sem autorização prévia.`,
  },
  {
    id: "propriedade",
    title: "5. Propriedade Intelectual",
    content: `Todo o conteúdo da plataforma — incluindo textos, exercícios, ilustrações, a mascote e o design — é protegido por direitos autorais e propriedade intelectual do Programático. É vedada a reprodução, cópia ou distribuição de qualquer conteúdo sem autorização expressa. O usuário retém a propriedade sobre o conteúdo que eventualmente criar ou submeter na plataforma.`,
  },
  {
    id: "privacidade",
    title: "6. Privacidade",
    content: `Sua privacidade é importante para nós. A coleta, uso e proteção dos seus dados pessoais são regidos por nossa Política de Privacidade, que é parte integrante destes Termos. Ao usar a plataforma, você concorda com as práticas descritas na Política de Privacidade.`,
  },
  {
    id: "encerramento",
    title: "7. Encerramento de Conta",
    content: `Você pode encerrar sua conta a qualquer momento através das configurações do seu perfil. Após confirmação via código enviado por e-mail, todos os seus dados serão permanentemente excluídos. O Programático se reserva o direito de suspender ou encerrar contas que violem estes Termos de Uso.`,
  },
  {
    id: "responsabilidade",
    title: "8. Limitação de Responsabilidade",
    content: `A plataforma é fornecida "como está", sem garantias de qualquer tipo. O Programático não se responsabiliza por interrupções temporárias do serviço, perda de dados decorrente de falhas técnicas imprevisíveis, ou pelo desempenho do usuário em avaliações ou processos seletivos. Em nenhum caso nossa responsabilidade excederá o valor pago pelo usuário nos últimos 12 meses.`,
  },
  {
    id: "alteracoes",
    title: "9. Alterações nos Termos",
    content: `Podemos atualizar estes Termos de Uso periodicamente. Alterações significativas serão comunicadas por e-mail ou por aviso na plataforma com antecedência mínima de 15 dias. O uso contínuo da plataforma após esse prazo constitui aceitação dos novos termos.`,
  },
  {
    id: "contato",
    title: "10. Contato",
    content: `Dúvidas sobre estes Termos de Uso podem ser enviadas para: contato@programatico.com.br. Nossa equipe responde em até 5 dias úteis.`,
  },
];

export default function TermsPage() {
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
            Termos de Uso
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Última atualização: Janeiro de 2026
          </p>
          <div className="mt-5 p-4 bg-bg-card-inner border border-gray-border rounded-xl">
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
              Leia atentamente estes Termos antes de usar o Programático. Eles
              definem os direitos e responsabilidades de todos os usuários da
              plataforma.
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
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
                {s.content}
              </p>
            </motion.section>
          ))}
        </div>
      </motion.div>
    </PublicPageLayout>
  );
}
