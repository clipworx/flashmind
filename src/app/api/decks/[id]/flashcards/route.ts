import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Deck } from '@/models/Deck'

export const runtime = 'nodejs'
// POST: Add a flashcard
export async function POST(req: NextRequest, context: { params: { id: string } }) {
  await connectDB()
  const { question, answer } = await req.json()

  if (!question || !answer) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
  }

  const deck = await Deck.findById(context.params.id)
  if (!deck) {
    return NextResponse.json({ message: 'Deck not found' }, { status: 404 })
  }

  deck.flashcards.push({ question, answer })
  await deck.save()

  return NextResponse.json({ message: 'Flashcard added', flashcard: { question, answer } })
}

// GET: Retrieve all flashcard
export async function GET( req: NextRequest, context: { params: { id: string } }) {

  await connectDB()
  const id = context.params.id
  const deck = await Deck.findById(id).lean()

  if (!deck || Array.isArray(deck) || !deck.flashcards) {
    return NextResponse.json({ message: 'Deck not found' }, { status: 404 })
  }

  return NextResponse.json({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    flashcards: deck.flashcards.map((fc: any) => ({
      _id: fc._id.toString(),
      question: fc.question,
      answer: fc.answer,
    })),
  })
}

// PATCH: Update a flashcard
export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  await connectDB()
  const { index, question, answer } = await req.json()

  if (typeof index !== 'number') {
    return NextResponse.json({ message: 'Invalid index' }, { status: 400 })
  }

  const deck = await Deck.findById(context.params.id)
  if (!deck || !deck.flashcards[index]) {
    return NextResponse.json({ message: 'Flashcard not found' }, { status: 404 })
  }

  deck.flashcards[index].question = question
  deck.flashcards[index].answer = answer
  await deck.save()

  return NextResponse.json({ message: 'Flashcard updated', flashcard: deck.flashcards[index] })
}

// DELETE: Delete a flashcard
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  await connectDB()
  const { index } = await req.json()

  if (typeof index !== 'number') {
    return NextResponse.json({ message: 'Invalid index' }, { status: 400 })
  }

  const deck = await Deck.findById(context.params.id)
  if (!deck || !deck.flashcards[index]) {
    return NextResponse.json({ message: 'Flashcard not found' }, { status: 404 })
  }

  deck.flashcards.splice(index, 1)
  await deck.save()

  return NextResponse.json({ message: 'Flashcard deleted' })
}
