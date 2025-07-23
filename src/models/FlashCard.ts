import mongoose, { Schema, model, models } from 'mongoose'

const flashcardSchema = new Schema(
  {
    deckId: {
      type: Schema.Types.ObjectId,
      ref: 'Deck',
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export const Flashcard = models.Flashcard || model('Flashcard', flashcardSchema)
