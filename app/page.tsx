import { SiteHeader } from '@/components/activities/site-header'
import { HomeMenu } from '@/components/activities/home-menu'

export default function HomePage() {
  return (
    <main className="toca-bg min-h-screen pb-10">
      <SiteHeader />
      <HomeMenu />
    </main>
  )
}
