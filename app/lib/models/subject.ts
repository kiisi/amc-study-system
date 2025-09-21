import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubject extends Document {
  name: string;
}

const subjectSchema = new Schema<ISubject>({
  name: { type: String, required: true, },
}, 
{ timestamps: true });

const SubjectModel: Model<ISubject> = mongoose.models.subject || mongoose.model<ISubject>("subject", subjectSchema);

export { SubjectModel };