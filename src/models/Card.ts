import { Schema, model } from "mongoose";

const cardSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    front: {
      type: String,
      required: true,
    },
    back: {
      type: String,
      required: true,
    },
    due: Date,
    stability: Number,
    difficulty: Number,
    elapsed_days: Number,
    scheduled_days: Number,
    reps: Number,
    lapses: Number,
    learning_steps: Number,
    state: Number,
    last_review: Date,
  },
  {
    timestamps: true,
  }
);

export default model("Card", cardSchema);