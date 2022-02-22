import express, { json } from 'express';
import errorMiddleware from './middleware/errorMiddleware.js';
import product from './routes/productRoute.js';
import user from './routes/userRoute.js';
import cookieParser from "cookie-parser";


const app = express();
app.use(json());
app.use(cookieParser());

app.use("/api/v1", product);
app.use("/api/v1", user);

// Middleware for error
app.use(errorMiddleware);

export default app;


