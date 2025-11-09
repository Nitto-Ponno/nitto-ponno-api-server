import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import validateAuth from "../middleware/auth";
import { UserRoutes } from "../modules/user/user.routes";
import { RolesRoutes } from "../modules/roles/roles.routes";
import { CategoryRoutes } from "../modules/category/category.route";
import LaundryServiceRoutes from "../modules/laundryservice/laundryservice.routes";
import { LAttributeRoutes } from "../modules/luandryAttributes/luandryAttributes.routes";

const router = Router();

const moduleRoutes: {
  path: string;
  route: any;
}[] = [
  { path: "/auth", route: AuthRoutes },
  { path: "/user", route: UserRoutes },
  { path: "/roles", route: RolesRoutes },
  { path: "/category", route: CategoryRoutes },
  { path: "/laundryService", route: LaundryServiceRoutes },
  { path: "/laundryAttribute", route: LAttributeRoutes },
];

moduleRoutes.forEach((route) => {
  if (route.path === "/auth" || route.path === "/customer") {
    router.use(route.path, route.route);
  } else {
    router.use(route.path, validateAuth(), route.route);
  }
});

export default router;
