'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useToastStore } from '@/stores/toastStore'
export default function NewFlashcardPage() {
    const params = useParams()
    const router = useRouter()
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const notify = useToastStore(state => state.notify)
    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            setLoading(true)

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/decks/${params.id}/flashcards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, answer }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || 'Failed to create flashcard')
            }
            notify({ message: 'Flashcard added successfully!', type: 'success' })
            router.push(`/decks/${params.id}`)
        } catch (error: any) {
            notify({ message: error.message || 'Failed to create flashcard', type: 'error' })
            setLoading(false)
            
        }
        
    }

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Add New Flashcard</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          {loading ? 'Adding...' : 'Add Flashcard'}
        </button>
      </form>
    </div>
  )
}
