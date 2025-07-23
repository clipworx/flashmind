'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils' // optional helper for class merging

type DeckCardProps = {
  id: string
  title: string
  description?: string
  cardCount?: number
  tags?: string[]
  className?: string
}

export default function DeckCard({
  id,
  title,
  description,
  cardCount = 0,
  tags = [],
  className = '',
}: DeckCardProps) {
  return (
    <Link href={`/decks/${id}`}>
      <div
        className={cn(
          'bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all cursor-pointer',
          className
        )}
      >
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        )}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>{cardCount} card{cardCount === 1 ? '' : 's'}</span>
          <div className="flex gap-1 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
