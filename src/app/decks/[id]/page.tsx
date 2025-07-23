import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Deck } from '@/models/Deck'
import { connectDB } from '@/lib/db'
import mongoose from 'mongoose'
import DeckTable from './DeckTable'

interface DeckPageProps {
  params: { id: string }
}

export default async function DeckPage({ params }: DeckPageProps) {
  await connectDB()

  if (!mongoose.Types.ObjectId.isValid(params.id)) return notFound()

  const deck = await Deck.findById(params.id).lean() as any

  if (!deck) return notFound()
  const flashcards = deck.flashcards?.map((fc: any) => ({
    _id: fc._id.toString(),
    question: fc.question,
    answer: fc.answer,
  })) || []

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{deck.title}</h1>
      <p className="text-gray-700 mb-4">{deck.description}</p>

      {deck.tags?.length > 0 && (
        <div className="text-sm text-gray-500 mb-6">
          Tags: {deck.tags.join(', ')}
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <Link
          href={`/decks/${deck._id}/review`}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Start Review
        </Link>
      </div>

      <DeckTable flashcards={flashcards} />
    </div>
  )
}
