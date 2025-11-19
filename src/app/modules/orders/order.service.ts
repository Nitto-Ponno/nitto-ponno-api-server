import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Order } from "./order.model";
import { Counter } from "./counter.model";
import { OrderStatus } from "./order.interface";

// Helper: Add timeline event
const addTimelineEvent = (
  order: any,
  status: string,
  note?: string,
  rider?: string
) => {
  order.timeline.push({
    status,
    timestamp: new Date(),
    rider,
    note,
  });
  order.status = status;
};

const createOrder = async (userId: string, payload: any) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    // Generate orderId using counter (recommended)
    const counter = await Counter.findByIdAndUpdate(
      { _id: `orderId_${new Date().getFullYear()}` },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, session }
    );

    const orderData = {
      ...payload,
      user: userId,
      orderId: `LAUNDRY-${new Date().getFullYear()}-${counter.seq
        .toString()
        .padStart(5, "0")}`,
      status: payload.paymentMethod === "cod" ? "confirmed" : "pending",
      timeline: [
        {
          status: payload.paymentMethod === "cod" ? "confirmed" : "pending",
          timestamp: new Date(),
          note: "Order placed by customer",
        },
      ],
    };

    const order = await Order.create([orderData], { session });
    await session.commitTransaction();
    return order[0];
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const getUserOrders = async (userId: string, query: any) => {
  const { page = 1, limit = 10, status } = query;
  const filter: any = { user: userId };
  if (status) filter.status = status;

  const skip = (page - 1) * limit;

  const [total, orders] = await Promise.all([
    Order.countDocuments(filter),
    Order.find(filter)
      .populate("items.productId", "name image")
      .populate("items.serviceId", "name")
      .populate("pickupRider", "name phone")
      .populate("deliveryRider", "name phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  return {
    meta: {
      currentPage: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: orders,
  };
};

const getAllOrders = async (query: any) => {
  const {
    page = 1,
    limit = 10,
    status,
    paymentMethod,
    search,
    startDate,
    endDate,
  } = query;

  const filter: any = {};

  if (status) filter.status = status;
  if (paymentMethod) filter.paymentMethod = paymentMethod;
  if (search) {
    filter.$or = [
      { orderId: { $regex: search, $options: "i" } },
      { "userSnapshot.name": { $regex: search, $options: "i" } },
      { "userSnapshot.phone": { $regex: search, $options: "i" } },
    ];
  }
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const [total, orders] = await Promise.all([
    Order.countDocuments(filter),
    Order.find(filter)
      .populate("user", "name phone email")
      .populate("pickupRider deliveryRider", "name phone")
      .populate("items.productId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  return {
    meta: {
      currentPage: +page,
      limit: +limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: orders,
  };
};

const getOrderById = async (id: string) => {
  const order = await Order.findById(id)
    .populate("user", "name phone email")
    .populate("pickupRider deliveryRider", "name phone")
    .populate("items.productId", "name image")
    .populate("items.serviceId", "name");

  if (!order) throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  return order;
};

const updateOrder = async (id: string, payload: any) => {
  const order = await Order.findById(id);
  if (!order) throw new AppError(httpStatus.NOT_FOUND, "Order not found");

  // Example: Assign pickup rider
  if (payload.pickupRider) {
    order.pickupRider = payload.pickupRider;
    addTimelineEvent(
      order,
      "pickup_assigned",
      "Pickup rider assigned",
      payload.pickupRider
    );
  }

  if (payload.status) {
    addTimelineEvent(order, payload.status, payload.note);
  }

  Object.assign(order, payload);
  await order.save();
  await order.populate("pickupRider deliveryRider user");
  return order;
};

const cancelOrder = async (id: string, userId: string, reason?: string) => {
  const order = await Order.findById(id);
  if (!order) throw new AppError(httpStatus.NOT_FOUND, "Order not found");

  if (
    order.user.toString() !== userId &&
    order.status !== "pending" &&
    order.status !== "confirmed"
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "Cannot cancel this order");
  }

  order.status = OrderStatus.CANCELLED;
  order.cancelledBy = "customer";
  order.cancelReason = reason || "Requested by customer";
  addTimelineEvent(order, "cancelled", reason);

  await order.save();
  return order;
};

export const OrderService = {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrder,
  cancelOrder,
};
