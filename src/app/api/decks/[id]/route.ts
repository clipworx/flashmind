import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Deck } from '@/models/Deck'

type Params = {
  id: string;
};

// GET: Get a specific deck
export async function GET(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  await connectDB()
  
  try {
    const deck = await Deck.findById(id)
    if (!deck) {
      return NextResponse.json({ message: 'Deck not found' }, { status: 404 })
    }
    return NextResponse.json(deck)
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching deck' }, { status: 500 })
  }
}

// PUT/PATCH: Update a specific deck
export async function PUT(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  await connectDB()
  
  try {
    const body = await req.json()
    const deck = await Deck.findByIdAndUpdate(id, body, { new: true })
    if (!deck) {
      return NextResponse.json({ message: 'Deck not found' }, { status: 404 })
    }
    return NextResponse.json(deck)
  } catch (error) {
    return NextResponse.json({ message: 'Error updating deck' }, { status: 500 })
  }
}

// DELETE: Delete a specific deck
export async function DELETE(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  await connectDB()
  
  try {
    const deck = await Deck.findByIdAndDelete(id)
    if (!deck) {
      return NextResponse.json({ message: 'Deck not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Deck deleted successfully' })
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting deck' }, { status: 500 })
  }
}
