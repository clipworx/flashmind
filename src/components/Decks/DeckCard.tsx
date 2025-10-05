'use client'

import Link from 'next/link'
import React from "react";
import { useEffect, useState } from 'react'
import { useToastStore } from '@/stores/toastStore'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";

type Deck = {
  _id: string
  title: string
  description: string
  flashcards?: string[]
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

export default function DeckCard() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [deckColors, setDeckColors] = useState<{[key: string]: string}>({})
  const notify = useToastStore(state => state.notify)
  const [tempId, setTempId] = useState<string | null>(null)
  useEffect(() => {
      fetch(`/api/decks`)
        .then(res => res.json())
        .then(data => {
          setDecks(data)
          const colors: {[key: string]: string} = {}
          data.forEach((deck: Deck) => {
            colors[deck._id] = getRandomBgColor()
          })
          setDeckColors(colors)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching decks:', err)
          setLoading(false)
        })
    }, [])
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const truncateDescription = (text: string, wordLimit: number = 10) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId(prev => (prev === id ? null : id))
  }
  const retrieveDecks = async () => {
    try {
      const res = await fetch('/api/decks')
      const data = await res.json()
      setDecks(data)
    } catch (err) {
      console.error('Error fetching decks:', err)
    }
  }
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/decks/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Something went wrong while deleting')

      notify({message:'Deck deleted successfully!', type:'success'})
      retrieveDecks()
    } catch (err: any) {
      notify({message:'Failed to delete deck', type:'error'})
      console.error('Failed to delete deck:', err)
    }
  }
  
  if (loading) {
    return (
      <div className="w-full p-6 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
        </div>
        <p className="text-gray-600 mt-4 text-lg">Loading your decks...</p>
      </div>
    )
  }
  return (
    <div className="w-full p-6 max-w-4xl mx-auto items-center">
      <h1 className="text-3xl font-bold mb-4 text-center tracking-tighter">My Decks</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {decks.map(deck => (
          <div
            key={deck._id}
            className={`${deckColors[deck._id]} relative block rounded-xl p-1 shadow hover:shadow-md transition group`}
          >
            {/* 3-dot button */}
            <div className="absolute top-4 right-4 bg-gray-200 rounded-full">
              <a
                onClick={() => toggleMenu(deck._id)}
                className="text-gray-500 hover:text-black focus:outline-none p-4 cursor-pointer"
              >
                ⋮
              </a>

              {openMenuId === deck._id && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-10 p-2">
                  <Link
                    href={`/decks/${deck._id}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Edit
                  </Link>
                  <a
                    onClick={() => {
                      setTempId(deck._id)
                      onOpen()
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    Delete
                  </a>
                </div>
              )}
            </div>

            {/* Deck Content */}
            <Link href={`/decks/${deck._id}`}>
              <div className="flex flex-col justify-between">
                <div className="bg-white mb-2 rounded-xl py-8 text-black">
                  <h2 className="px-4 text-2xl font-bold tracking-tighter">{deck.title}</h2>
                  <p className="px-4 text-gray-600">{truncateDescription(deck.description, 10)}</p>
                </div>
                <p className="pb-2 px-4 mt-2 text-gray-500">{deck.flashcards ? deck.flashcards.length : 0} {deck.flashcards?.length === 1 ? 'flashcard' : 'flashcards'}</p>
              </div>
            </Link>

          </div>
        ))}
        <Link href="/decks/create">
          <div className="flex flex-col items-center justify-center h-48 border-2 rounded-xl text-gray-500 hover:border-gray-400 hover:text-gray-700 transition cursor-pointer">
            <p className="mt-2 text-lg font-medium">＋ Add Deck</p>
          </div>
        </Link>
      </div>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement={"center"}
            backdrop={"blur"}
            hideCloseButton={true}
          >
          <ModalContent className="max-w-lg w-full p-8">
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 bg-gray-200 rounded-tl-lg rounded-tr-lg">Confirm Delete</ModalHeader>
                <ModalBody className="space-y-4 max-h-96 overflow-y-auto bg-gray-200 text-black p-6 ">
                  <p>
                    Are you sure you want to delete this deck? This action cannot be undone.
                  </p>
                </ModalBody>
                <ModalFooter className="bg-gray-200 rounded-b-lg items-center gap-4 justify-center">
                  <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleDelete(tempId ? tempId : '')}>
                    Delete
                  </button>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onClose}>
                    Cancel
                  </button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
    </div>
  )
}

