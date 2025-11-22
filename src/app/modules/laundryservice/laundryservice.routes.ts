import { Router } from "express";
import checkPermission from "../../middleware/checkPermission";
import { EAppFeatures } from "../roles/roles.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { LaundryServiceValidation } from "./laundryservice.validation";
import { LaundryServiceController } from "./laundryservice.controller";
import validateAuth from "../../middleware/auth";

const router = Router();

// router.get("/");
router.post(
  "/",
  validateAuth(),
  checkPermission(EAppFeatures.laundryService, "create"),
  validateRequest(LaundryServiceValidation.CreateLaundryServiceSchema),
  LaundryServiceController.createLaundryService
);

router.patch(
  "/:id",
  validateAuth(),
  checkPermission(EAppFeatures.laundryService, "update"),
  validateRequest(LaundryServiceValidation.UpdateLaundryServiceSchema),
  LaundryServiceController.updateLaundryService
);

router.get("/", LaundryServiceController.getAllLaundryService);

const LaundryServiceRoutes = router;

export default LaundryServiceRoutes;
