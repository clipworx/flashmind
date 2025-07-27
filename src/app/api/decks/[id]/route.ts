import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Deck } from '@/models/Deck'
import mongoose from 'mongoose'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {

  try {
    await connectDB()

    const id = params.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })
    }

    const deck = await Deck.findById(id).lean()

    if (!deck) {
      return NextResponse.json({ message: 'Deck not found' }, { status: 404 })
    }

    return NextResponse.json(deck)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connectDB()

  const deck = await Deck.findById(context.params.id)
  if (!deck) {
    return NextResponse.json({ message: 'Deck not found' }, { status: 404 })
  }

  await deck.deleteOne()

  return NextResponse.json({ message: 'Deck deleted' })
}
