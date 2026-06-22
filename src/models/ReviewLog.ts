import { Schema, model } from "mongoose";

const reviewLogSchema = new Schema(
  {
    cardId: {
      type: Schema.Types.ObjectId,
      ref: "Card",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { type: Number, required: true },
    state: Number,
    due: Date,
    stability: Number,
    difficulty: Number,
    elapsed_days: Number,
    last_elapsed_days: Number,
    scheduled_days: Number,
    learning_steps: Number,
    review: Date,
  },
  {
    timestamps: true,
  }
);

export default model("ReviewLog", reviewLogSchema);