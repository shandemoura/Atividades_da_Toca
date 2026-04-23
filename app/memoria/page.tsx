import { SiteHeader } from '@/components/activities/site-header'
import { MemoryGame } from '@/components/activities/memory-game'

export const metadata = {
  title: 'Jogo da Memória – Toca do Tosh',
}

export default function MemoriaPage() {
  return (
    <main className="toca-bg min-h-screen pb-10">
      <SiteHeader />
      <MemoryGame />
    </main>
  )
}
