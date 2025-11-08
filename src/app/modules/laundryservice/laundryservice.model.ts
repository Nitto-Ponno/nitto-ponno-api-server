import { model, Schema } from "mongoose";
import { ILaundryService } from "./laundryservice.interface";

const laundryServiceSchema = new Schema<ILaundryService>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    icon: String,
    description: String,
    shortDescription: String,
    warnings: String,
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

laundryServiceSchema.index({
  name: "text",
  description: "text",
  shortDescription: "text",
  slug: "text",
});

export const LaundryService = model<ILaundryService>(
  "LaundryService",
  laundryServiceSchema
);
