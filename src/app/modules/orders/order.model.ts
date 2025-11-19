import { model, Schema } from "mongoose";
import {
  IOrder,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "./order.interface";

const orderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, unique: true },

    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pickupAddress: {
      fullAddress: { type: String, required: true },
      apartment: String,
      landmark: String,
    },
    deliveryAddress: {
      fullAddress: { type: String, required: true },
      apartment: String,
      landmark: String,
      sameAsPickup: { type: Boolean, default: false },
    },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "LaundryProduct" },
        productName: String,
        serviceId: { type: Schema.Types.ObjectId, ref: "LaundryService" },
        serviceName: String,
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true },
        attributeValues: [
          {
            attributeId: Schema.Types.ObjectId,
            attributeName: String,
            optionId: String,
          },
        ],
        subtotal: Number,
        discount: {
          type: { type: String, enum: ["percent", "flat"] },
          value: Number,
          appliedBy: String,
        },
      },
    ],
    subtotal: { type: Number, required: true },
    itemDiscountTotal: { type: Number, default: 0 },
    appliedCoupon: {
      code: String,
      discountType: String,
      discountValue: Number,
      maxDiscount: Number,
      appliedAmount: Number,
    },
    couponDiscount: Number,
    tax: { type: Number, default: 0 },
    deliveryCharge: { type: Number, required: true },
    surgeCharge: Number,
    tip: Number,
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    paymentId: String,
    paidAmount: Number,
    preferredPickupSlot: {
      date: String,
      from: String,
      to: String,
    },
    preferredDeliverySlot: {
      date: String,
      from: String,
      to: String,
    },
    actualPickupTime: Date,
    actualDeliveryTime: Date,
    pickupRider: { type: Schema.Types.ObjectId, ref: "Rider" },
    deliveryRider: { type: Schema.Types.ObjectId, ref: "Rider" },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    timeline: [
      {
        status: {
          type: String,
          enum: Object.values(OrderStatus),
          required: true,
        },
        timestamp: { type: Date, default: Date.now },
        rider: { type: Schema.Types.ObjectId, ref: "Rider" },
        note: String,
      },
    ],
    specialInstructions: String,
    perfume: Boolean,
    detergentType: String,
    foldOnly: Boolean,
    totalWeightKg: Number,
    cancelledBy: String,
    cancelReason: String,
    refundAmount: Number,
    refundId: String,
    rating: { type: Number, min: 1, max: 5 },
    review: String,
    reviewedAt: Date,
    source: { type: String, enum: ["app", "website", "admin"], default: "app" },
    isTest: { type: Boolean, default: false },
  },
  { timestamps: true }
);

orderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    const lastOrder = await (this.constructor as typeof Order).findOne(
      {},
      {},
      { sort: { createdAt: -1 } }
    );
    const year = new Date().getFullYear();
    let seq = 1;
    if (lastOrder && lastOrder.orderId) {
      const match = lastOrder.orderId.match(/LAUNDRY-\d{4}-(\d+)/);
      if (match) seq = parseInt(match[1]) + 1;
    }
    this.orderId = `LAUNDRY-${year}-${seq.toString().padStart(5, "0")}`;
  }
  next();
});

export const Order = model<IOrder>("Order", orderSchema);
