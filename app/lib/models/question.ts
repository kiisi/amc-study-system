import mongoose, { Schema, Document } from "mongoose";

export interface IOption {
  option: string;
}

export interface IQuestion extends Document {
  questionText: string;
  options: IOption[];
  correctAnswer: string;
  explanation: string;
  subject: Schema.Types.ObjectId;
  questionImages: string[]; // store image URLs or base64
}

const OptionSchema: Schema = new Schema<IOption>(
  {
    option: { type: String, required: true },
  },
  { _id: false }
);

const QuestionSchema: Schema = new Schema<IQuestion>(
  {
    questionText: { type: String, required: true },
    options: { type: [OptionSchema], required: true },
    correctAnswer: { type: String, required: true },
    explanation: { type: String, default: "" },
    subject: { type: Schema.Types.ObjectId, ref: "subject", required: true },
    questionImages: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const QuestionModel =
  mongoose.models.question || mongoose.model<IQuestion>("question", QuestionSchema);
