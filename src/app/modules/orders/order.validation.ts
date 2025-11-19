import { z } from "zod";
import { OrderStatus, PaymentMethod, PaymentStatus } from "./order.interface";

// Reusable sub-schemas
const orderItemSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
  productName: z.string().optional(),
  serviceId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid service ID"),
  serviceName: z.string().optional(),
  quantity: z.number().int().positive("Quantity must be positive"),
  unitPrice: z.number().nonnegative("Unit price cannot be negative"),
  attributeValues: z
    .array(
      z.object({
        attributeId: z
          .string()
          .regex(/^[0-9a-fA-F]{24}$/, "Invalid attribute ID"),
        optionId: z.string().min(1, "Option ID required"),
        attributeName: z.string().min(1, "Attribute name required"),
      })
    )
    .default([]),
  subtotal: z.number().nonnegative("Subtotal cannot be negative"),
  discount: z
    .object({
      type: z.enum(["percent", "flat"]),
      value: z.number().nonnegative(),
      appliedBy: z.enum(["coupon", "offer", "manual"]).optional(),
    })
    .optional(),
});

const addressSchema = z.object({
  fullAddress: z.string().min(5, "Full address must be at least 5 characters"),
  apartment: z.string().optional(),
  landmark: z.string().optional(),
});

const deliveryAddressSchema = z.object({
  fullAddress: z.string().min(5, "Full address must be at least 5 characters"),
  apartment: z.string().optional(),
  sameAsPickup: z.boolean().optional(),
});

const appliedCouponSchema = z.object({
  code: z.string().min(1, "Coupon code required"),
  discountType: z.enum(["percent", "flat"]),
  discountValue: z.number().positive("Discount value must be positive"),
  maxDiscount: z.number().positive().optional(),
  appliedAmount: z.number().nonnegative("Applied amount cannot be negative"),
});

const timeSlotSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  from: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
  to: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
});

// CREATE ORDER SCHEMA
export const createOrderSchema = z
  .object({
    user: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),

    pickupAddress: addressSchema,

    deliveryAddress: deliveryAddressSchema,

    items: z.array(orderItemSchema).min(1, "At least one item required"),

    subtotal: z.number().nonnegative("Subtotal cannot be negative"),

    itemDiscountTotal: z
      .number()
      .nonnegative("Item discount cannot be negative")
      .default(0),

    couponDiscount: z.number().nonnegative().optional(),

    appliedCoupon: appliedCouponSchema.optional(),

    tax: z.number().nonnegative("Tax cannot be negative").default(0),

    deliveryCharge: z
      .number()
      .nonnegative("Delivery charge cannot be negative")
      .default(0),

    surgeCharge: z.number().nonnegative().optional(),

    tip: z.number().nonnegative().optional(),

    totalAmount: z.number().positive("Total amount must be positive"),

    paymentMethod: z.enum(PaymentMethod),

    paymentStatus: z.enum(PaymentStatus).default(PaymentStatus.PENDING),

    paymentId: z.string().optional(),

    paidAmount: z.number().nonnegative().optional(),

    preferredPickupSlot: timeSlotSchema,

    preferredDeliverySlot: timeSlotSchema.optional(),

    specialInstructions: z
      .string()
      .max(500, "Instructions too long")
      .optional(),

    perfume: z.boolean().optional(),

    detergentType: z.string().optional(),

    foldOnly: z.boolean().optional(),

    totalWeightKg: z.number().positive().optional(),

    source: z.enum(["app", "website", "admin"]).default("app"),

    isTest: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // Validate that totalAmount matches calculated amount
      const calculatedTotal =
        data.subtotal -
        data.itemDiscountTotal -
        (data.couponDiscount || 0) +
        data.tax +
        data.deliveryCharge +
        (data.surgeCharge || 0) +
        (data.tip || 0);

      return Math.abs(calculatedTotal - data.totalAmount) < 0.01; // Allow for floating point errors
    },
    {
      message: "Total amount does not match calculated sum",
      path: ["totalAmount"],
    }
  );

