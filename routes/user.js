import express from "express";
import passport from "passport";
import {
  getAdminStats,
  getAllUsers,
  logout,
  myProfile,
} from "../controllers/user.js";
import { authorizedAdmin, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get(
  "/googlelogin",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

router.get("/login", passport.authenticate("google"), {
  successRedirect: process.env.FRONTEND_URL,
});

router.get("/me", isAuthenticated, myProfile);

router.get("/logout", logout);

//Admin Routes
router.get("/admin/users", isAuthenticated, authorizedAdmin, getAllUsers);

router.get("/admin/stats", isAuthenticated, authorizedAdmin, getAdminStats);

export default router;
