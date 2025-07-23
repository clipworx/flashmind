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

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })
    }

    const deck = await Deck.findById(params.id).lean()
    
    if (!deck) {
      return NextResponse.json({ message: 'Deck not found' }, { status: 404 })
    }

    return NextResponse.json(deck)
  } catch (err) {
    console.error(`GET /api/decks/${params.id} error:`, err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
