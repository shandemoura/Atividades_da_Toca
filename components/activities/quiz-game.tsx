"use client"

import { useCallback, useMemo, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ArrowRight, RotateCcw, Trophy, Heart, Sparkles } from 'lucide-react'
import { quizQuestions } from '@/lib/quiz-questions'
import { sounds } from '@/lib/sounds'
import { cn } from '@/lib/utils'

export function QuizGame() {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [finished, setFinished] = useState(false)

  const total = useMemo(() => quizQuestions?.length ?? 0, [])
  const q = useMemo(() => quizQuestions?.[index], [index])

  const onAnswer = useCallback(
    (i: number) => {
      if (locked) return
      setSelected(i)
      setLocked(true)
      const opt = q?.options?.[i]
      const isRight = !!opt?.correct
      if (isRight) {
        sounds.correct()
        setCorrect((c) => c + 1)
      } else {
        sounds.wrong()
      }
      setAnswers((prev) => [...(prev ?? []), isRight])
    },
    [locked, q],
  )

  const onNext = useCallback(() => {
    if (index + 1 >= total) {
      setFinished(true)
      sounds.win()
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setLocked(false)
  }, [index, total])

  const reset = useCallback(() => {
    setIndex(0)
    setSelected(null)
    setLocked(false)
    setCorrect(0)
    setAnswers([])
    setFinished(false)
  }, [])

  const progress = ((index + (finished ? 1 : locked ? 1 : 0)) / total) * 100

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-5 px-4 pb-12 pt-4 sm:px-6">
      {/* header */}
      <div className="rounded-[24px] border-2 border-[#E78FB3]/35 bg-white p-5 shadow-[0_8px_24px_-8px_rgba(107,68,35,0.25)] dark:bg-[hsl(20_30%_14%)]">
        <div className="flex items-center justify-between">
          <h1
            className="flex items-center gap-2 text-3xl font-bold tracking-tight text-[#3A2418] sm:text-4xl dark:text-[#FFE8D6]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="text-4xl">❓</span> Quiz dos Pets
          </h1>
          {!finished ? (
            <div className="hidden items-center gap-2 rounded-full bg-[#FFE0EC] px-4 py-2 font-bold text-[#A23C68] sm:flex">
              <Heart className="h-4 w-4 fill-current" />
              {correct}/{total}
            </div>
          ) : null}
        </div>
        <p className="mt-1 text-[#6B4423] dark:text-[#FFD0A8]">
          Responda as perguntas e mostre o quanto você ama os animais!
        </p>

        {/* progress */}
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-[#FFE0EC]/70">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#E78FB3] to-[#FF8B66]"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="mt-2 text-sm font-semibold text-[#6B4423] dark:text-[#FFD0A8]">
          Pergunta {Math.min(index + 1, total)} de {total}
        </div>
      </div>

      {/* question or result */}
      <AnimatePresence mode="wait">
        {finished ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-[28px] border-4 border-[#F4B860] bg-gradient-to-br from-[#FFF5EB] to-[#FFE0B8] p-8 text-center shadow-2xl"
          >
            <div className="mx-auto mb-3 flex h-20 w-20 animate-bounce-soft items-center justify-center rounded-full bg-[#F4B860] shadow-lg">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h2
              className="text-4xl font-bold text-[#3A2418]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {correct === total ? 'Incrível!' : correct >= total - 1 ? 'Muito bem!' : 'Boa tentativa!'}
            </h2>
            <p className="mt-3 text-lg text-[#6B4423]">
              Você acertou{' '}
              <span className="font-bold text-[#FF6B3D]">
                {correct} de {total}
              </span>{' '}
              perguntas.
            </p>
            <div className="mt-4 flex justify-center gap-1">
              {answers?.map((a, i) => (
                <span
                  key={i}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm',
                    a ? 'bg-[#7FB069]' : 'bg-[#E6704E]',
                  )}
                >
                  {a ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-full bg-[#FF6B3D] px-6 py-3 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#FF5722]"
              >
                <RotateCcw className="h-5 w-5" />
                Jogar de novo
              </button>
            </div>
          </motion.div>
        ) : q ? (
          <motion.div
            key={q?.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="grid gap-5 md:grid-cols-[220px_1fr]"
          >
            {/* character */}
            <div className="flex flex-col items-center gap-3 rounded-[24px] border-2 border-[#E78FB3]/35 bg-gradient-to-br from-[#FFE0EC] to-[#FFF5EB] p-5 text-center shadow-md dark:border-[#E78FB3]/35 dark:from-[hsl(340_30%_22%)] dark:to-[hsl(25_40%_14%)]">
              <div className="relative aspect-square w-full max-w-[180px] animate-bounce-soft">
                <Image
                  src={q?.character ?? '/characters/tosh.png'}
                  alt={q?.characterName ?? 'personagem'}
                  fill
                  className="object-contain drop-shadow-[0_8px_12px_rgba(107,68,35,0.3)]"
                  sizes="180px"
                />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#A23C68] dark:text-[#F8B6C9]">Pergunta de</div>
                <div
                  className="text-xl font-bold text-[#3A2418] dark:text-[#FFE8D6]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {q?.characterName}
                </div>
                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-[#A23C68] dark:bg-[hsl(340_20%_25%)] dark:text-[#F8B6C9]">
                  <Sparkles className="h-3 w-3" /> {q?.theme}
                </div>
              </div>
            </div>

            {/* question */}
            <div className="rounded-[24px] border-2 border-[#FF8B66]/25 bg-white p-5 shadow-md sm:p-6 dark:bg-[hsl(20_30%_14%)]">
              <div className="mb-2 text-3xl">{q?.emoji}</div>
              <h2
                className="text-2xl font-bold tracking-tight text-[#3A2418] sm:text-3xl dark:text-[#FFE8D6]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {q?.question}
              </h2>

              <div className="mt-5 grid gap-3">
                {q?.options?.map((opt, i) => {
                  const isSelected = selected === i
                  const isCorrect = !!opt?.correct
                  const showState = locked
                  const bg = showState
                    ? isCorrect
                      ? 'border-[#7FB069] bg-[#EAF5DE] text-[#3A5B22]'
                      : isSelected
                        ? 'border-[#E6704E] bg-[#FFE4DA] text-[#B0421F]'
                        : 'border-[#6B4423]/10 bg-[#FFF5EB] text-[#6B4423]/70'
                    : 'border-[#6B4423]/15 bg-[#FFF5EB] text-[#3A2418] hover:border-[#FF6B3D] hover:bg-[#FFE8D6] dark:bg-[hsl(20_30%_18%)] dark:text-[#FFE8D6] dark:hover:bg-[hsl(20_30%_24%)]'
                  return (
                    <motion.button
                      key={i}
                      whileHover={!locked ? { y: -2, scale: 1.01 } : undefined}
                      whileTap={!locked ? { scale: 0.99 } : undefined}
                      onClick={() => onAnswer(i)}
                      disabled={locked}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left text-lg font-semibold shadow-sm transition-all',
                        bg,
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold',
                          showState && isCorrect
                            ? 'bg-[#7FB069] text-white'
                            : showState && isSelected && !isCorrect
                              ? 'bg-[#E6704E] text-white'
                              : 'bg-white text-[#6B4423]',
                        )}
                      >
                        {showState && isCorrect ? (
                          <Check className="h-5 w-5" />
                        ) : showState && isSelected && !isCorrect ? (
                          <X className="h-5 w-5" />
                        ) : (
                          String.fromCharCode(65 + i)
                        )}
                      </span>
                      <span className="flex-1">{opt?.text}</span>
                    </motion.button>
                  )
                })}
              </div>

              <AnimatePresence>
                {locked ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-5 flex flex-col gap-4 rounded-2xl bg-[#EAF5DE] p-4 text-[#3A5B22] sm:flex-row sm:items-center sm:justify-between dark:bg-[hsl(97_25%_20%)] dark:text-[#C8E8A8]"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7FB069] text-white">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      <p className="text-sm sm:text-base">{q?.explanation}</p>
                    </div>
                    <button
                      onClick={onNext}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#FF6B3D] px-6 py-3 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#FF5722]"
                    >
                      {index + 1 >= total ? 'Ver resultado' : 'Próxima'}
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
