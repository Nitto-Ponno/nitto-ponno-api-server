import { Router } from "express";
import { EAppFeatures } from "../roles/roles.interface";
import checkPermission from "../../middleware/checkPermission";
import validateAuth from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { OrderController } from "./order.controller";
import { createOrderSchema, updateOrderSchema } from "./order.validation";

const router = Router();

// ─── Customer Routes ───
router.post(
  "/",
  validateAuth,
  validateRequest(createOrderSchema),
  OrderController.createOrder
);

router.get("/my", validateAuth, OrderController.getMyOrders); // User's own orders

// ─── Admin / Staff Routes ───
router.get(
  "/",
  validateAuth,
  checkPermission(EAppFeatures.laundryOrder, "read"),
  OrderController.getAllOrders // Admin panel: all orders + filters
);

router.get(
  "/:id",
  validateAuth,
  checkPermission(EAppFeatures.laundryOrder, "read"),
  OrderController.getSingleOrder
);

router.patch(
  "/:id",
  validateAuth,
  checkPermission(EAppFeatures.laundryOrder, "update"),
  validateRequest(updateOrderSchema),
  OrderController.updateOrder
);

// Optional: cancel order (customer or admin)
router.patch("/:id/cancel", validateAuth, OrderController.cancelOrder);

const OrderRoutes = router;

export default OrderRoutes;
