"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = require("../modules/auth/auth.routes");
const auth_1 = __importDefault(require("../middleware/auth"));
const user_routes_1 = require("../modules/user/user.routes");
const roles_routes_1 = require("../modules/roles/roles.routes");
const category_route_1 = require("../modules/category/category.route");
const laundryservice_routes_1 = __importDefault(require("../modules/laundryservice/laundryservice.routes"));
const luandryAttributes_routes_1 = require("../modules/luandryAttributes/luandryAttributes.routes");
const luandryProduct_routes_1 = require("../modules/laundryProduct/luandryProduct.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    { path: "/auth", route: auth_routes_1.AuthRoutes },
    { path: "/user", route: user_routes_1.UserRoutes },
    { path: "/roles", route: roles_routes_1.RolesRoutes },
    { path: "/category", route: category_route_1.CategoryRoutes },
    { path: "/laundryService", route: laundryservice_routes_1.default },
    { path: "/laundryAttribute", route: luandryAttributes_routes_1.LAttributeRoutes },
    { path: "/laundryProduct", route: luandryProduct_routes_1.ProductRoutes },
];
moduleRoutes.forEach((route) => {
    if (route.path === "/auth" || route.path === "/customer") {
        router.use(route.path, route.route);
    }
    else {
        router.use(route.path, (0, auth_1.default)(), route.route);
    }
});
exports.default = router;
