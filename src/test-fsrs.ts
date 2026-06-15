import { createEmptyCard, fsrs, Rating } from 'ts-fsrs'

const scheduler = fsrs()
const card = createEmptyCard()

// Preview all four possible outcomes before the user answers.
const preview = scheduler.repeat(card, new Date())
// Apply the final rating after the user has already answered.
const result = scheduler.next(card, new Date(), Rating.Good)

console.log("AGAIN\n")
console.log(preview[Rating.Again].card)
console.log("HARD\n")
console.log(preview[Rating.Hard].card)
console.log("GOOD\n")
console.log(preview[Rating.Good].card)
console.log("EASY\n")
console.log(preview[Rating.Easy].card)
console.log("RESULT CARD\n")
console.log(result.card)
console.log("RESULT LOG\n")
console.log(result.log)