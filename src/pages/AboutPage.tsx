import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, BookOpen, Users, HeartHandshake } from "lucide-react";
import { pageVariants, mascotEnterVariants } from "../hooks/useMascotAnimation";
import Base from "../components/mascot/Base";
import SpeechBubble from "../components/SpeechBubble";
import Button from "../components/Button";
import PublicPageLayout from "../components/PublicPageLayout";

const values = [
  {
    icon: <BookOpen className="w-7 h-7 text-white" />,
    title: "Aprendizado Acessível",
    description:
      "Acreditamos que aprender a programar deve ser possível para qualquer pessoa, independente de experiência ou background.",
    bg: "bg-accent",
  },
  {
    icon: <Zap className="w-7 h-7 text-white" />,
    title: "Prática em Primeiro Lugar",
    description:
      "Fugimos da teoria infinita. Cada conceito é apresentado com exercícios práticos que reforçam o aprendizado de verdade.",
    bg: "bg-[var(--color-premium)]",
  },
  {
    icon: <Users className="w-7 h-7 text-white" />,
    title: "Comunidade Ativa",
    description:
      "Construímos uma plataforma onde alunos evoluem juntos, competem em ranking e se motivam mutuamente.",
    bg: "bg-[var(--color-success)]",
  },
  {
    icon: <HeartHandshake className="w-7 h-7 text-white" />,
    title: "Suporte Contínuo",
    description:
      "Nossa equipe está sempre trabalhando para melhorar a experiência e ouvir o feedback da comunidade.",
    bg: "bg-[var(--color-accent-light)]",
  },
];

export default function AboutPage() {
  return (
    <PublicPageLayout>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* ── Hero ── */}
        <section className="flex flex-col md:flex-row items-center justify-center gap-10 px-6 md:px-16 lg:px-24 py-16 md:py-20 max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 max-w-xl text-center md:text-left">
            <span className="inline-block self-center md:self-start text-base font-semibold tracking-widest text-accent-light bg-accent/20 border border-accent/40 rounded-full px-4 py-1 uppercase">
              Nossa história
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Nascemos para{" "}
              <span className="text-accent-light">
                democratizar
              </span>{" "}
              o ensino de programação
            </h1>
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
              O Programático surgiu da ideia simples de que aprender lógica de
              programação não precisa ser chato. Combinamos gamificação,
              exercícios práticos e uma mascote carismática para criar uma
              experiência única de aprendizado.
            </p>
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
              Hoje somos uma plataforma completa que acompanha o aluno desde os
              primeiros passos até os conceitos avançados — sempre de forma
              divertida, progressiva e interativa.
            </p>
          </div>

          <motion.div
            variants={mascotEnterVariants}
            initial="initial"
            animate="animate"
            className="w-48 md:w-64 shrink-0 flex flex-col items-center gap-3"
          >
            <SpeechBubble
              tailPosition="bottom-center"
              className="text-lg text-gray-700 font-semibold"
            >
              Ser programador(a) está ao seu alcance! 🚀
            </SpeechBubble>
            <Base className="w-full h-full" />
          </motion.div>
        </section>

        {/* ── Missão ── */}
        <section className="bg-bg-card py-16 px-6 md:px-16 lg:px-24">
          <div className="max-w-3xl mx-auto text-center flex flex-col gap-5">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Nossa Missão
            </h2>
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
              Tornar o aprendizado de lógica de programação{" "}
              <strong className="text-white">acessível, divertido e eficaz</strong>{" "}
              para qualquer pessoa no Brasil — desde estudantes do ensino médio
              até profissionais em transição de carreira.
            </p>
            <div className="w-16 h-1 bg-accent rounded-full mx-auto mt-2" />
          </div>
        </section>

        {/* ── Valores ── */}
        <section className="py-20 px-6 md:px-16 lg:px-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Nossos Valores
              </h2>
              <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
                Esses princípios guiam cada decisão que tomamos na plataforma.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex gap-5 bg-bg-card-inner rounded-2xl p-6 border border-gray-border hover:-translate-y-1 transition-transform duration-200"
                >
                  <div
                    className={`flex items-center justify-center w-14 h-14 rounded-xl shrink-0 ${v.bg}`}
                  >
                    {v.icon}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-white">{v.title}</h3>
                    <p className="text-lg md:text-xl text-[var(--color-text-secondary)] leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-bg-card py-20 px-6 flex flex-col items-center gap-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            Faça parte da comunidade
          </h2>
          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-md leading-relaxed">
            Junte-se a milhares de alunos que já estão transformando suas
            carreiras com o Programático.
          </p>
          <Link to="/registro">
            <Button variant="primary" className="px-10! py-4! text-base!">
              COMEÇAR GRATUITAMENTE
            </Button>
          </Link>
        </section>
      </motion.div>
    </PublicPageLayout>
  );
}
