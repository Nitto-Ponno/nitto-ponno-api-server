import { Schema, model, Document, Types } from "mongoose";

export enum OrderStatus {
  PENDING = "pending", // Customer placed, payment pending (if online)
  PAYMENT_FAILED = "payment_failed",
  CONFIRMED = "confirmed", // Payment done or COD accepted
  PICKUP_ASSIGNED = "pickup_assigned",
  PICKED_UP = "picked_up", // Rider collected clothes
  REACHED_LAUNDRY = "reached_laundry",
  IN_PROCESS = "in_process", // Washing / dry-cleaning / ironing
  READY_FOR_DELIVERY = "ready_for_delivery",
  DELIVERY_ASSIGNED = "delivery_assigned",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
  COMPLETED = "completed", // Customer confirmed received
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum PaymentMethod {
  COD = "cod",
  ONLINE = "online", // Card, UPI, Wallet, etc.
  WALLET = "wallet",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded",
}

// One item in the cart
export interface IOrderItem {
  productId: Types.ObjectId; // Laundry product (e.g., "Shirt Wash & Iron")
  productName?: string; // Snapshot (for history)
  serviceId: Types.ObjectId; // Specific service variant
  serviceName?: string;
  quantity: number;
  unitPrice: number; // Price per piece/kg at time of order
  attributeValues: {
    attributeId: Types.ObjectId;
    optionId: string;
    attributeName: string;
  }[];
  subtotal: number; // (unitPrice + extras) × quantity
  discount?: {
    type: "percent" | "flat";
    value: number;
    appliedBy?: "coupon" | "offer" | "manual";
  };
}

// Coupon / Promo
export interface IAppliedCoupon {
  code: string;
  discountType: "percent" | "flat";
  discountValue: number;
  maxDiscount?: number;
  appliedAmount: number;
}

// Timeline events (great for analytics & customer tracking)
export interface IOrderTimeline {
  status: OrderStatus;
  timestamp: Date;
  rider?: Types.ObjectId;
  note?: string;
}

export interface IOrder extends Document {
  orderId: string; // Human readable: LAUNDRY-2025-00069
  user: Types.ObjectId; // Customer
  pickupAddress: {
    fullAddress: string;
    apartment?: string;
    landmark?: string;
  };
  deliveryAddress: {
    fullAddress: string;
    apartment?: string;
    sameAsPickup?: boolean;
  };
  items: IOrderItem[];
  subtotal: number;
  itemDiscountTotal: number; // Discounts on individual items
  couponDiscount?: number; // From promo code
  appliedCoupon?: IAppliedCoupon;
  tax: number;
  deliveryCharge: number;
  surgeCharge?: number; // Peak hours, rain, etc.
  tip?: number;
  totalAmount: number; // Final amount customer paid / will pay

  // Payment
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string; // Stripe, Razorpay, etc.
  paidAmount?: number; // In case of partial refund

  // Scheduling
  preferredPickupSlot: {
    date: string; // "2025-04-15"
    from: string; // "10:00"
    to: string; // "12:00"
  };
  preferredDeliverySlot?: {
    date: string;
    from: string;
    to: string;
  };
  actualPickupTime?: Date;
  actualDeliveryTime?: Date;

  // Riders
  pickupRider?: Types.ObjectId;
  deliveryRider?: Types.ObjectId;

  // Status & Tracking
  status: OrderStatus;
  timeline: IOrderTimeline[];

  // Extra services
  specialInstructions?: string;
  perfume?: boolean;
  detergentType?: string;
  foldOnly?: boolean;

  // Weight (if you charge per kg)
  totalWeightKg?: number;

  // Cancellation / Refund
  cancelledBy?: "customer" | "rider" | "admin" | "shop";
  cancelReason?: string;
  refundAmount?: number;
  refundId?: string;

  // Ratings & Feedback
  rating?: number; // 1–5
  review?: string;
  reviewedAt?: Date;

  // Metadata
  source: "app" | "website" | "admin";
  isTest?: boolean;

  createdAt: Date;
  updatedAt: Date;
}
