'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Deck = {
  _id: string
  title: string
  description: string
  tags?: string[]
}

export default function DecksPage() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/decks')
      .then(res => res.json())
      .then(data => {
        setDecks(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching decks:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">My Decks</h1>

      {loading && <p>Loading decks...</p>}
      {!loading && decks.length === 0 && <p>No decks found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {decks.map(deck => (
          <Link
            key={deck._id}
            href={`/decks/${deck._id}`}
            className="block rounded-xl border p-4 shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{deck.title}</h2>
            <p className="text-gray-600">{deck.description}</p>
            {Array.isArray(deck.tags) && deck.tags.length > 0 && (
              <div className="mt-2 text-sm text-gray-500">
                Tags: {deck.tags.join(', ')}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
