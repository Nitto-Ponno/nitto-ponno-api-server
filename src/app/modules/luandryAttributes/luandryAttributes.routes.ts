import { Router } from "express";
import checkPermission from "../../middleware/checkPermission";
import { EAppFeatures } from "../roles/roles.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { LaundryAttributeValidations } from "./luandryAttributes.validation";
import { LAttributeController } from "./luandryAttributes.contoller";
import validateAuth from "../../middleware/auth";

const router = Router();

router.get(
  "/",
  checkPermission(EAppFeatures.laundryAttribute, "read"),
  LAttributeController.getAllLaundryAttributesFromDB
);
router.post(
  "/",
  validateAuth,
  checkPermission(EAppFeatures.laundryAttribute, "create"),
  validateRequest(LaundryAttributeValidations.CreateLaundryAttributeSchema),
  LAttributeController.createLaundryAttribute
);
router.get(
  "/:id",
  checkPermission(EAppFeatures.laundryAttribute, "read"),
  LAttributeController.getLaundryAttributeById
);
router.patch(
  "/:id",
  validateAuth,
  checkPermission(EAppFeatures.laundryAttribute, "update"),
  validateRequest(LaundryAttributeValidations.UpdateLaundryAttributeSchema),
  LAttributeController.updateLaundryAttribute
);
router.delete(
  "/:id",
  validateAuth,
  checkPermission(EAppFeatures.laundryAttribute, "delete"),
  LAttributeController.deleteLaundryAttribute
);

export const LAttributeRoutes = router;
