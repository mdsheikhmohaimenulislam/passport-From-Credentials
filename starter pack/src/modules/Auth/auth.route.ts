import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import passport from "passport";

const router = Router();

router.post("/register", AuthControllers.register);
router.post("/login", AuthControllers.credentialsLogin);

router.get("/google", passport.authenticate("google", { scope: ["profile","email"] }));
router.get("/google/callback", AuthControllers.googleCallback);

router.post("/logout", AuthControllers.logOut);

export const authRoutes = router;
