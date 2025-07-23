'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Flashcard from '@/components/FlashCard'

type Flashcard = {
  question: string
  answer: string
}

export default function ReviewPage() {
  const params = useParams()
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    async function fetchFlashcards() {
      const res = await fetch(`/api/decks/${params.id}/flashcards`)
      if (res.ok) {
        const data = await res.json()
        setFlashcards(data)
      }
    }

    fetchFlashcards()
  }, [params.id])

  if (flashcards.length === 0) {
    return <p className="p-6">Loading flashcards...</p>
  }

  if (finished) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">You’ve completed the deck!</h2>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setCurrentIndex(0)
              setFinished(false)
            }}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Restart Review
          </button>

          <a
            href={`/decks/${params.id}`}
            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
          >
            Return to Deck
          </a>
        </div>
      </div>
    )
  }

  const currentCard = flashcards[currentIndex]

  return (
    <div className="max-w-xl mx-auto p-6">
      <p className="mb-4 text-gray-600">
        Card {currentIndex + 1} of {flashcards.length}
      </p>

      <div className="border rounded-xl p-6 shadow text-center">
        <Flashcard
          question={currentCard.question}
          answer={currentCard.answer}
          className="mx-auto mb-6"
          onNext={() => {
            if (currentIndex + 1 >= flashcards.length) {
              setFinished(true)
            } else {
              setCurrentIndex((prev) => prev + 1)
            }
          }}
        />
      </div>
    </div>
  )
}
