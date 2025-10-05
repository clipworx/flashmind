"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

const navItems = [
  { label: 'Home', href: '/home' },
  { label: 'Decks', href: '/decks' },
  { label: 'Create', href: '/decks/create' }
]

const handleLogout = async () => {
  const res = await fetch('/api/auth/logout', { method: 'POST' })
  if (res.ok) {
    window.location.href = '/auth/login'
  } else {
    console.error('Logout failed')
  }
}

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // close mobile menu on navigation
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <nav className="w-full bg-white px-4 sm:px-6 py-4 bg-status-secured-coverage border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/flashmind-logo.png" alt="Flashmind Logo" className="w-11 mr-3" />
          <Link href="/home" className="text-xl font-bold text-black font-serif italic">
            Flashmind
          </Link>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-4">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                pathname === href && 'text-[#5891b3] font-bold',
                'text-lg hover:text-blue-600 transition-colors mx-2',
                pathname !== href && 'text-gray-600'
              )}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="bg-red-400 text-white px-3 py-1 text-lg hover:bg-red-600 font-semibold rounded transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setOpen((s) => !s)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel - always rendered so we can animate open/close */}
      <div
        className={cn('md:hidden bg-white overflow-hidden mobile-menu', open ? 'open' : 'closed')}
        aria-hidden={!open}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                pathname === href && 'text-[#5891b3] font-semibold',
                'text-base hover:text-blue-600 transition-colors block px-2 py-2 rounded'
              )}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="bg-red-400 text-white px-3 py-2 text-base hover:bg-red-600 font-semibold rounded transition-colors mt-1"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
