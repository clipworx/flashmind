import mongoose, { Schema, model, models } from 'mongoose'
import { User } from '@/models/User'

const FlashcardSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
})

const DeckSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    tags: { type: [String], default: [] },
    flashcards: { type: [FlashcardSchema], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: User },
  },
  { timestamps: true }
)

export const Deck = models.Deck || model('Deck', DeckSchema)
