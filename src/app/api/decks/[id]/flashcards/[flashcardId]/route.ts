export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Deck } from '@/models/Deck'

type Params = {
  id: string;
  flashcardId: string;
};

// PATCH: Update a flashcard inside a deck
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { id, flashcardId } = await params;
  await connectDB()
  const { question, answer } = await req.json()

  const deck = await Deck.findById(id)
  if (!deck) {
    return NextResponse.json({ message: 'Deck not found' }, { status: 404 })
  }

  const flashcard = deck.flashcards.id(flashcardId)
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
  { params }: { params: Promise<Params> }
) {
  const { id, flashcardId } = await params;
  await connectDB()

  const deck = await Deck.findById(id)
  if (!deck) {
    return NextResponse.json({ message: 'Deck not found' }, { status: 404 })
  }

  const flashcard = deck.flashcards.id(flashcardId)
  if (!flashcard) {
    return NextResponse.json({ message: 'Flashcard not found' }, { status: 404 })
  }

  flashcard.deleteOne() // Remove subdocument
  await deck.save()

  return NextResponse.json({ message: 'Flashcard deleted' })
}
