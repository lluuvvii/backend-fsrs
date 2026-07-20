import { Schema, Types, model } from "mongoose";

export interface IDeck {
  userId: Types.ObjectId;

  name: string;

  description?: string;
}

const deckSchema = new Schema<IDeck>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default model("Deck", deckSchema);