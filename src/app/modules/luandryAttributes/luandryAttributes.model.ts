import mongoose, { Schema, Document } from "mongoose";
import { ILAttribute } from "./luandryAttributes.interface";

// Mongoose Schema
const LaundryAttributeSchema = new Schema<ILAttribute>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    options: [
      {
        value: {
          type: String,
          required: true,
          trim: true,
        },
        id: {
          type: String,
          unique: true,
          required: true,
        },
        _id: false, // Disable auto _id for subdocuments
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Indexes for better query performance
LaundryAttributeSchema.index({ slug: 1 }, { unique: true });

// Model
export const LaundryAttribute = mongoose.model<ILAttribute>(
  "LaundryAttribute",
  LaundryAttributeSchema
);
