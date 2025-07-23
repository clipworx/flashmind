import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Deck } from '@/models/Deck'

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()
    const { title, description, tags } = body

    const newDeck = await Deck.create({ title, description, tags })
    return NextResponse.json(newDeck, { status: 201 })
  } catch (err) {
    console.error('POST /api/decks error:', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectDB()
    const decks = await Deck.find().sort({ createdAt: -1 }) // Newest first
    return NextResponse.json(decks)
  } catch (err) {
    console.error('GET /api/decks error:', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
