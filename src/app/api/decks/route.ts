import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Deck } from '@/models/Deck'
import { getUserFromCookie } from '@/lib/auth'


export async function POST(req: Request) {
  try {
    await connectDB()

    const user = await getUserFromCookie()
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, tags } = body

    const deck = await Deck.create({
      title,
      description,
      tags,
      createdBy: user.userId,
    })

    return NextResponse.json(deck, { status: 201 })
  } catch (err) {
    console.error('POST /api/decks error:', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  await connectDB()

  const user = await getUserFromCookie()
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const decks = await Deck.find({ createdBy: user.userId }).lean()
  return NextResponse.json(decks)
}
