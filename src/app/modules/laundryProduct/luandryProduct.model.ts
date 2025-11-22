import { Schema, model, Document } from "mongoose";
import { ILProduct, IProductVariation } from "./luandryProduct.interface";

// 2. Discount Sub-schema (reused in variation & product)
const discountSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["percent", "flat"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

// 3. ProductVariation Schema
const productVariationSchema = new Schema<IProductVariation>(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "LaundryService", // assuming you have a Service model
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: discountSchema,
      required: false,
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true, // allows multiple null/undefined values but unique when present
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt for variations
);

// 4. Main Product Schema
const productSchema = new Schema<ILProduct & Document>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: discountSchema,
      required: true,
    },
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: "LaundryService",
        required: true,
      },
    ],
    attributes: [
      {
        type: Schema.Types.ObjectId,
        ref: "LaundryAttribute",
        required: true,
      },
    ],
    variations: {
      type: [productVariationSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
productSchema.index({ name: "text", description: "text" });

// Virtual: calculated final price for product (after discount)
productSchema.virtual("finalPrice").get(function () {
  if (!this.discount) return this.price;
  if (this.discount.type === "flat") {
    return Math.max(0, this.price - this.discount.value);
  }
  return this.price * (1 - this.discount.value / 100);
});

// Instance method: get variation final price
productVariationSchema.methods.getFinalPrice = function () {
  if (!this.discount) return this.price;
  if (this.discount.type === "flat") {
    return Math.max(0, this.price - this.discount.value);
  }
  return this.price * (1 - this.discount.value / 100);
};

// 5. Model
export const Product = model<ILProduct & Document>("Product", productSchema);

// Optional: Export types for use elsewhere
export type ProductDocument = ILProduct & Document;
export type ProductVariationDocument = IProductVariation & Document;
