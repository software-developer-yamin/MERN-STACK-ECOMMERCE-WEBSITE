import errorHandler from "../utils/errorHander.js";

export default function (err, req, res, next) {
     err.statusCode = err.statusCode || 500;
     err.message = err.message || "Internal Server Error";

     // Wrong mongodb id error
     if (err.name === "CastError") {
          const message = `Resource not found. Invalid: ${err.path}`;
          err = new errorHandler(message, 400);
     };
     
     // Mongoose duplicate key error
     if (err.code === 11000) {
          const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
          err = new errorHandler(message, 400);
     };

     // Json Web Token Error
     if (err.code === "JsonWebTokenError") {
          const message = `Json Web Token is Invalid, try again`;
          err = new errorHandler(message, 400);
     };

     // Json Web Token Expired
     if (err.code === "JsonWebTokenError") {
          const message = `Json Web Token is Expired, try again`;
          err = new errorHandler(message, 400);
     };

     res.status(err.statusCode).json({
          success: false,
          message: err.message,
     });
 };