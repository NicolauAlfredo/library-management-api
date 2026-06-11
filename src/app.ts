import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth/authRoutes";
import bookRoutes from "./routes/book/bookRoutes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Auth Route
app.use("/auth", authRoutes);

// Book Route
app.use("/books", bookRoutes);

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Library Management API is running",
  });
});

export default app;
