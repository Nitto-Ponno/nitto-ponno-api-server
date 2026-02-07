import { Router } from "express";
import { adminController } from "./admin.controller";
import validateAuth from "../../middleware/auth";
import checkPermission from "../../middleware/checkPermission";
import { EAppFeatures } from "../roles/roles.interface";

const router = Router();

router.post(
  "/toggle-rider/:id",
  validateAuth(),
  checkPermission(EAppFeatures.user, "update"),
  adminController.toggleRider
);
router.get(
  "/rider/get-all",
  validateAuth(),
  checkPermission(EAppFeatures.user, "read"),
  adminController.getAllRiders
);
router.get(
  "/update-user/:id",
  validateAuth(),
  checkPermission(EAppFeatures.user, "update"),
  adminController.updateUser
);

export const AdminRoutes = router;
