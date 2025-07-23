'use client'
import { useState } from 'react'

type Flashcard = {
  question: string
  answer: string
}

export default function FlashcardEditor({
  initialFlashcards,
}: {
  initialFlashcards: Flashcard[]
}) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(initialFlashcards)

  const updateField = (
    index: number,
    field: keyof Flashcard,
    value: string
  ) => {
    const updated = [...flashcards]
    updated[index][field] = value
    setFlashcards(updated)
  }

  const addRow = () => {
    setFlashcards((prev) => [...prev, { question: '', answer: '' }])
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Flashcards</h2>

      <table className="min-w-full border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Question</th>
            <th className="px-4 py-2 border">Answer</th>
          </tr>
        </thead>
        <tbody>
          {flashcards.map((fc, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border text-center">{index + 1}</td>
              <td className="px-4 py-2 border">
                <input
                  type="text"
                  value={fc.question}
                  onChange={(e) =>
                    updateField(index, 'question', e.target.value)
                  }
                  className="w-full border rounded px-2 py-1"
                />
              </td>
              <td className="px-4 py-2 border">
                <input
                  type="text"
                  value={fc.answer}
                  onChange={(e) =>
                    updateField(index, 'answer', e.target.value)
                  }
                  className="w-full border rounded px-2 py-1"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={addRow}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Add Row
      </button>
    </div>
  )
}
