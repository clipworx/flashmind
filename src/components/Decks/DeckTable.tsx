'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useToastStore } from '@/stores/toastStore'
import { PencilSquareIcon, TrashIcon, DocumentDuplicateIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Tooltip } from 'react-tooltip';

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
    const notify = useToastStore(state => state.notify)

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
        try {
            const fc = rows[index]
        if (!flashcardId) return

        const res = await fetch(`/api/decks/${params.id}/flashcards/${flashcardId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: fc.question, answer: fc.answer }),
        })

        if (!res.ok) {
            throw new Error('Failed to update flashcard')
        }

        const data = await res.json()
        notify({message:'Flashcard updated successfully!', type:'success'})
        setRows(prev => {
            const updated = [...prev]
            updated[index] = data.flashcard
            return updated
        })

        setEditingIndex(null)
        setEditCache(null)
        } catch (err) {
            notify({message:'Failed to update flashcard', type:'error'})
            console.error('Failed to update flashcard:', err)
        }
        
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
                throw new Error('Failed to delete flashcard')
            }

            const updatedRows = [...rows]
            updatedRows.splice(index, 1)
            notify({message:'Flashcard deleted successfully!', type:'success'})
            setEditingIndex(null)
            setRows(updatedRows)
        } catch (err) {
            console.error(err)
            notify({message:'Failed to delete flashcard', type:'error'})
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
                throw new Error(data.message || 'Failed to save flashcard')
            }
            notify({message:'Flashcard saved successfully!', type:'success'})
            await fetchFlashcards()
        } catch (err) {
            console.error('Failed to save flashcard:', err)
            notify({message:'Failed to save flashcard', type:'error'})
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
        <table className="w-full table-fixed">
            <thead>
                <tr>
                    <th className="p-2 border-b w-2/5">Question</th>
                    <th className="p-2 border-b w-2/5">Answer</th>
                    <th className="p-2 border-b w-[120px]"></th>
                </tr>
            </thead>

        <tbody>
            {rows.map((fc, index) => (
                <tr key={index}>

                    <td className="p-2 border-b border-gray-300">
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

                        <td className="p-2 border-b border-gray-300">
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


                    <td className="p-2 text-center align-center border-b border-gray-300">
                        {fc.isNew ? (
                            <div className="flex gap-2 justify-center">
                                <button
                                    data-tooltip-id="tooltip"
                                    data-tooltip-content="Save Flashcard"
                                    onClick={() => handleSave(index)}
                                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm transition"
                                >
                                    <CheckIcon className="h-4 w-4" />
                                </button>
                                
                                <button
                                    data-tooltip-id="tooltip"
                                    data-tooltip-content="Cancel Flashcard"
                                    onClick={() => handleCancel(index)}
                                    className="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-500 text-sm transition"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ) : editingIndex === index ? (
                            <div className="flex gap-2 justify-center">
                                <button
                                    data-tooltip-id="tooltip"
                                    data-tooltip-content="Save Flashcard"
                                    onClick={() => handleUpdate(index, fc._id)}
                                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm transition"
                                >
                                    <CheckIcon className="h-4 w-4" />
                                </button>
                                <button
                                    data-tooltip-id="tooltip"
                                    data-tooltip-content="Cancel Edit"
                                    onClick={() => handleCancelEdit()}
                                    className="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-500 text-sm transition"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2 justify-center">
                                <button
                                    data-tooltip-id="tooltip"
                                    data-tooltip-content="Edit Flashcard"
                                    onClick={() => handleEdit(index)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm transition"
                                >
                                    <PencilSquareIcon className="h-4 w-4" />
                                </button>
                                <button
                                    data-tooltip-id="tooltip"
                                    data-tooltip-content="Duplicate Flashcard"
                                    onClick={() => handleSave(index)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm transition"
                                >
                                    <DocumentDuplicateIcon className="h-4 w-4" />
                                </button>
                                <button
                                    data-tooltip-id="tooltip"
                                    data-tooltip-content="Delete Flashcard"
                                    onClick={() => handleDelete(index, fc._id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm transition"
                                >
                                    <TrashIcon className="h-4 w-4" />
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
        className="mt-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition text-black"
    >
        Add Row
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
    <Tooltip 
        id="tooltip" 
        delayShow={300}
        style={{fontSize: "0.7rem", padding: "4px 6px"}}
    />
    </div>
  )
}

