import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Deck } from '@/models/Deck'

export async function GET(req: NextRequest) {
  await connectDB()

  const decks = await Deck.find().lean()

  if (!decks || decks.length === 0) {
    return NextResponse.json({ message: 'No decks found' }, { status: 404 })
  }

  const allFlashcards = decks.flatMap(deck =>
    (deck.flashcards || []).map((fc: any) => ({
      _id: fc._id.toString(),
      question: fc.question,
      answer: fc.answer,
      deckTitle: deck.title, 
    }))
  )

  return NextResponse.json({ flashcards: allFlashcards })
}