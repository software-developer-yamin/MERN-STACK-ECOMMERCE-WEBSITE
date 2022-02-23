import { Router } from "express";
import { forgotPassword, loginUser, logout, registerUser, resetPassword, getUserDetails } from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/auth.js"

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forget").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated, getUserDetails);

export default router;