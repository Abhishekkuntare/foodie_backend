import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";
import {
  changePassword,
  deleteMyProfile,
  forgotPassword,
  getMyProfile,
  login,
  logout,
  register,
  resetPassword,
  updateProfile,
  updateProfilePicture,
} from "../controllers/loginRegister.js";

const router = express.Router();

//register
router.route("/userregister").post(singleUpload, register);

//login
router.route("/userlogin").post(login);

// logout
router.route("/userlogout").get(logout);

// get my profile
router.route("/me").get(isAuthenticated, getMyProfile);

// delete  my profile
router.route("/me").delete(isAuthenticated, deleteMyProfile);

// change password
router.route("/changepassword").put(isAuthenticated, changePassword);

// update profile
router.route("/updateprofile").put(isAuthenticated, updateProfile);

//update profile picture
router
  .route("/updateprofilepicture")
  .put(singleUpload, isAuthenticated, updateProfilePicture);

//forget password
router.route("/forgetpassword").post(forgotPassword);

//reset password
router.route("/resetpassword/:token").put(resetPassword);

export default router;
