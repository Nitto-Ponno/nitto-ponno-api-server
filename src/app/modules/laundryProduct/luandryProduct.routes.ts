import { Router } from "express";
import { EAppFeatures } from "../roles/roles.interface";
import checkPermission from "../../middleware/checkPermission";
import { validateRequest } from "../../middleware/validateRequest";
import {
  CreateProductSchema,
  UpdateProductSchema,
} from "./luandryProduct.validation";
import { ProductController } from "./luandryProduct.contoller";

const router = Router();

// CREATE
router.post(
  "/",
  checkPermission(EAppFeatures.laundryProduct, "create"),
  validateRequest(CreateProductSchema),
  ProductController.createProduct
);

// GET ALL + Pagination + Search + Filters
router.get("/", ProductController.getAllProducts);

// GET SINGLE
router.get(
  "/:id",
  checkPermission(EAppFeatures.laundryProduct, "read"),
  ProductController.getSingleProduct
);

// UPDATE
router.patch(
  "/:id",
  checkPermission(EAppFeatures.laundryProduct, "update"),
  validateRequest(UpdateProductSchema),
  ProductController.updateProduct
);

// DELETE (soft)
router.delete(
  "/:id",
  checkPermission(EAppFeatures.laundryProduct, "delete"),
  ProductController.deleteProduct
);

export const ProductRoutes = router;
