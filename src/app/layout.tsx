export const dynamic = 'force-dynamic'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FlashMindNavBar from '@/components/FlashCards/FlashMindNavBar'
import ToastContainer from '@/components/Notifications/ToastContainer'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { Providers } from './providers'
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flashmind",
  description: "A flashcard app for learning",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const token = (await cookies()).get('token')?.value
  let user = null
  if (token) {
    try {
      user = await verifyToken(token) as { userId: string, email: string }
    } catch {
      user = null
    }
  }
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers user={user}>
          {user && <FlashMindNavBar />}
          {user && <ToastContainer />}
          <main className="p-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
