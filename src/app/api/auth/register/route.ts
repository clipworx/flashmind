// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import bcrypt from 'bcrypt'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ email, password: hashed })

    return NextResponse.json({ message: 'User registered', userId: user._id })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 })
  }
}
