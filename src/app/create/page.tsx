'use client'

import { useState } from 'react'

export default function CreateDeckPage() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')

    function handleAddTag() {
        if (tagInput && !tags.includes(tagInput)) {
        setTags((prev) => [...prev, tagInput.trim()])
        setTagInput('')
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const newDeck = { title, description, tags }

        try {
            const res = await fetch('/api/decks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newDeck),
            })

            if (!res.ok) {
            throw new Error('Failed to create deck')
            }

            const created = await res.json()
            console.log('Deck created:', created)

            // Redirect or show success message
        } catch (err) {
            console.error('Submit error:', err)
        }
    }


  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6 text-black">Create a New Deck</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Type a tag and press Add"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition"
            >
              Add
            </button>
          </div>
          {/* Show tags */}
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-300 cursor-pointer hover:bg-blue-200 transition"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Save Deck
          </button>
        </div>
      </form>
    </div>
  )
}
