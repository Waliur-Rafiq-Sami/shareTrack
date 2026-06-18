import mongoose, { Schema, Document, models } from "mongoose";

export interface IFeedback extends Document {
  message: string;
  status: "pending" | "reviewed" | "resolved";
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    message: {
      type: String,
      required: [true, "Feedback message is required"],
      trim: true,
      maxlength: [1000, "Feedback cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Prevent Next.js hot-reloading from compiling the model multiple times
export default models.Feedback ||
  mongoose.model<IFeedback>("Feedback", FeedbackSchema);
