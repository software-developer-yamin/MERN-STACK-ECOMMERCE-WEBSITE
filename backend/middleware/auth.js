import ErrorHander from "../utils/errorHander.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";


export const isAuthenticated = catchAsyncErrors(
     async (req, res, next) => {
          const { token } = req.cookies;
          if (!token) return next(new ErrorHander("Please login to access this application"));
          const decodedData = jwt.verify(token, process.env.JWT_SECRET);
          req.user = await userModel.findById(decodedData.id);
          next();
     }
);

export const authorizeRoles = (...roles) => {
     return (req, res, next) => {
          if (!roles.includes(req.user.role)) {
               return next(new ErrorHander(`Role: ${req.user.role} is not allowed to access this application`, 403));
          };
          next();
     }
};