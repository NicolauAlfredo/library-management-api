import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth/authRoutes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

/* Home Route */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Library Management API is running",
  });
});

/* Auth Route */
app.use("/auth", authRoutes);

export default app;
