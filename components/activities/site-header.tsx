"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Brain, Puzzle, HelpCircle, PawPrint } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Início', icon: Home, color: 'hover:bg-[#FF8B66]/20' },
  { href: '/memoria', label: 'Memória', icon: Brain, color: 'hover:bg-[#F4B860]/25' },
  { href: '/quebra-cabeca', label: 'Quebra-cabeça', icon: Puzzle, color: 'hover:bg-[#7FB069]/25' },
  { href: '/quiz', label: 'Quiz', icon: HelpCircle, color: 'hover:bg-[#E78FB3]/25' },
]

export function SiteHeader() {
  const pathname = usePathname() ?? '/'

  return (
    <header className="sticky top-3 z-40 mx-auto w-full max-w-[1200px] px-3 sm:px-6">
      <div className="flex items-center gap-2 rounded-full border-2 border-[#2B2B2B]/10 bg-white/80 px-3 py-2 shadow-[0_6px_20px_-6px_rgba(107,68,35,0.25)] backdrop-blur-md dark:bg-[hsl(20_30%_14%)]/80">
        <Link href="/" className="flex shrink-0 items-center gap-2 rounded-full px-2 py-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF8B66] text-white shadow-md">
            <PawPrint className="h-5 w-5" />
          </span>
          <span className="hidden text-lg font-bold tracking-tight text-[#3A2418] sm:inline dark:text-[#FFE8D6]" style={{ fontFamily: 'var(--font-display)' }}>
            Toca do Tosh
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 sm:gap-2">
          {links?.map((l) => {
            const active = (l?.href === '/' && pathname === '/') || (l?.href !== '/' && pathname?.startsWith(l?.href))
            const Icon = l?.icon
            return (
              <Link
                key={l?.href}
                href={l?.href ?? '/'}
                aria-label={l?.label}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-all',
                  l?.color,
                  active
                    ? 'bg-[#FF8B66] text-white shadow-md hover:!bg-[#FF8B66]'
                    : 'text-[#3A2418] dark:text-[#FFE8D6]',
                )}
              >
                {Icon ? <Icon className="h-4 w-4" /> : null}
                <span className="hidden sm:inline">{l?.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
