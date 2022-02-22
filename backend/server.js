import { config } from 'dotenv';
import app from "./app.js";
import connectDatabase from './config/database.js';


// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
     console.log(`Error: ${err.message}`);
     console.log("Shutting down server due to Uncaught Exception");
     process.exit(1);
});

// Config
config();
connectDatabase();


const server = app.listen(process.env.PORT, () => {
     console.log(`server is listening on port ${process.env.PORT}`)
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
     console.log(`Error: ${err.message}`);
     console.log("Shutting down server due to Unhandled Promise Rejection");

     server.close(() => {
          process.exit(1);
     });
});