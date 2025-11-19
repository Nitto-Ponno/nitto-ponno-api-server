import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderService } from "./order.service";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await OrderService.createOrder(userId.toString(), req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Order placed successfully",
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const query = req.query as any;
  const result = await OrderService.getUserOrders(userId.toString(), query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Your orders retrieved successfully",
    data: result.data,
    pagination: result.meta,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getAllOrders(req.query as any);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders retrieved successfully",
    data: result.data,
    pagination: result.meta,
  });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OrderService.getOrderById(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order retrieved successfully",
    data: result,
  });
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OrderService.updateOrder(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order updated successfully",
    data: result,
  });
});

const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;
  const result = await OrderService.cancelOrder(
    id,
    userId.toString(),
    req.body.reason
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order cancelled successfully",
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  cancelOrder,
};
