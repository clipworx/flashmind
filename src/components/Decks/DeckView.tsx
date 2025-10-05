'use client'

import Link from 'next/link'
import DeckTable from '@/components/Decks/DeckTable'
import { useEffect, useState, use} from 'react'
import { useParams } from 'next/navigation'
import { useToastStore } from '@/stores/toastStore'
import { PencilSquareIcon,CheckCircleIcon,XCircleIcon } from '@heroicons/react/24/solid'
import { Tooltip } from 'react-tooltip'

export default function DeckView() {
  const params = useParams()
  interface Deck {
    _id: string
    title: string
    description: string
    flashcards?: string[]
  }

  const [deck, setDeck] = useState<Deck>({
    _id: '',
    title: '',
    description: '',
    flashcards: [],
  })
  useEffect(() => {
    const fetchDeck = async () => {
      if (!params?.id) return
      const response = await fetch(`/api/decks/${params.id}`)
      const data = await response.json()
      setDeck(data)
    }
    fetchDeck()
  }, [params])

  const notify = useToastStore(state => state.notify)

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const [title, setTitle] = useState(deck.title);
  const [description, setDescription] = useState(deck.description);

  const handleEditTitle = () => {
    setTitle(deck.title);
    setIsEditingTitle(true);
    setIsEditingDescription(false); // cancel description edit
  };

  const handleEditDescription = () => {
    setDescription(deck.description);
    setIsEditingDescription(true);
    setIsEditingTitle(false); // cancel title edit
  };

  const handleCancelTitle = () => {setIsEditingTitle(false); setTitle(deck.title);};
  const handleCancelDescription = () => {setIsEditingDescription(false); setDescription(deck.description);};

  const handleSaveTitle = async () => {
    // TODO: call API or update state globally
    console.log("Updated title:", title);
    const response = await fetch(`/api/decks/${deck._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });
    if (!response.ok) {
      notify({message:'Failed to update deck title.', type:'error'})
      return;
    }
    const data = await response.json();
    setDeck(data);
    notify({message:'Deck title updated successfully!', type:'success'})
    setIsEditingTitle(false);
  };

  const handleSaveDescription = async () => {

    const response = await fetch(`/api/decks/${deck._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    });
    if (!response.ok) {
      notify({message:'Failed to update deck description.', type:'error'})
      return;
    }
    notify({message:'Deck description updated successfully!', type:'success'})
    const data = await response.json();
    setDeck(data);
    setIsEditingDescription(false);
  };

  if (!deck) return <div className="p-8 text-gray-500">Loading deck...</div>
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title Section */}
      <div className="mb-1">
        {isEditingTitle ? (
          <div className="flex items-center space-x-2">
            <input
              className="border border-gray-300 rounded p-2 flex-1 min-h-10 text-4xl font-bold tracking-tighter"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={30}
            />
            <button
              data-tooltip-id="tooltip"
              data-tooltip-content="Save Title"
              onClick={handleSaveTitle}
              className='text-green-400'
            >
              <CheckCircleIcon className="size-6"/>
            </button>
            <button
              data-tooltip-id="tooltip"
              data-tooltip-content="Cancel Edit"
              onClick={handleCancelTitle}
              className='text-red-400'
            >
              <XCircleIcon className="size-6"/>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-left tracking-tighter">
            <h2 className="text-4xl font-bold mx-2 text-gray-700">{deck.title}</h2>
            <button
              data-tooltip-id="tooltip"
              data-tooltip-content="Edit Title"
              onClick={handleEditTitle}
              className='text-gray-500'
            >
                <PencilSquareIcon className="size-6"/>
            </button>
          </div>
        )}
      </div>

      {/* Description Section */}
      <div className="mb-6">
        {isEditingDescription ? (
          <div className="flex items-start space-x-2">
            <textarea
              className="border border-gray-300 rounded p-2 flex-1 min-h-20 max-h-20 text-lg text-gray-700"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={100}
            />
            <div className="flex flex-col space-y-2">
              <button
                data-tooltip-id="tooltip"
                data-tooltip-content="Save Description"
                onClick={handleSaveDescription}
                className='text-green-500'
              >
                <CheckCircleIcon className="size-6"/>
              </button>
              <button
                data-tooltip-id="tooltip"
                data-tooltip-content="Cancel Edit"
                onClick={handleCancelDescription}
                className='text-red-500'
              >
                <XCircleIcon className="size-6"/>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-left items-center mb-2 mx-2">
            <p className="text-gray-600 text-lg ">{deck.description}</p>
            <button
              data-tooltip-id="tooltip"
              data-tooltip-content="Edit Description"
              onClick={handleEditDescription}
              className="text-gray-400 ml-4"
            >
              <PencilSquareIcon className="size-4"/>
            </button>
          </div>
          
        )}
      </div>

      <div className="flex gap-4 mb-6">
        <Link
          href={(deck.flashcards?.length === 0) ?  `/decks/${deck._id}` : `/decks/${deck._id}/review`}
          className="bg-[#c4ebff] text-black px-4 py-2 rounded-lg hover:bg-[#d7f1ff] transition"
        >
          Start Review
        </Link>
      </div>
      <DeckTable deckId={deck._id} />
        <Tooltip 
          id="tooltip" 
          delayShow={300}
          style={{fontSize: "0.7rem", padding: "4px 6px"}}
      />
    </div>
  )
}
