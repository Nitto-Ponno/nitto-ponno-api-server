import { Router } from "express";
import { CategoryControllers } from "./category.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { CategoryValidations } from "./category.validation";
import checkPermission from "../../middleware/checkPermission";
import { EAppFeatures } from "../roles/roles.interface";
import validateAuth from "../../middleware/auth";

const router = Router();

router.post(
  "/create",
  validateAuth(),
  checkPermission(EAppFeatures.category, "create"),
  validateRequest(CategoryValidations.createCategoryValidationSchema),
  CategoryControllers.createCategory
);

router.get("/get-all", CategoryControllers.getAllCategories);

router.get(
  "/single/:id",
  checkPermission(EAppFeatures.category, "read"),
  CategoryControllers.getSingleCategories
);

router.delete(
  "/:id",
  validateAuth(),
  checkPermission(EAppFeatures.category, "delete"),
  CategoryControllers.deleteCategory
);

router.patch(
  "/:id",
  validateAuth(),
  checkPermission(EAppFeatures.category, "update"),
  validateRequest(CategoryValidations.updateCategoryValidationSchema),
  CategoryControllers.updateCategory
);

export const CategoryRoutes = router;
