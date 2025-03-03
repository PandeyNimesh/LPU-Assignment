import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDb from "./db/connection.js";
import bodyParser from "body-parser";

// Load environment variables
dotenv.config({ path: "./.env" });

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173','https://lpu-assignment.vercel.app/'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'Authorization'],
  })
);
// Handle OPTIONS preflight requests
app.options('*', cors());

// Connect to the database
connectDb().then(() => {
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`App is running on PORT: ${port}`);
  });
}).catch(() => {
  console.log("DB not connected!");
});

// Middleware
app.use(express.json({ limit: "16mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16mb" }));
app.use(bodyParser.json({ limit: "16mb" }));

//Import user router
import { router } from "./routes/user.routes.js";
app.use("api/v1/users", router);

// Import hospital router
import hospitalRouter from "./routes/hospital.routes.js";
app.use("api/v1/hospitals", hospitalRouter);