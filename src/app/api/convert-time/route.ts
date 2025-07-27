import { NextRequest, NextResponse } from 'next/server'
import { DateTime } from 'luxon'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { datetime, toTimezone } = body

    if (!datetime || !toTimezone) {
      return NextResponse.json(
        { error: 'Please provide datetime and toTimezone.' },
        { status: 400 }
      )
    }

    const convertedTime = DateTime.fromISO(datetime, { zone: 'America/Toronto' })
      .setZone(toTimezone)
      .toFormat('yyyy-MM-dd hh:mm a ZZZZ')

    return NextResponse.json({
      original: { datetime, timezone: 'America/Toronto (Ottawa Time)' },
      converted: { datetime: convertedTime, timezone: toTimezone },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid date or timezone format.' },
      { status: 500 }
    )
  }
}
