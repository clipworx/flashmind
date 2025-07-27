// stores/toastStore.ts
import { create } from 'zustand'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  notify: (toast: Omit<Toast, 'id'>) => void
  remove: (id: string) => void
}

export const useToastStore = create<ToastStore>(set => ({
  toasts: [],
  notify: (toast) => {
    set(state => {
      if (state.toasts.length >= 3) return state // max 3 toasts at once
      const id = Date.now().toString()
      const newToast = { ...toast, id }
      
      setTimeout(() => {
        set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }))
      }, toast.duration || 3000)

      return { toasts: [...state.toasts, newToast] }
    })
  },
  remove: (id) => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),
}))
