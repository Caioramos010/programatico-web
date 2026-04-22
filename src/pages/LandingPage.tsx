import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Atom,
  Gamepad2,
  Code,
  Trophy,
  Users,
  Zap,
  CheckCircle,
} from "lucide-react";
import Button from "../components/Button";
import Base from "../components/mascot/Base";
import Excited from "../components/mascot/Excited";
import SpeechBubble from "../components/SpeechBubble";
import { mascotEnterVariants, pageVariants } from "../hooks/useMascotAnimation";

const features = [
  {
    icon: <Atom className="w-8 h-8 text-white" />,
    title: "Ensino Adaptativo",
    description:
      "Exercícios organizados por IA que se adaptam ao seu nível de habilidade.",
    bg: "bg-accent",
  },
  {
    icon: <Gamepad2 className="w-8 h-8 text-white" />,
    title: "Gamificação",
    description:
      "Ganhe xp, complete módulos e mantenha sua ofensiva diária.",
    bg: "bg-premium",
  },
  {
    icon: <Code className="w-8 h-8 text-white" />,
    title: "Prática Direta",
    description:
      "Menos teoria chata, mais práticas reais na tela.",
    bg: "bg-success",
  },
];

const stats = [
  { value: "10k+", label: "Alunos ativos", icon: <Users className="w-6 h-6" /> },
  { value: "100+", label: "Exercícios", icon: <Code className="w-6 h-6" /> },
  { value: "20+", label: "Módulos", icon: <Trophy className="w-6 h-6" /> },
  { value: "90%", label: "Aprovação", icon: <Zap className="w-6 h-6" /> },
];

const steps = [
  {
    number: "1",
    title: "Crie sua conta",
    description: "Cadastre-se gratuitamente em poucos segundos e comece sua jornada.",
  },
  {
    number: "2",
    title: "Escolha seu nível",
    description: "Iniciante, intermediário ou avançado — a plataforma se adapta a você.",
  },
  {
    number: "3",
    title: "Aprenda praticando",
    description: "Resolva desafios interativos, ganhe XP e suba de nível todos os dias.",
  },
];

export default function LandingPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen flex flex-col font-fredoka"
    >
      {/* ── Navbar ── */}
      <header className="flex items-center justify-between px-6 py-4 md:px-24 lg:px-40 max-w-7xl mx-auto w-full">
        <span className="text-2xl font-gloria text-white tracking-wide">
          PROGRAMÁTICO
        </span>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="white" className="py-2.5! px-8! text-sm!">
              LOGIN
            </Button>
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-10 px-6 md:px-16 lg:px-24 py-16 md:py-24 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-6 max-w-xl text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Aprenda os conceitos básicos antes de programar!
          </h1>
          <p className="text-base md:text-lg text-text-secondary leading-relaxed">
            O jeito divertido, interativo e gamificado de dominar a lógica de
            programação. Aprenda no seu ritmo com exercícios práticos e uma
            mascote que te acompanha em cada passo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/registro">
              <Button variant="primary" className="px-8! py-4! text-base! w-full sm:w-auto">
                COMEÇAR AGORA!
              </Button>
            </Link>
            <a href="#como-funciona">
              <Button variant="neutral" className="px-8! py-4! text-base! w-full sm:w-auto">
                COMO FUNCIONA?
              </Button>
            </a>
          </div>
        </div>

        <motion.div
          variants={mascotEnterVariants}
          initial="initial"
          animate="animate"
          className="w-52 md:w-72 lg:w-80 shrink-0 flex flex-col items-center gap-3"
        >
          <SpeechBubble tailPosition="bottom-center" className="text-sm text-gray-700 font-semibold">
            Bora aprender a programar? 🦒
          </SpeechBubble>
          <Base className="w-full h-full" />
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="py-10 px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="flex flex-col items-center gap-2 bg-bg-card-inner rounded-2xl py-6 px-4 border border-gray-border"
            >
              <span className="text-accent-light">{s.icon}</span>
              <span className="text-2xl md:text-3xl font-bold text-white">{s.value}</span>
              <span className="text-xs text-text-muted">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-bg-card py-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Por que o Programático?
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Uma plataforma completa pensada para quem quer aprender lógica de
            programação de verdade, com diversão e resultados reais.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="flex flex-col items-center text-center gap-4 bg-bg-card-inner rounded-2xl p-8 border border-gray-border hover:-translate-y-1 transition-transform duration-200"
            >
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-full ${f.bg}`}
              >
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-white">{f.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Como Funciona ── */}
      <section id="como-funciona" className="py-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Como funciona?
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Em apenas 3 passos você já está aprendendo.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-accent text-white text-xl font-bold">
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-white">{step.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── O que você vai aprender ── */}
      <section className="bg-bg-card py-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              O que você vai aprender?
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Conteúdos essenciais para construir uma base sólida em programação.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              "Lógica de programação",
              "Variáveis e tipos de dados",
              "Estruturas condicionais",
              "Laços de repetição",
              "Funções e modularização",
              "Algoritmos e resolução de problemas",
              "Estruturas de dados básicas",
              "Pensamento computacional",
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="flex items-center gap-3 bg-bg-card-inner rounded-xl px-5 py-4 border border-gray-border"
              >
                <CheckCircle className="w-5 h-5 text-accent-light shrink-0" />
                <span className="text-sm text-white font-medium">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="flex flex-col items-center gap-8 py-24 px-6">
        <motion.div
          variants={mascotEnterVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="w-36 md:w-44"
        >
          <Excited className="w-full h-full" />
        </motion.div>
        <h2 className="text-2xl md:text-4xl font-bold text-white text-center leading-tight">
          Pronto para começar sua jornada?
        </h2>
        <p className="text-text-muted text-center max-w-md">
          Junte-se a milhares de alunos que já estão aprendendo lógica de
          programação de forma divertida e gratuita.
        </p>
        <Link to="/registro">
          <Button variant="white" className="px-10! py-4! text-base!">
            VAMOS NESSA!
          </Button>
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="flex flex-col items-center gap-3 py-8 border-t border-gray-border">
        <span className="text-lg font-gloria text-white tracking-wide">
          PROGRAMÁTICO
        </span>
        <div className="flex gap-6 text-sm text-text-muted">
          <Link to="/sobre" className="hover:text-white transition-colors">
            Sobre
          </Link>
          <Link to="/termos" className="hover:text-white transition-colors">
            Termos
          </Link>
          <Link to="/privacidade" className="hover:text-white transition-colors">
            Privacidade
          </Link>
        </div>
        <p className="text-xs text-text-muted">
          © 2026 Programático. Aprenda programação de forma divertida.
        </p>
      </footer>
    </motion.div>
  );
}
