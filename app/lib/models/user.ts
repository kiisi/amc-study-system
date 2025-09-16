import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true, },
  lastName: { type: String, required: true, },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, 
{ timestamps: true });

const UserModel: Model<IUser> = mongoose.models.user || mongoose.model<IUser>("user", userSchema);

export { UserModel };