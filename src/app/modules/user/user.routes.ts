import { Router } from "express";
import { UserController } from "./user.controller";
import { UserValidations } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";
import checkPermission from "../../middleware/checkPermission";
import { EAppFeatures } from "../roles/roles.interface";
import validateAuth from "../../middleware/auth";

const router = Router();

router.post(
  "/create-admin",
  validateAuth(),
  validateRequest(UserValidations.createUserValidationSchema),
  checkPermission(EAppFeatures.user, "create"),
  UserController.createUser
);

router.get(
  "/admin/get-all",
  validateAuth(),
  checkPermission(EAppFeatures.user, "read"),
  UserController.getAllUsers
);

router.delete(
  "/:userId",
  validateAuth(),
  checkPermission(EAppFeatures.user, "delete"),
  UserController.deleteUser
);

router.get(
  "/:id",
  validateAuth(),
  checkPermission(EAppFeatures.user, "read"),
  UserController.getSingleUser
);

export const UserRoutes = router;
