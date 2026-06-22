import { Schema, Types, model } from "mongoose";


export interface ICard {
  userId: Types.ObjectId;

  front: string;
  back: string;

  due: Date;
  stability: number;
  difficulty: number;

  elapsed_days: number;
  scheduled_days: number;

  reps: number;
  lapses: number;

  learning_steps: number;

  state: number;

  last_review: Date | null;
}

const cardSchema = new Schema<ICard>(
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
    last_review: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export default model("Card", cardSchema);