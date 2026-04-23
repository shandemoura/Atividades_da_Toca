"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Trophy, Eye, EyeOff, ChevronDown } from 'lucide-react'
import { characters } from '@/lib/characters'
import { sounds } from '@/lib/sounds'
import { cn } from '@/lib/utils'

type GridSize = 2 | 3 // 2x2 (4 peças) ou 3x3 (9 peças)

type Piece = {
  correctIndex: number // posição correta (0..n-1)
  currentIndex: number // posição atual no grid
}

function shuffleIndices(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  // se ficou resolvido, troca dois para garantir que há o que fazer
  if (arr.every((v, i) => v === i)) {
    ;[arr[0], arr[1]] = [arr[1], arr[0]]
  }
  return arr
}

function buildPieces(n: number): Piece[] {
  const shuffled = shuffleIndices(n)
  return shuffled.map((correctIndex, currentIndex) => ({
    correctIndex,
    currentIndex,
  }))
}

export function PuzzleGame() {
  const [charId, setCharId] = useState<string>(characters?.[0]?.id ?? 'tosh')
  const [grid, setGrid] = useState<GridSize>(2)
  const [showHint, setShowHint] = useState(true)
  const [pieces, setPieces] = useState<Piece[]>([])
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [charMenuOpen, setCharMenuOpen] = useState(false)
  const charMenuRef = useRef<HTMLDivElement | null>(null)

  const selectedChar = useMemo(
    () => characters?.find((c) => c?.id === charId) ?? characters?.[0],
    [charId],
  )

  const totalCells = useMemo(() => (grid ?? 2) * (grid ?? 2), [grid])

  const reset = useCallback((newGrid?: GridSize, newCharId?: string) => {
    const g = newGrid ?? grid
    if (newCharId) setCharId(newCharId)
    if (newGrid) setGrid(newGrid)
    const total = (g ?? 2) * (g ?? 2)
    setPieces(buildPieces(total))
    setSelectedSlot(null)
    setMoves(0)
    setWon(false)
  }, [grid])

  useEffect(() => {
    setMounted(true)
    setPieces(buildPieces(4))
  }, [])

  // fechar menu ao clicar fora
  useEffect(() => {
    if (!charMenuOpen) return
    function handler(e: MouseEvent) {
      if (charMenuRef?.current && !charMenuRef?.current?.contains(e?.target as Node)) {
        setCharMenuOpen(false)
      }
    }
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [charMenuOpen])

  const checkWin = useCallback((list: Piece[]) => {
    return list?.every((p) => p?.correctIndex === p?.currentIndex) ?? false
  }, [])

  const onSlotClick = useCallback(
    (slotIndex: number) => {
      if (won) return
      sounds.click()
      if (selectedSlot === null) {
        setSelectedSlot(slotIndex)
        return
      }
      if (selectedSlot === slotIndex) {
        setSelectedSlot(null)
        return
      }
      // swap pieces cujos currentIndex são selectedSlot e slotIndex
      const a = pieces?.find((p) => p?.currentIndex === selectedSlot)
      const b = pieces?.find((p) => p?.currentIndex === slotIndex)
      if (!a || !b) {
        setSelectedSlot(null)
        return
      }
      const next = pieces?.map((p) => {
        if (p === a) return { ...p, currentIndex: slotIndex }
        if (p === b) return { ...p, currentIndex: selectedSlot }
        return p
      }) ?? []
      setPieces(next)
      setSelectedSlot(null)
      setMoves((m) => m + 1)
      sounds.pop()
      if (checkWin(next)) {
        setTimeout(() => {
          setWon(true)
          sounds.win()
        }, 250)
      }
    },
    [pieces, selectedSlot, won, checkWin],
  )

  if (!mounted) return <div className="h-96" />

  const gridClass = grid === 2 ? 'grid-cols-2' : 'grid-cols-3'
  // ordenamos as peças por currentIndex para render em ordem de grid
  const ordered = [...(pieces ?? [])].sort((a, b) => (a?.currentIndex ?? 0) - (b?.currentIndex ?? 0))

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-5 px-4 pb-12 pt-4 sm:px-6">
      {/* header */}
      <div className="flex flex-col gap-4 rounded-[24px] border-2 border-[#7FB069]/30 bg-white p-5 shadow-[0_8px_24px_-8px_rgba(107,68,35,0.25)] sm:flex-row sm:items-center sm:justify-between dark:bg-[hsl(20_30%_14%)]">
        <div>
          <h1
            className="flex items-center gap-2 text-3xl font-bold tracking-tight text-[#3A2418] sm:text-4xl dark:text-[#FFE8D6]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="text-4xl">🧩</span> Quebra-cabeça
          </h1>
          <p className="mt-1 text-[#6B4423] dark:text-[#FFD0A8]">
            Toque em duas peças para trocar de lugar e montar a imagem!
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex overflow-hidden rounded-full border-2 border-[#6B4423]/15 bg-[#FFF5EB] p-1 dark:bg-[hsl(20_30%_18%)]">
            {([2, 3] as GridSize[])?.map((g) => (
              <button
                key={g}
                onClick={() => reset(g)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-bold transition-all',
                  grid === g
                    ? 'bg-[#7FB069] text-white shadow-md'
                    : 'text-[#6B4423] hover:bg-white dark:text-[#FFD0A8] dark:hover:bg-[hsl(20_30%_22%)]',
                )}
              >
                {g === 2 ? '4 peças' : '9 peças'}
              </button>
            ))}
          </div>
          <button
            onClick={() => reset(grid)}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#6B4423] bg-white px-4 py-2 font-bold text-[#6B4423] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#FFE8D6] dark:bg-[hsl(20_30%_14%)] dark:text-[#FFD0A8] dark:hover:bg-[hsl(20_30%_22%)]"
          >
            <RotateCcw className="h-4 w-4" />
            Embaralhar
          </button>
        </div>
      </div>

      {/* controls row */}
      <div className="flex flex-wrap items-center gap-3">
        <div ref={charMenuRef} className="relative">
          <button
            onClick={(e) => { e?.stopPropagation?.(); setCharMenuOpen((v) => !v) }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#6B4423]/20 bg-white px-4 py-2 font-bold text-[#3A2418] shadow-sm transition-all hover:-translate-y-0.5 dark:bg-[hsl(20_30%_14%)] dark:text-[#FFE8D6]"
            aria-haspopup="listbox"
            aria-expanded={charMenuOpen}
          >
            <span className="relative h-7 w-7 overflow-hidden rounded-full bg-[#FFE8D6]">
              <Image
                src={selectedChar?.image ?? '/characters/tosh.png'}
                alt={selectedChar?.name ?? 'personagem'}
                fill
                className="object-contain p-0.5"
                sizes="28px"
              />
            </span>
            Personagem: {selectedChar?.name ?? 'Tosh'}
            <ChevronDown className={cn('h-4 w-4 transition-transform', charMenuOpen ? 'rotate-180' : '')} />
          </button>
          <AnimatePresence>
            {charMenuOpen ? (
              <motion.ul
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                role="listbox"
                className="absolute left-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-2xl border-2 border-[#6B4423]/15 bg-white shadow-xl dark:bg-[hsl(20_30%_16%)]"
              >
                {characters?.map((c) => (
                  <li key={c?.id}>
                    <button
                      onClick={() => { setCharMenuOpen(false); reset(grid, c?.id) }}
                      className={cn(
                        'flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold transition-colors',
                        c?.id === charId
                          ? 'bg-[#FFE8D6] text-[#B05422] dark:bg-[hsl(20_30%_22%)]'
                          : 'text-[#3A2418] hover:bg-[#FFF5EB] dark:text-[#FFE8D6] dark:hover:bg-[hsl(20_30%_22%)]',
                      )}
                    >
                      <span className="relative h-8 w-8 overflow-hidden rounded-full bg-[#FFE8D6]">
                        <Image src={c?.image ?? ''} alt={c?.name ?? ''} fill className="object-contain p-0.5" sizes="32px" />
                      </span>
                      {c?.name}
                    </button>
                  </li>
                ))}
              </motion.ul>
            ) : null}
          </AnimatePresence>
        </div>

        <button
          onClick={() => setShowHint((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border-2 border-[#FF6B3D]/30 bg-white px-4 py-2 font-bold text-[#B05422] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#FFE8D6] dark:bg-[hsl(20_30%_14%)] dark:text-[#FFD0A8] dark:hover:bg-[hsl(20_30%_22%)]"
        >
          {showHint ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showHint ? 'Esconder dica' : 'Mostrar dica'}
        </button>

        <div className="ml-auto flex items-center gap-2 rounded-full bg-[#FFE0EC] px-4 py-2 font-bold text-[#A23C68]">
          Jogadas: <span className="font-mono">{moves}</span>
        </div>
      </div>

      {/* board */}
      <div className="grid gap-5 md:grid-cols-[1fr_280px]">
        <div className="rounded-[24px] border-4 border-[#6B4423]/15 bg-gradient-to-br from-[#FFE8D6] to-[#FFD5B8] p-3 shadow-[0_10px_28px_-10px_rgba(107,68,35,0.35)] dark:from-[hsl(25_40%_20%)] dark:to-[hsl(25_40%_14%)]">
            <div
              className={cn(
                'relative mx-auto grid w-full max-w-[520px] gap-1 overflow-hidden rounded-2xl bg-white shadow-inner',
                gridClass,
              )}
              style={{ aspectRatio: '1/1' }}
            >
              {ordered?.map((p) => (
                <PuzzleSlot
                  key={`slot-${p?.currentIndex}`}
                  slotIndex={p?.currentIndex ?? 0}
                  piece={p}
                  grid={grid}
                  image={selectedChar?.image ?? ''}
                  name={selectedChar?.name ?? ''}
                  selected={selectedSlot === p?.currentIndex}
                  onClick={() => onSlotClick(p?.currentIndex ?? 0)}
                />
              ))}
            </div>
          </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-[20px] border-2 border-[#7FB069]/30 bg-white p-4 shadow-sm dark:bg-[hsl(20_30%_14%)]">
            <h3
              className="mb-2 text-lg font-bold text-[#3A5B22] dark:text-[#C8E8A8]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Dica (imagem completa)
            </h3>
            {showHint ? (
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#FFE8D6] to-[#FFD5B8] dark:from-[hsl(25_40%_20%)] dark:to-[hsl(25_40%_14%)]">
                <Image
                  src={selectedChar?.image ?? ''}
                  alt={`Referência de ${selectedChar?.name ?? ''}`}
                  fill
                  className="object-contain p-2"
                  sizes="280px"
                />
              </div>
            ) : (
              <div className="flex aspect-square w-full items-center justify-center rounded-xl border-2 border-dashed border-[#6B4423]/30 text-[#6B4423]/60">
                <EyeOff className="h-10 w-10" />
              </div>
            )}
          </div>

          <div className="rounded-[20px] border-2 border-[#FF8B66]/25 bg-[#FFF5EB] p-4 text-sm text-[#6B4423] dark:border-[#FF8B66]/25 dark:bg-[hsl(25_40%_18%)] dark:text-[#FFD0A8]">
            <strong className="text-[#B05422] dark:text-[#FFD0A8]">Como jogar:</strong>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Toque em uma peça para selecioná-la.</li>
              <li>Toque em outra peça para trocar as posições.</li>
              <li>Monte a imagem inteira para ganhar!</li>
            </ol>
          </div>
        </div>
      </div>

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
              className="w-full max-w-md overflow-hidden rounded-[28px] border-4 border-[#7FB069] bg-gradient-to-br from-[#EAF5DE] to-[#C8E8A8] p-8 text-center shadow-2xl"
            >
              <div className="mx-auto mb-3 flex h-16 w-16 animate-bounce-soft items-center justify-center rounded-full bg-[#7FB069] shadow-lg">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h2
                className="text-3xl font-bold text-[#3A5B22]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Parabéns!
              </h2>
              <p className="mt-2 text-[#3A5B22]">
                Você montou {selectedChar?.name ?? 'o personagem'} em {moves} jogadas!
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => reset(grid)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#7FB069] px-6 py-3 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#6BA057]"
                >
                  <RotateCcw className="h-5 w-5" />
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

function PuzzleSlot({
  slotIndex,
  piece,
  grid,
  image,
  name,
  selected,
  onClick,
}: {
  slotIndex: number
  piece: Piece
  grid: GridSize
  image: string
  name: string
  selected: boolean
  onClick: () => void
}) {
  const correct = piece?.correctIndex ?? 0
  const inRightPlace = correct === slotIndex
  const cols: number = grid ?? 2
  const row = Math.floor(correct / cols)
  const col = correct % cols
  // Image-based background: dividimos a imagem em grid
  // usando background-position percentual
  const divisor = cols - 1 || 1
  const bgX = (col / divisor) * 100
  const bgY = (row / divisor) * 100

  return (
    <button
      onClick={onClick}
      aria-label={`Peça ${correct + 1} de ${name}`}
      className={cn(
        'relative overflow-hidden rounded-md transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF8B66]',
        selected ? 'z-10 scale-[0.96] ring-4 ring-[#FF6B3D]' : '',
        inRightPlace ? 'ring-2 ring-[#7FB069]/50' : '',
      )}
      style={{
        backgroundImage: `url('${image}')`,
        backgroundSize: `${cols * 100}% ${cols * 100}%`,
        backgroundPosition: `${bgX}% ${bgY}%`,
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#FFE8D6',
      }}
    >
      {/* número da posição correta como dica sutil */}
      <span className="pointer-events-none absolute bottom-1 right-1 rounded-md bg-white/80 px-1.5 py-0.5 text-[10px] font-bold text-[#6B4423] shadow-sm sm:text-xs">
        {(correct ?? 0) + 1}
      </span>
    </button>
  )
}
