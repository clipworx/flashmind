import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FlashMindNavBar from '@/components/FlashCards/FlashMindNavBar'
import ToastContainer from '@/components/Notifications/ToastContainer'
import { cookies } from 'next/headers'

export const dynamic = "force-dynamic"; // 👈 forces server-rendering

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
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("token")?.value;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {token && <FlashMindNavBar />}
        {token && <ToastContainer />}
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