// UPDATE ORDER SCHEMA
export const updateOrderSchema = z
  .object({
    // Address updates (rare, but possible before pickup)
    pickupAddress: addressSchema.optional(),
    deliveryAddress: deliveryAddressSchema.optional(),

    // Payment updates
    paymentStatus: z.enum(PaymentStatus).optional(),
    paymentId: z.string().optional(),
    paidAmount: z.number().nonnegative().optional(),

    // Scheduling changes
    preferredPickupSlot: timeSlotSchema.optional(),
    preferredDeliverySlot: timeSlotSchema.optional(),
    actualPickupTime: z.date().or(z.string().datetime()).optional(),
    actualDeliveryTime: z.date().or(z.string().datetime()).optional(),

    // Rider assignment
    pickupRider: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid rider ID")
      .optional(),
    deliveryRider: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid rider ID")
      .optional(),

    // Status updates
    status: z.enum(OrderStatus).optional(),

    // Additional services
    specialInstructions: z.string().max(500).optional(),
    perfume: z.boolean().optional(),
    detergentType: z.string().optional(),
    foldOnly: z.boolean().optional(),

    // Weight (usually added after pickup)
    totalWeightKg: z.number().positive().optional(),

    // Charges adjustments (admin only)
    deliveryCharge: z.number().nonnegative().optional(),
    surgeCharge: z.number().nonnegative().optional(),
    tip: z.number().nonnegative().optional(),
    tax: z.number().nonnegative().optional(),
    totalAmount: z.number().positive().optional(),

    // Cancellation
    cancelledBy: z.enum(["customer", "rider", "admin", "shop"]).optional(),
    cancelReason: z.string().max(500).optional(),
    refundAmount: z.number().nonnegative().optional(),
    refundId: z.string().optional(),

    // Ratings
    rating: z.number().min(1).max(5).optional(),
    review: z.string().max(1000).optional(),
    reviewedAt: z.date().or(z.string().datetime()).optional(),
  })
  .refine(
    (data) => {
      // If order is being cancelled, cancelReason should be provided
      if (data.status === OrderStatus.CANCELLED) {
        return data.cancelReason !== undefined && data.cancelReason.length > 0;
      }
      return true;
    },
    {
      message: "Cancel reason required when cancelling order",
      path: ["cancelReason"],
    }
  )
  .refine(
    (data) => {
      // If refundAmount is set, paymentStatus should be REFUNDED or PARTIALLY_REFUNDED
      if (data.refundAmount !== undefined && data.refundAmount > 0) {
        return (
          data.paymentStatus === PaymentStatus.REFUNDED ||
          data.paymentStatus === PaymentStatus.PARTIALLY_REFUNDED
        );
      }
      return true;
    },
    {
      message:
        "Payment status must be REFUNDED or PARTIALLY_REFUNDED when refund amount is set",
      path: ["paymentStatus"],
    }
  )
  .refine(
    (data) => {
      // If rating is provided, review should also be provided
      if (data.rating !== undefined) {
        return data.review !== undefined && data.review.length > 0;
      }
      return true;
    },
    {
      message: "Review text required when providing a rating",
      path: ["review"],
    }
  );

// STATUS UPDATE SCHEMA (for specific status transitions)
export const updateOrderStatusSchema = z.object({
  status: z.enum(OrderStatus),
  note: z.string().max(500).optional(),
  riderId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid rider ID")
    .optional(),
});

// PAYMENT UPDATE SCHEMA
export const updatePaymentSchema = z.object({
  paymentStatus: z.enum(PaymentStatus),
  paymentId: z.string().min(1, "Payment ID required"),
  paidAmount: z.number().positive("Paid amount must be positive"),
});

// RIDER ASSIGNMENT SCHEMA
export const assignRiderSchema = z.object({
  riderId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid rider ID"),
  type: z.enum(["pickup", "delivery"]),
});

// CANCEL ORDER SCHEMA
export const cancelOrderSchema = z.object({
  cancelledBy: z.enum(["customer", "rider", "admin", "shop"]),
  cancelReason: z
    .string()
    .min(10, "Cancel reason must be at least 10 characters")
    .max(500),
  refundAmount: z.number().nonnegative().optional(),
});

// RATING SCHEMA
export const rateOrderSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  review: z.string().min(10, "Review must be at least 10 characters").max(1000),
});
