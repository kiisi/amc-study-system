import mongoose, { Schema, Document, Model } from "mongoose";
import type { IQuestion } from "./question";

export enum SESSION_MODE {
    PRACTICE = "practice",
    EXAM = "exam",
}

export enum SESSION_STATUS {
    IN_PROGESS = "in_progress",
    COMPLETED = "completed",
}

export interface IQuestionAttempt extends Document {
    question: IQuestion["_id"]; // reference to the Question
    userAnswer: string; // what the user picked
    isCorrect: boolean; // optional but useful for tracking
}

export interface ISession extends Document {
    mode: SESSION_MODE;
    status: SESSION_STATUS;
    numberOfQuestions: Number;
    questionAttempts: IQuestionAttempt[];
    completedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const questionAttemptSchema = new Schema<IQuestionAttempt>(
    {
        question: {
            type: Schema.Types.ObjectId,
            ref: "question",
            required: true,
        },
        userAnswer: {
            type: String,
            required: false,
        },
        isCorrect: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false } // no separate _id for subdocuments
);

const sessionSchema = new Schema<ISession>({
    mode: {
        type: String,                          // ✅ Must specify type
        enum: Object.values(SESSION_MODE),    // ✅ enum applies here
        required: true,
    },
    numberOfQuestions: {
        type: Number,
    },
    status: {
        type: String,
        enum: Object.values(SESSION_STATUS),
        default: SESSION_STATUS.IN_PROGESS,
    },
    completedAt: {
        type: Date,
        default: null,
    },
    questionAttempts: [questionAttemptSchema],
}, { timestamps: true }
);

const SessionModel: Model<ISession> = mongoose.models.session || mongoose.model<ISession>("session", sessionSchema);

export { SessionModel };