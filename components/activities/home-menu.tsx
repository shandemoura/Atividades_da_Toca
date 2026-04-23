"use client"

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Brain, Puzzle, HelpCircle, Sparkles, ArrowRight, PawPrint } from 'lucide-react'
import { characters } from '@/lib/characters'

const activities = [
  {
    href: '/memoria',
    title: 'Jogo da Memória',
    desc: 'Encontre os pares dos amigos da Toca!',
    icon: Brain,
    bg: 'from-[#FF8B66] to-[#F4B860]',
    emoji: '🧠',
  },
  {
    href: '/quebra-cabeca',
    title: 'Quebra-cabeça',
    desc: 'Monte a imagem do seu personagem favorito.',
    icon: Puzzle,
    bg: 'from-[#7FB069] to-[#B8D686]',
    emoji: '🧩',
  },
  {
    href: '/quiz',
    title: 'Quiz dos Pets',
    desc: 'Teste o que você sabe sobre cuidar dos bichinhos.',
    icon: HelpCircle,
    bg: 'from-[#E78FB3] to-[#FFB4C7]',
    emoji: '❓',
  },
] as const

export function HomeMenu() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 pb-16 pt-6 sm:px-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[28px] border-2 border-[#2B2B2B]/10 bg-gradient-to-br from-[#FFD5B8] via-[#FFE6D3] to-[#FFF5EB] px-6 py-10 shadow-[0_12px_40px_-12px_rgba(107,68,35,0.3)] sm:px-10 sm:py-14">
        <div className="paw-dots absolute inset-0 opacity-60" aria-hidden />
        <div className="relative grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-semibold text-[#6B4423] shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-[#FF8B66]" />
              Atividades divertidas para crianças
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight text-[#3A2418] sm:text-5xl md:text-6xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Brinque com a turma da{' '}
              <span className="text-[#FF6B3D]">Toca do Tosh</span>!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 max-w-xl text-lg text-[#5C3A25] sm:text-xl"
            >
              Jogue, monte e aprenda com <strong>Tosh</strong>, <strong>Brenda</strong>, <strong>Greg</strong>, <strong>Dona Nanda</strong> e <strong>Zig</strong> 🐾
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 flex flex-wrap gap-3"
            >
              <Link
                href="#atividades"
                className="inline-flex items-center gap-2 rounded-full bg-[#FF6B3D] px-6 py-3 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#FF5722] hover:shadow-xl"
              >
                Começar a brincar
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#personagens"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#6B4423] bg-white px-6 py-3 text-base font-bold text-[#6B4423] shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#FFE8D6]"
              >
                <PawPrint className="h-5 w-5" />
                Ver personagens
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.2, type: 'spring' }}
            className="relative mx-auto aspect-square w-full max-w-[320px] md:max-w-[380px]"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF8B66] to-[#F4B860] blur-2xl opacity-60" />
            <div className="relative h-full w-full animate-bounce-soft">
              <Image
                src="/characters/tosh.png"
                alt="Tosh, o cachorrinho preto alegre da Toca do Tosh"
                fill
                className="object-contain drop-shadow-[0_12px_20px_rgba(107,68,35,0.35)]"
                priority
                sizes="(max-width: 768px) 80vw, 380px"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Atividades */}
      <section id="atividades" className="flex flex-col gap-5">
        <div className="flex items-end justify-between px-1">
          <h2
            className="text-3xl font-bold tracking-tight text-[#3A2418] sm:text-4xl dark:text-[#FFE8D6]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Escolha sua atividade
          </h2>
          <span className="hidden text-sm font-semibold text-[#6B4423] sm:block dark:text-[#FFD0A8]">3 brincadeiras esperando por você!</span>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {activities?.map((a, i) => {
            const Icon = a?.icon
            return (
              <motion.div
                key={a?.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  href={a?.href ?? '/'}
                  className={`group block h-full overflow-hidden rounded-[24px] bg-gradient-to-br ${a?.bg} p-1 shadow-[0_10px_30px_-10px_rgba(107,68,35,0.35)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_-10px_rgba(107,68,35,0.45)]`}
                >
                  <div className="flex h-full flex-col justify-between rounded-[22px] bg-white/95 p-6 dark:bg-[hsl(20_30%_14%)]/95">
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${a?.bg} text-white shadow-md transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                          {Icon ? <Icon className="h-7 w-7" /> : null}
                        </div>
                        <span className="text-4xl">{a?.emoji}</span>
                      </div>
                      <h3
                        className="text-2xl font-bold tracking-tight text-[#3A2418] dark:text-[#FFE8D6]"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {a?.title}
                      </h3>
                      <p className="mt-2 text-base text-[#5C3A25] dark:text-[#FFD0A8]">{a?.desc}</p>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-base font-bold text-[#FF6B3D]">
                      Jogar agora
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Personagens */}
      <section id="personagens" className="flex flex-col gap-5">
        <h2
          className="text-3xl font-bold tracking-tight text-[#3A2418] sm:text-4xl dark:text-[#FFE8D6]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Conheça a turma 🐶
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {characters?.map((c, i) => (
            <motion.div
              key={c?.id}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ y: -6, rotate: -2 }}
              className="group rounded-3xl border-2 border-[#6B4423]/15 bg-white p-4 text-center shadow-md transition-shadow hover:shadow-xl dark:bg-[hsl(20_30%_14%)]"
            >
              <div className="relative mx-auto mb-2 aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFE8D6] to-[#FFD5B8] dark:from-[hsl(25_40%_20%)] dark:to-[hsl(25_40%_14%)]">
                <Image
                  src={c?.image ?? '/characters/tosh.png'}
                  alt={`${c?.name ?? 'personagem'} da Toca do Tosh`}
                  fill
                  className="object-contain p-2 transition-transform group-hover:scale-110"
                  sizes="(max-width: 768px) 40vw, 200px"
                />
              </div>
              <h3
                className="text-xl font-bold text-[#3A2418] dark:text-[#FFE8D6]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {c?.name}
              </h3>
              <p className="mt-1 text-xs text-[#6B4423] dark:text-[#FFD0A8]">{c?.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Como jogar */}
      <section className="rounded-[24px] border-2 border-[#7FB069]/30 bg-gradient-to-br from-[#EAF5DE] to-[#F7FBED] p-6 shadow-sm sm:p-8 dark:border-[#7FB069]/30 dark:from-[hsl(97_30%_15%)] dark:to-[hsl(97_30%_10%)]">
        <h2
          className="mb-4 flex items-center gap-2 text-2xl font-bold text-[#3A5B22] sm:text-3xl dark:text-[#C8E8A8]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <Sparkles className="h-6 w-6" />
          Como brincar?
        </h2>
        <ol className="grid gap-3 text-base text-[#3A5B22] sm:grid-cols-3 dark:text-[#C8E8A8]">
          <li className="flex gap-3 rounded-2xl bg-white/70 p-4 dark:bg-[hsl(97_20%_18%)]/70">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7FB069] font-bold text-white">1</span>
            <span>Escolha uma atividade no menu acima.</span>
          </li>
          <li className="flex gap-3 rounded-2xl bg-white/70 p-4 dark:bg-[hsl(97_20%_18%)]/70">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7FB069] font-bold text-white">2</span>
            <span>Siga as instruções e divirta-se no seu ritmo.</span>
          </li>
          <li className="flex gap-3 rounded-2xl bg-white/70 p-4 dark:bg-[hsl(97_20%_18%)]/70">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7FB069] font-bold text-white">3</span>
            <span>No final, você pode jogar de novo quantas vezes quiser!</span>
          </li>
        </ol>
      </section>

      <footer className="mt-4 text-center text-sm text-[#6B4423]/80 dark:text-[#FFD0A8]/70">
        Feito com 🧡 para os pequenos amigos da <strong>Toca do Tosh</strong>.
      </footer>
    </div>
  )
}
