import { asyncError } from "../middlewares/errorMiddleware.js";
import { LoginRegisterUser } from "../models/LoginRegister.js";
import { sendToken } from "../utils/sendToken.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";

export const register = asyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const file = req.file;

  if (!name || !email || !password || !file)
    return next(new ErrorHandler("Please enter all fields", 400));

  let user = await LoginRegisterUser.findOne({ email });
  if (user) return next(new ErrorHandler("User already exits", 404));

  const fileUri = getDataUri(file);
  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  user = await LoginRegisterUser.create({
    name,
    email,
    password,
    avatar: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  });

  sendToken(res, user, "Registered Successfully", 201);
});

export const login = asyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  const user = await LoginRegisterUser.findOne({ email }).select("+password");

  if (!user) return next(new ErrorHandler("User Doesn't Exist", 401));

  const isMatch = await user.comparePassword(password);

  if (!isMatch) return next(new ErrorHandler("Incorrect Credintials", 401));

  sendToken(res, user, `Welcome back ${user.name}`, 200);
});

export const logout = asyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message: "Logout successfully",
    });
});

export const getMyProfile = asyncError(async (req, res, next) => {
  const user = await LoginRegisterUser.findById(req.user._id);
  res.status(200).json({
    status: true,
    user,
  });
});

export const changePassword = asyncError(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return next(new ErrorHandler("Please enter all fields !", 400));

  const user = await LoginRegisterUser.findById(req.user._id).select(
    "+password"
  );

  const isMatch = await user.comparePassword(oldPassword);

  if (!isMatch) return next(new ErrorHandler("Incorrect old password", 400));
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status: true,
    message: "password change successfully",
  });
});

export const updateProfile = asyncError(async (req, res, next) => {
  const { name, email } = req.body;

  const user = await LoginRegisterUser.findById(req.user._id);

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();

  res.status(200).json({
    status: true,
    message: "Profile updated successfully",
  });
});

export const updateProfilePicture = asyncError(async (req, res, next) => {
  const file = req.file;
  const user = await LoginRegisterUser.findById(req.user._id);

  const fileUri = getDataUri(file); // convert file format to link format
  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  await cloudinary.v2.uploader.destroy(user.avatar.public_id);

  user.avatar = {
    public_id: mycloud.public_id,
    url: mycloud.secure_url,
  };

  await user.save();

  res.status(200).json({
    status: true,
    message: "Profile picture updated succssfully",
  });
});

export const forgotPassword = asyncError(async (req, res, next) => {
  const { email } = req.body;

  const user = await LoginRegisterUser.findOne({ email });

  if (!user) return next(new ErrorHandler("User not found !", 400));

  const resetToken = await user.getResetToken();

  await user.save();

  const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  const message = `Click on the link to reset your password. ${url}. If you have not requested then please ignore`;

  //send token via token
  sendEmail(user.email, "Made by me reset password", message);

  res.status(200).json({
    status: true,
    message: `reset token send to ${user.email}`,
  });
});

export const resetPassword = asyncError(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });
  if (!user)
    return next(new ErrorHandler("Token is invalid   or has been expired "));

  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  res.status(200).json({
    status: true,
    message: "password change successfully",
    token,
  });
});

export const deleteMyProfile = asyncError(async (req, res, next) => {
  const user = await LoginRegisterUser.findById(req.user._id);
  await cloudinary.v2.uploader.destroy(user.avatar.public_id);

  await user.remove();
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .json({ success: true, message: "User Deleted it's Profile" });
});
