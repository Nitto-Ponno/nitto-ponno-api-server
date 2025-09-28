import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import validateAuth from "../middleware/auth";
import { UserRoutes } from "../modules/user/user.routes";

const router = Router();

const moduleRoutes: {
  path: string;
  route: any;
}[] = [
  { path: "/auth", route: AuthRoutes },
  { path: "/user", route: UserRoutes },
];

moduleRoutes.forEach((route) => {
  if (route.path === "/auth" || route.path === "/customer") {
    router.use(route.path, route.route);
  } else {
    router.use(route.path, validateAuth(), route.route);
  }
});

export default router;
