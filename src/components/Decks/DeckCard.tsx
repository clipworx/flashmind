'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useToastStore } from '@/stores/toastStore'
type Deck = {
  _id: string
  title: string
  description: string
  flashcards?: string[]
}

export default function DeckCard() {

  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const notify = useToastStore(state => state.notify)
  useEffect(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/decks`)
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const toggleMenu = (id: string) => {
    setOpenMenuId(prev => (prev === id ? null : id))
  }
  const retrieveDecks = async () => {
    try {
      const res = await fetch('/api/decks')
      const data = await res.json()
      setDecks(data)
    } catch (err) {
      console.error('Error fetching decks:', err)
    }
  }
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/decks/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Something went wrong while deleting')

      notify({message:'Deck deleted successfully!', type:'success'})
      retrieveDecks()
    } catch (err: any) {
      notify({message:'Failed to delete deck', type:'error'})
      console.error('Failed to delete deck:', err)
    }
  }
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">My Decks</h1>

      {loading && <p>Loading decks...</p>}
      {!loading && decks.length === 0 && <p>No decks found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {decks.map(deck => (
          <div
            key={deck._id}
            className="relative block rounded-xl border p-4 shadow hover:shadow-md transition group"
          >
            {/* 3-dot button */}
            <div className="absolute top-2 right-2">
              <button
                onClick={() => toggleMenu(deck._id)}
                className="text-gray-500 hover:text-black focus:outline-none"
              >
                ⋮
              </button>

              {openMenuId === deck._id && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-10">
                  <Link
                    href={`/decks/${deck._id}/edit`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(deck._id)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Deck Content */}
            <Link href={`/decks/${deck._id}`}>
              <h2 className="text-xl font-semibold">{deck.title}</h2>
              <p className="text-gray-600">{deck.description}</p>
              <p>{deck.flashcards ? deck.flashcards.length : 0} flashcards</p>
            </Link>

          </div>
        ))}
      </div>
    </div>
  )
}

