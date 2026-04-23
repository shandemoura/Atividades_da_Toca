import { SiteHeader } from '@/components/activities/site-header'
import { PuzzleGame } from '@/components/activities/puzzle-game'

export const metadata = {
  title: 'Quebra-cabeça – Toca do Tosh',
}

export default function QuebraCabecaPage() {
  return (
    <main className="toca-bg min-h-screen pb-10">
      <SiteHeader />
      <PuzzleGame />
    </main>
  )
}
