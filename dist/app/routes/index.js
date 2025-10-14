"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const moduleRoutes = [
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
exports.default = router;
