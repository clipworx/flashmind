import type { Metadata } from "next";
import { DM_Mono, DM_Sans, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FlashMindNavBar from '@/components/FlashCards/FlashMindNavBar'
import ToastContainer from '@/components/Notifications/ToastContainer'
import { cookies } from 'next/headers'

export const dynamic = "force-dynamic"; // 👈 forces server-rendering

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sansMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: "300"
});

export const metadata: Metadata = {
  title: "Flashmind",
  description: "A flashcard app for learning",
  icons: {
    icon: '/flashmind-logo.svg',
    shortcut: '/flashmind-logo.svg',
    apple: '/flashmind-logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const checkToken = async () => {
    const token = (await cookies()).get("token")?.value;
    if(!token) return false;
    return true;
  }
  const hasToken = checkToken()
  return (
    <html lang="en">
      <body
        className={`${sans.variable} ${sansMono.variable} antialiased`}
      >
        {hasToken.then(res => res && (
          <>
            <FlashMindNavBar />
            <ToastContainer />
          </>
        )).catch(() => null)}

        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
