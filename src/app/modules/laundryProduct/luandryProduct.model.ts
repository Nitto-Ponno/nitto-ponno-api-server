import { Schema, model, Document, Types } from "mongoose";
import {
  IAttributeValue,
  ILProduct,
  IProductVariation,
} from "./luandryProduct.interface";

// 1. AttributeValue Sub-schema
const attributeValueSchema = new Schema<IAttributeValue>(
  {
    attributeId: {
      type: Schema.Types.ObjectId,
      ref: "LaundryAttribute", // assuming you have an Attribute model
      required: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false } // no need for _id on sub-document
);

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
    attributeValues: {
      type: [attributeValueSchema],
      required: true,
      validate: [arrayMinLength, "At least one attribute value is required"],
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

// Custom validator for non-empty array
function arrayMinLength(val: any[]) {
  return val.length > 0;
}

// 4. Main Product Schema
const productSchema = new Schema<ILProduct & Document>(
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
