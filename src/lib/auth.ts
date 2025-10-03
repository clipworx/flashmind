import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const secret2 = new TextEncoder().encode(process.env.JWT_SECRET)

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret2)
    return payload
  } catch (err) {
    return null
  }
}

export async function getUserFromCookie() {
  const token = (await cookies()).get('token')?.value
  if (!token) return null

  try {
    return await verifyToken(token) as { userId: string }
  } catch {
    return null
  }
}
