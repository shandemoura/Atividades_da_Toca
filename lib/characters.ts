export type Character = {
  id: string
  name: string
  image: string
  color: string // tailwind bg
  ring: string  // tailwind ring
  description: string
}

export const characters: Character[] = [
  {
    id: 'tosh',
    name: 'Tosh',
    image: '/characters/tosh.png',
    color: 'bg-[#2B2B2B]',
    ring: 'ring-[#FF8B66]',
    description: 'O cachorrinho preto alegre, sempre com a língua de fora.',
  },
  {
    id: 'brenda',
    name: 'Brenda',
    image: '/characters/brenda.png',
    color: 'bg-[#C98A5F]',
    ring: 'ring-[#C98A5F]',
    description: 'A cachorrinha marrom, ranzinza mas de coração grande.',
  },
  {
    id: 'greg',
    name: 'Greg',
    image: '/characters/greg.png',
    color: 'bg-[#8B5A3C]',
    ring: 'ring-[#8B5A3C]',
    description: 'O amigo sério de boina, sempre pensativo.',
  },
  {
    id: 'dona-nanda',
    name: 'Dona Nanda',
    image: '/characters/dona-nanda.png',
    color: 'bg-[#3A3A3A]',
    ring: 'ring-[#F4B860]',
    description: 'A aranha fofa e cheia de sabedoria.',
  },
  {
    id: 'zig',
    name: 'Zig',
    image: '/characters/zig.png',
    color: 'bg-[#FF8B3D]',
    ring: 'ring-[#FF8B3D]',
    description: 'O lagartinho laranja, rápido e brincalhão.',
  },
]
