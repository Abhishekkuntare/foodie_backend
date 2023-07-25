import ErrorHandler from "../utils/ErrorHandler.js";
import { asyncError } from "./errorMiddleware.js";
import jwt from "jsonwebtoken";
import { LoginRegisterUser } from "../models/LoginRegister.js";

export const isAuthenticated = asyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) return next(new ErrorHandler("Not logged In !", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await LoginRegisterUser.findById(decoded._id);

  next();
});

export const authorizedAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return next(
      new ErrorHandler(
        `${req.user.role} is not allowed to access the resource`,
        403
      )
    );
  next();
};
