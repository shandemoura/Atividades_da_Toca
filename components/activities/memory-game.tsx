"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Timer, Trophy, Sparkles, PawPrint } from 'lucide-react'
import { characters } from '@/lib/characters'
import { sounds } from '@/lib/sounds'
import { cn } from '@/lib/utils'

type Difficulty = '8' | '16' | '32'

type Card = {
  uid: string
  charId: string
  image: string
  name: string
  flipped: boolean
  matched: boolean
}

const EXTRA_PAIRS = [
  { id: 'sala', name: 'Sala', image: '/characters/sala.png' },
]

function buildDeck(difficulty: Difficulty): Card[] {
  const pairs = Number(difficulty) / 2
  const base = [...characters?.map((c) => ({ id: c?.id, name: c?.name, image: c?.image })) ?? []]
  const pool = [...base, ...EXTRA_PAIRS]
  const source = Array.from({ length: pairs }, (_, i) => {
    const item = pool[i % pool.length]
    return {
      id: item?.id ?? `x-${i}`,
      name: item?.name ?? '',
      image: item?.image ?? '',
    }
  })
  const deck: Card[] = []
  source?.forEach((s, i) => {
    deck.push({
      uid: `${s?.id}-a-${i}`,
      charId: s?.id ?? `x-${i}`,
      image: s?.image ?? '',
      name: s?.name ?? '',
      flipped: false,
      matched: false,
    })
    deck.push({
      uid: `${s?.id}-b-${i}`,
      charId: s?.id ?? `x-${i}`,
      image: s?.image ?? '',
      name: s?.name ?? '',
      flipped: false,
      matched: false,
    })
  })
  // shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

export function MemoryGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('8')
  const [deck, setDeck] = useState<Card[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [won, setWon] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setDeck(buildDeck('8'))
  }, [])

  // timer
  useEffect(() => {
    if (!running) return
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [running])

  const totalPairs = useMemo(() => (deck?.length ?? 0) / 2, [deck])
  const matchedPairs = useMemo(
    () => (deck?.filter((c) => c?.matched)?.length ?? 0) / 2,
    [deck],
  )

  const reset = useCallback((d: Difficulty) => {
    setDifficulty(d)
    setDeck(buildDeck(d))
    setSelected([])
    setMoves(0)
    setSeconds(0)
    setRunning(false)
    setWon(false)
  }, [])

  const onCardClick = useCallback(
    (uid: string) => {
      if (won) return
      const card = deck?.find((c) => c?.uid === uid)
      if (!card || card?.flipped || card?.matched) return
      if ((selected?.length ?? 0) >= 2) return

      sounds.flip()
      if (!running) setRunning(true)

      const nextDeck = deck?.map((c) => (c?.uid === uid ? { ...c, flipped: true } : c)) ?? []
      const nextSelected = [...(selected ?? []), uid]
      setDeck(nextDeck)
      setSelected(nextSelected)

      if (nextSelected?.length === 2) {
        setMoves((m) => m + 1)
        const [aUid, bUid] = nextSelected
        const a = nextDeck?.find((c) => c?.uid === aUid)
        const b = nextDeck?.find((c) => c?.uid === bUid)
        if (a && b && a?.charId === b?.charId) {
          // match!
          setTimeout(() => {
            sounds.match()
            setDeck((prev) =>
              prev?.map((c) =>
                c?.uid === aUid || c?.uid === bUid ? { ...c, matched: true } : c,
              ) ?? [],
            )
            setSelected([])
          }, 350)
        } else {
          setTimeout(() => {
            sounds.miss()
            setDeck((prev) =>
              prev?.map((c) =>
                c?.uid === aUid || c?.uid === bUid ? { ...c, flipped: false } : c,
              ) ?? [],
            )
            setSelected([])
          }, 900)
        }
      }
    },
    [deck, selected, running, won],
  )

  // detect win
  useEffect(() => {
    if (!mounted) return
    if ((deck?.length ?? 0) === 0) return
    if (deck?.every((c) => c?.matched)) {
      setRunning(false)
      setWon(true)
      sounds.win()
    }
  }, [deck, mounted])

  const mmss = useMemo(() => {
    const m = Math.floor((seconds ?? 0) / 60)
    const s = (seconds ?? 0) % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }, [seconds])

  const gridCols = difficulty === '8' ? 'grid-cols-4' : difficulty === '16' ? 'grid-cols-4 sm:grid-cols-6' : 'grid-cols-4 sm:grid-cols-8'

  if (!mounted) {
    return <div className="h-96" />
  }

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-5 px-4 pb-12 pt-4 sm:px-6">
      {/* header */}
      <div className="flex flex-col gap-4 rounded-[24px] border-2 border-[#FF8B66]/25 bg-white p-5 shadow-[0_8px_24px_-8px_rgba(107,68,35,0.25)] sm:flex-row sm:items-center sm:justify-between dark:bg-[hsl(20_30%_14%)]">
        <div>
          <h1
            className="flex items-center gap-2 text-3xl font-bold tracking-tight text-[#3A2418] sm:text-4xl dark:text-[#FFE8D6]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="text-4xl">🧠</span> Jogo da Memória
          </h1>
          <p className="mt-1 text-[#6B4423] dark:text-[#FFD0A8]">
            Vire duas cartas e encontre os pares dos personagens!
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex overflow-hidden rounded-full border-2 border-[#6B4423]/15 bg-[#FFF5EB] p-1 dark:bg-[hsl(20_30%_18%)]">
            {(['8', '16', '32'] as Difficulty[])?.map((d) => (
              <button
                key={d}
                onClick={() => reset(d)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-bold transition-all',
                  difficulty === d
                    ? 'bg-[#FF6B3D] text-white shadow-md'
                    : 'text-[#6B4423] hover:bg-white dark:text-[#FFD0A8] dark:hover:bg-[hsl(20_30%_22%)]',
                )}
              >
                {d} peças
              </button>
            ))}
          </div>
          <button
            onClick={() => reset(difficulty)}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#6B4423] bg-white px-4 py-2 font-bold text-[#6B4423] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#FFE8D6] dark:bg-[hsl(20_30%_14%)] dark:text-[#FFD0A8] dark:hover:bg-[hsl(20_30%_22%)]"
            aria-label="Reiniciar jogo"
          >
            <RotateCcw className="h-4 w-4" />
            Reiniciar
          </button>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-3 gap-3">
        <Stat icon={<Timer className="h-5 w-5" />} label="Tempo" value={mmss} color="bg-[#FFE8D6] text-[#B05422]" />
        <Stat icon={<Sparkles className="h-5 w-5" />} label="Jogadas" value={String(moves)} color="bg-[#EAF5DE] text-[#3A5B22]" />
        <Stat icon={<Trophy className="h-5 w-5" />} label="Pares" value={`${matchedPairs}/${totalPairs}`} color="bg-[#FFE0EC] text-[#A23C68]" />
      </div>

      {/* board */}
      <div className={cn('grid gap-3 sm:gap-4', gridCols)}>
        {deck?.map((c) => (
          <MemoryCard key={c?.uid} card={c} onClick={() => onCardClick(c?.uid ?? '')} />
        ))}
      </div>

      {/* win modal */}
      <AnimatePresence>
        {won ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.7, rotate: -4 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="relative w-full max-w-md overflow-hidden rounded-[28px] border-4 border-[#F4B860] bg-gradient-to-br from-[#FFF5EB] to-[#FFE0B8] p-8 text-center shadow-2xl"
            >
              <div className="mx-auto mb-3 flex h-16 w-16 animate-bounce-soft items-center justify-center rounded-full bg-[#F4B860] shadow-lg">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h2
                className="text-3xl font-bold text-[#3A2418]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Você conseguiu!
              </h2>
              <p className="mt-2 text-[#6B4423]">
                {moves} jogadas • {mmss}
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => reset(difficulty)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#FF6B3D] px-6 py-3 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#FF5722]"
                >
                  <PawPrint className="h-5 w-5" />
                  Jogar de novo
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function Stat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className={cn('flex items-center gap-3 rounded-2xl p-3 shadow-sm sm:p-4', color)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70">{icon}</div>
      <div>
        <div className="text-xs font-semibold opacity-80">{label}</div>
        <div className="font-mono text-lg font-bold sm:text-xl">{value}</div>
      </div>
    </div>
  )
}

function MemoryCard({ card, onClick }: { card: Card; onClick: () => void }) {
  const isOpen = card?.flipped || card?.matched
  return (
    <button
      onClick={onClick}
      disabled={isOpen}
      aria-label={isOpen ? `Carta de ${card?.name}` : 'Carta virada para baixo'}
      className={cn(
        'card-flip aspect-square w-full select-none rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF8B66]',
        isOpen ? 'flipped' : 'cursor-pointer',
        card?.matched ? 'scale-[0.97]' : '',
      )}
    >
      <div className="card-flip-inner">
        {/* Back (fechada) */}
        <div className="card-face flex items-center justify-center rounded-2xl border-4 border-[#FF6B3D] bg-gradient-to-br from-[#FF8B66] to-[#FF6B3D] shadow-md transition-shadow hover:shadow-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 sm:h-16 sm:w-16">
            <PawPrint className="h-8 w-8 text-white sm:h-10 sm:w-10" />
          </div>
        </div>
        {/* Front (aberta) */}
        <div
          className={cn(
            'card-face card-face-back flex items-center justify-center rounded-2xl border-4 bg-white p-2 shadow-md transition-all sm:p-3 dark:bg-[hsl(30_20%_18%)]',
            card?.matched ? 'border-[#7FB069] ring-4 ring-[#7FB069]/40' : 'border-[#F4B860]',
          )}
        >
          <div className="relative h-full w-full">
            <Image
              src={card?.image ?? ''}
              alt={card?.name ?? 'personagem'}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 30vw, 180px"
            />
          </div>
        </div>
      </div>
    </button>
  )
}
