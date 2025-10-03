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
    <nav className="w-full px-6 py-4 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* App Name */}
        <Link href="/home" className="text-xl font-bold text-blue-600">
          Flashmind
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-4">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors',
                pathname === href && 'text-blue-600 font-semibold'
              )}
            >
              {label}
            </Link>
          ))}
          <a
            onClick={handleLogout}
            className="button text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            Logout
          </a>
        </div>
      </div>
    </nav>
  )
}
