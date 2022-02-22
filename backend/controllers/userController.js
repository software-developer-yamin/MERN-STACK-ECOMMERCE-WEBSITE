import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import userModel from "../models/userModel.js";
import ErrorHander from "../utils/errorHander.js";
import sendToken from "../utils/jwtToken.js";
import sendEmail from "../utils/sendEmail.js";

// register user
export const registerUser = catchAsyncErrors(
     async (req, res) => {
          const { name, email, password } = req.body;
          const user = await userModel.create({
               name, email, password,
               avatar: {
                    public_id: "public_id",
                    url: "url"
               }
          });

          sendToken(user, 200, res);
     }
);
export const loginUser = catchAsyncErrors(
     async (req, res, next) => {
          const { email, password } = req.body;

          // check if user has given email and password both
          if (!email || !password) return next(new ErrorHander("Please enter email and password", 400));

          const user = await userModel.findOne({ email }).select("+password");

          if (!user) return next(new ErrorHander("Invalid email or password", 401));

          const isPasswordMatched = await user.comparePassword(password);

          if (!isPasswordMatched) return next(new ErrorHander("Invalid email or password", 401));

          sendToken(user, 200, res);
     }
);

export const logoutUser = catchAsyncErrors(
     async (req, res, next) => {
          res.cookie("token", null, {
               expires: new Date(Date.now()),
               httpOnly: true,
          });
          res.status(200).json({
               success: true,
               message: "Logout successful",
          });
     }
);

export const forgetPassword = catchAsyncErrors(
     async (req, res, next) => {
          const user = await userModel.findOne({ email: req.body.email });
          if (!user) return next(new ErrorHander("User not found", 404));
          // Get reset password token
          const resetToken = user.getResetPasswordToken();
          await user.save({ validateByforeSave: false });
          const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
          const message = `Your reset password token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it.`;

          try {
               await sendEmail({
                    email: user.email,
                    subject: `Ecommerce Password Recovery`,
                    message,
               });
               res.status(200).json({
                    success: true,
                    message: `Email send to ${user.email} successfully`
               });
          } catch (err) {
               user.resetPasswordToken = undefined;
               user.resetPasswordExpire = undefined;
               await user.save({ validateByforeSave: false });
               return next(new ErrorHander(err.message, 500));
          };
     }
);

export const resetPassword = catchAsyncErrors(
     async (req, res, next) => {
          const resetPassword = crypto.createHash("sha256").update(req.params.token).digest("hex");
          const user = await userModel.find({
               resetPasswordToken,
               resetPasswordExpire: { $gt: Date.now() }
          });

          if (!user) return next(new ErrorHander("Reset Password token Failed", 404));
          
          if (req.body.password !== req.body.confirmPassword) return next(new ErrorHander("Password does not match", 404));

          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;

          await save();
          sendToken(user, 200, res);
     }
);

// Get user details
export const getUserDetails = catchAsyncErrors(
     async (req, res, next) => {
          const user = await userModel.findById(req.user.id);

          res.status(200).json({
               success: true,
               user,
          });
     }
);