import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import staff from "./routes/staff.route.js";
import student from "./routes/student.route.js";
import maintenance from "./routes/maintenance.route.js";

await connectDB();
const app = express();

app.use(cors({ origin: "http://localhost:8080", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/staff", staff);
app.use("/api/student", student);
app.use("/api/maintenance", maintenance);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
