'use client'

import Link from 'next/link'
import DeckTable from '@/components/DeckTable'
import { useEffect, useState, use } from 'react'
import { useParams } from 'next/navigation'

export default function DeckView() {
  const params = useParams()
  interface Deck {
    _id: string
    title: string
    description: string
  }

  const [deck, setDeck] = useState<Deck>({
    _id: '',
    title: '',
    description: '',
  })

  useEffect(() => {
    const fetchDeck = async () => {
      if (!params?.id) return
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/decks/${params.id}`)
      const data = await response.json()
      setDeck(data)
    }
    fetchDeck()
  }, [params])
  if (!deck) return <div className="p-8 text-gray-500">Loading deck...</div>
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{deck.title}</h1>
      <p className="text-gray-700 mb-4">{deck.description}</p>

      <div className="flex gap-4 mb-6">
        <Link
          href={`/decks/${deck._id}/review`}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Start Review
        </Link>
      </div>
      <DeckTable deckId={deck._id} />
    </div>
  )
}
