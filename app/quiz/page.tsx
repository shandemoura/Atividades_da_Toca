import { SiteHeader } from '@/components/activities/site-header'
import { QuizGame } from '@/components/activities/quiz-game'

export const metadata = {
  title: 'Quiz dos Pets – Toca do Tosh',
}

export default function QuizPage() {
  return (
    <main className="toca-bg min-h-screen pb-10">
      <SiteHeader />
      <QuizGame />
    </main>
  )
}
