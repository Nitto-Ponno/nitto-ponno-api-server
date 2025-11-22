import { Router } from "express";
import { EAppFeatures } from "../roles/roles.interface";
import checkPermission from "../../middleware/checkPermission";
import { validateRequest } from "../../middleware/validateRequest";
import {
  CreateProductSchema,
  UpdateProductSchema,
} from "./luandryProduct.validation";
import { ProductController } from "./luandryProduct.contoller";
import validateAuth from "../../middleware/auth";

const router = Router();

// CREATE
router.post(
  "/",
  validateAuth(),
  checkPermission(EAppFeatures.laundryProduct, "create"),
  validateRequest(CreateProductSchema),
  ProductController.createProduct
);

// GET ALL + Pagination + Search + Filters
router.get("/", ProductController.getAllProducts);

// GET SINGLE
router.get("/:id", ProductController.getSingleProduct);
router.get("/byslug/:slug", ProductController.getSingleProductByslug);

// UPDATE
router.patch(
  "/:id",
  validateAuth(),
  checkPermission(EAppFeatures.laundryProduct, "update"),
  validateRequest(UpdateProductSchema),
  ProductController.updateProduct
);

// DELETE (soft)
router.delete(
  "/:id",
  validateAuth(),
  checkPermission(EAppFeatures.laundryProduct, "delete"),
  ProductController.deleteProduct
);

export const ProductRoutes = router;
