import { Router } from "express";
import checkPermission from "../../middleware/checkPermission";
import { EAppFeatures } from "../roles/roles.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { LaundryServiceValidation } from "./laundryservice.validation";
import { LaundryServiceController } from "./laundryservice.controller";

const router = Router();

// router.get("/");
router.post(
  "/",
  checkPermission(EAppFeatures.laundryService, "create"),
  validateRequest(LaundryServiceValidation.CreateLaundryServiceSchema),
  LaundryServiceController.createLaundryService
);

router.patch(
  "/:id",
  checkPermission(EAppFeatures.laundryService, "update"),
  validateRequest(LaundryServiceValidation.UpdateLaundryServiceSchema),
  LaundryServiceController.updateLaundryService
);

router.get(
  "/",
  checkPermission(EAppFeatures.laundryService, "read"),
  LaundryServiceController.getAllLaundryService
);

const LaundryServiceRoutes = router;

export default LaundryServiceRoutes;
