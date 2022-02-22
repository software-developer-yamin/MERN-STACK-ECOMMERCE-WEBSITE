import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import pkg from 'mongoose';
import pkgV from 'validator';
const { Schema, model } = pkg;
const { isEmail } = pkgV;


const userSchema = new Schema({
     name: {
          type: String,
          required: [true, "Please Enter Your Name"],
          maxLength: [30, "Name cannot exceed 30 characters"],
          minLength: [4, "Name should have more than 4 characters"],
     },
     email: {
          type: String,
          required: [true, "Please Enter Your Email"],
          unique: true,
          validate: [isEmail, "Please Enter a valid Email"],
     },
     password: {
          type: String,
          required: [true, "Please Enter Your Password"],
          minLength: [8, "Password should be greater than 8 characters"],
          select: false,
     },
     avatar: {
          public_id: {
               type: String,
               required: true,
          },
          url: {
               type: String,
               required: true,
          },
     },
     role: {
          type: String,
          default: "user",
     },
     createdAt: {
          type: Date,
          default: Date.now,
     },

     resetPasswordToken: String,
     resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
     if (!this.isModified("password")) {
          next();
     }
     this.password = await bcrypt.hash(this.password, 12);
});

// JWT Token
userSchema.methods.getJWTtoken = function () {
     return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES,
     });
};

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
     return await bcrypt.compare(enteredPassword, this.password);
};

// Generating reset password token
userSchema.methods.getResetPasswordToken = function () {
     // Generating token
     const resetToken = crypto.randomBytes(20).toString("hex");
     // Hashing and adding reset token to user schema
     this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
     this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

     return resetToken;
};


export default model("User", userSchema);