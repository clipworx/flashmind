import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Deck } from '@/models/Deck'

// PATCH: Update a flashcard inside a deck
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; flashcardId: string } }
) {
  await connectDB()
  const { question, answer } = await req.json()

  const deck = await Deck.findById(params.id)
  if (!deck) {
    return NextResponse.json({ message: 'Deck not found' }, { status: 404 })
  }

  const flashcard = deck.flashcards.id(params.flashcardId)
  if (!flashcard) {
    return NextResponse.json({ message: 'Flashcard not found' }, { status: 404 })
  }

  flashcard.question = question
  flashcard.answer = answer
  await deck.save()

  return NextResponse.json({ message: 'Flashcard updated', flashcard })
}

// DELETE: Remove a flashcard inside a deck
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; flashcardId: string } }
) {
  await connectDB()

  const deck = await Deck.findById(params.id)
  if (!deck) {
    return NextResponse.json({ message: 'Deck not found' }, { status: 404 })
  }

  const flashcard = deck.flashcards.id(params.flashcardId)
  if (!flashcard) {
    return NextResponse.json({ message: 'Flashcard not found' }, { status: 404 })
  }

  flashcard.deleteOne() // Remove subdocument
  await deck.save()

  return NextResponse.json({ message: 'Flashcard deleted' })
}
