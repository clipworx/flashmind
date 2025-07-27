'use client'

import { useToastStore } from '@/stores/toastStore'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ToastContainer() {
  const { toasts, remove } = useToastStore()
  const [visibleToasts, setVisibleToasts] = useState<typeof toasts>([])

  // Show up to 3 toasts
  useEffect(() => {
    const nextToasts = toasts.slice(0, 7)
    setVisibleToasts(nextToasts)
  }, [toasts])

  // Auto-dismiss visible toasts after 3 seconds
  useEffect(() => {
    const timers = visibleToasts.map(toast =>
      setTimeout(() => {
        remove(toast.id)
      }, 3000)
    )

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [visibleToasts, remove])

  return (
    <div className="fixed top-24 right-4 space-y-3 z-50">
      <AnimatePresence initial={false}>
        {visibleToasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            layout
            className={`flex items-start gap-2 px-4 py-3 rounded-md shadow-md w-80 text-white ${
              toast.type === 'success'
                ? 'bg-green-600'
                : toast.type === 'error'
                ? 'bg-red-600'
                : 'bg-blue-600'
            }`}
          >
            <div className="flex-1">{toast.message}</div>
            <button
              onClick={() => remove(toast.id)}
              className="text-white/80 hover:text-white"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
