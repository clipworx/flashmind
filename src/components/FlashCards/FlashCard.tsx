'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type FlashcardProps = {
  question: string
  answer: string
  className?: string
  onNext: (isCorrect: boolean) => void
}

const bgColors = [
  'bg-[#c4ebff]',
  'bg-[#fdd7c9]',
  'bg-[#d3f2e2]',
  'bg-[#e9e2fe]',
  'bg-[#ffdcf0]',
  'bg-[#fff0ca]',
]

const getRandomBgColor = () => {
  return bgColors[Math.floor(Math.random() * bgColors.length)]
}

export default function Flashcard({ question, answer, className, onNext }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false)

  
  const handleNext = (isCorrect: boolean) => {
    setFlipped(false)
    setTimeout(() => {
      onNext(isCorrect)
    }, 300) // delay for flip animation
  }

  return (
    <div className={`${getRandomBgColor()} w-full flex flex-col items-center px-1 py-1 rounded-lg gap-4`}>
      <div
        className={cn(
          'w-full h-64 max-h-[400px] perspective cursor-pointer',
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
      <div className="flex justify-center gap-4 pb-4">
        <button
          onClick={() => handleNext(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Correct
        </button>
        <button
          onClick={() => handleNext(false)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Incorrect
        </button>
      </div>
    </div>
  )
}
