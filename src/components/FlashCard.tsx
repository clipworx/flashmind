'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type FlashcardProps = {
  question: string
  answer: string
  className?: string
  onNext: () => void
}

export default function Flashcard({ question, answer, className, onNext }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false)

  const handleNext = () => {
    setFlipped(false)
    setTimeout(() => {
      onNext()
    }, 300) // delay for flip animation
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={cn(
          'w-full max-w-md h-64 perspective cursor-pointer',
          className
        )}
        onClick={() => setFlipped((prev) => !prev)}
      >
        <div
          className={cn(
            'relative w-full h-full duration-500 transform-style-preserve-3d transition-transform',
            flipped && 'rotate-y-180'
          )}
        >
          {/* Front */}
          <div className="absolute w-full h-full bg-white rounded-xl shadow-md p-6 backface-hidden flex items-center justify-center text-center">
            <p className="text-xl font-semibold text-gray-800">{question}</p>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full bg-blue-50 border border-red-500 rounded-xl shadow-md p-6 backface-hidden rotate-y-180 flex items-center justify-center text-center">
            <p className="text-lg text-gray-700">{answer}</p>
          </div>
        </div>
      </div>

      {/* Answer Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleNext}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Correct
        </button>
        <button
          onClick={handleNext}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Incorrect
        </button>
      </div>
    </div>
  )
}
