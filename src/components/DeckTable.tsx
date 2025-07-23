'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface Flashcard {
  _id: number
  question: string
  answer: string
  isNew?: boolean
}

export default function DeckTable({ deckId }: { deckId: string }) {
    const params = useParams()
    const [rows, setRows] = useState<Flashcard[]>([])
    const [error, setError] = useState<string | null>(null)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [editCache, setEditCache] = useState<{ question: string; answer: string } | null>(null)
    const [showPopup, setShowPopup] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFlashcards = async () => {
            if (!deckId) return
            setLoading(true)
            try {
                const res = await fetch(`/api/decks/${deckId}/flashcards`)
                const data = await res.json()
                setRows(data.flashcards || [])
            } catch (err) {
                console.error('Failed to load flashcards:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchFlashcards()
    }, [deckId]) // runs once on mount, or if deckId changes
    
    const handleAddRow = () => {
        setRows(prev => [
        ...prev,
        { question: '', answer: '', isNew: true } as Flashcard
        ]) 
    }

    const handleEdit = (index: number) => {
        setEditCache({ question: rows[index].question, answer: rows[index].answer })
        setEditingIndex(index)
    }

    const handleUpdate = async (index: number, flashcardId: any) => {
        const fc = rows[index]
        if (!flashcardId) return

        const res = await fetch(`/api/decks/${params.id}/flashcards/${flashcardId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: fc.question, answer: fc.answer }),
        })

        if (!res.ok) {
            const data = await res.json()
            setError(data.message || 'Failed to update')
            return
        }

        const data = await res.json()

        setRows(prev => {
            const updated = [...prev]
            updated[index] = data.flashcard
            return updated
        })

        setEditingIndex(null)
        setEditCache(null)
    }

    const handleCancelEdit = () => {
        if (editingIndex !== null && editCache) {
            const updatedRows = [...rows]
            updatedRows[editingIndex] = {
            ...updatedRows[editingIndex],
            question: editCache.question,
            answer: editCache.answer,
            }
            setRows(updatedRows)
        }
        setEditingIndex(null)
        setEditCache(null)
    }

    const handleDelete = async (index: number, flashcardId: any) => {
        try {
            const res = await fetch(`/api/decks/${params.id}/flashcards/${flashcardId}`, {
                method: 'DELETE',
            })

            if (!res.ok) {
                const data = await res.json()
                setError(data.message || 'Delete failed')
                return
            }

            const updatedRows = [...rows]
            updatedRows.splice(index, 1)
            setRows(updatedRows)
        } catch (err) {
            console.error(err)
            setError('Delete failed')
        }
    }


    const handleChange = (index: number, field: 'question' | 'answer', value: string) => {
        const updated = [...rows]
        updated[index][field] = value
        setRows(updated)
    }
    const handleCancel = (index: number) => {
        const updated = [...rows]
        updated.splice(index, 1) 
        setRows(updated)
    }


    const handleSave = async (index: number) => {
        const flashcard = rows[index]
        if (!flashcard.question?.trim() || !flashcard.answer?.trim()) {
            setShowPopup(true)
            return
        }

        try {
            const res = await fetch(`/api/decks/${params.id}/flashcards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: flashcard.question,
                answer: flashcard.answer,
            }),
            })

            const data = await res.json()

            if (!res.ok) {
            setError(data.message || 'Something went wrong')
            return
            }

            // ✅ Refetch updated flashcard list from backend
            await fetchFlashcards()
        } catch (err) {
            setError('Failed to save flashcard.')
        }
    }
    const fetchFlashcards = async () => {
        try {
            const res = await fetch(`/api/decks/${params.id}/flashcards`)
            const data = await res.json()

            if (!res.ok) {
            setError(data.message || 'Failed to fetch flashcards')
            return
            }

            setRows(data.flashcards)
        } catch (err) {
            setError('Error loading flashcards')
        }
    }


  return (
    <div>
        <h2 className="text-xl font-semibold mb-2">Flashcards</h2>

        <table className="w-full table-fixed">
            <thead>
                <tr>
                    <th className="p-2 border w-[40px]">#</th>
                    <th className="p-2 border w-2/5">Question</th>
                    <th className="p-2 border w-2/5">Answer</th>
                    <th className="p-2 border w-[120px]">Actions</th>
                </tr>
            </thead>

        <tbody>
            {rows.map((fc, index) => (
                <tr key={index}>
                    <td className="p-2 border">{index + 1}</td>

                    <td className="p-2 border">
                        {fc.isNew || editingIndex === index ? (
                            <textarea
                                value={fc.question}
                                onChange={(e) => handleChange(index, 'question', e.target.value)}
                                className="p-2 border w-full rounded"
                                placeholder="Enter question"
                            />
                        ) : (
                            fc.question
                        )}
                        </td>

                        <td className="p-2 border">
                            {fc.isNew || editingIndex === index ? (
                                <textarea
                                    value={fc.answer}
                                    onChange={(e) => handleChange(index, 'answer', e.target.value)}
                                    className="p-2 border w-full rounded"
                                    placeholder="Enter answer"
                                />
                            ) : (
                                fc.answer
                            )}
                        </td>


                    <td className="p-2 border text-center align-top">
                        {fc.isNew ? (
                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={() => handleSave(index)}
                                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm transition"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => handleCancel(index)}
                                    className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400 text-sm transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : editingIndex === index ? (
                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={() => handleUpdate(index, fc._id)}
                                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm transition"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => handleCancelEdit()}
                                    className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400 text-sm transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={() => handleEdit(index)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(index, fc._id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm transition"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                        </td>
                </tr>
            ))}
        </tbody>
    </table>

    <button
        onClick={handleAddRow}
        className="mt-4 bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 transition text-black"
    >
        + Add Row
    </button>
    {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-md max-w-sm w-full text-center text-black">
            <h2 className="text-lg font-semibold mb-4">Missing Fields</h2>
            <p className="mb-4">Both question and answer are required.</p>
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={() => setShowPopup(false)}
            >
                OK
            </button>
            </div>
        </div>
    )}
    </div>
  )
}
function setLoading(arg0: boolean) {
    throw new Error('Function not implemented.')
}

