import { Router } from "express";

const router = Router();

const moduleRoutes: {
  path: string;
  route: any;
}[] = [
  //   { path: "/product-details-category", route: ProductDetailsCategoryRoutes },
];

moduleRoutes.forEach((route) => {
  //   if (route.path === "/auth" || route.path === "/customer") {
  //     router.use(route.path, route.route);
  //   } else {
  //     router.use(route.path, validateAut(), route.route);
  // }
  router.use(route.path, route.route);
});

export default router;
