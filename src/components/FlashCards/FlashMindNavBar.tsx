'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useToastStore } from '@/stores/toastStore'

const navItems = [
  { label: 'Home', href: '/home' },
  { label: 'Decks', href: '/decks' },
  { label: 'Create', href: '/decks/create' }
]

const handleLogout = async () => {
  const res = await fetch('/api/auth/logout', { method: 'POST' })
  if(res.ok) {
    window.location.href = '/auth/login'
  }
  else {
    console.error('Logout failed')
  }
}

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="w-full bg-white px-6 py-4 bg-status-secured-coverage border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/flashmind-logo.png" alt="Flashmind Logo" className="w-11 mx-[15px]" />
          <Link href="/home" className="text-xl font-bold text-black font-serif italic">
            Flashmind
          </Link>
        </div>
        {/* Navigation Links */}
        <div className="flex gap-4 flex items-center">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                pathname === href && ' text-[#5891b3] font-bold',
                'text-lg hover:text-blue-600 transition-colors mx-2',
                pathname !== href && 'text-gray-600',
              )}
            >
              {label}
            </Link>
          ))}
          <a
            onClick={handleLogout}
            className="bg-red-400 text-white px-3 py-1 text-lg hover:bg-red-600 font-semibold rounded transition-colors cursor-pointer"
          >
            Logout
          </a>
        </div>
      </div>
    </nav>
  )
}
