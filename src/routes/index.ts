import { Router } from "express";
import { authRoutes } from "../modules/Auth/auth.route";

const router = Router();

const routerManger = [
  {
    path: "/auth",
    route: authRoutes,
  },
];

routerManger.forEach((r) => router.use(r.path, r.route));

export default router;
