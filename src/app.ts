import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth/authRoutes";
import bookRoutes from "./routes/book/bookRoutes";
import loanRoutes from "./routes/loan/loanRoutes";
import userRoutes from "./routes/user/userRoutes";
import { swaggerDocument } from "./config/swagger";
import swaggerUi from "swagger-ui-express";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Auth Route
app.use("/auth", authRoutes);

// Book Route
app.use("/books", bookRoutes);

// Loan
app.use("/loans", loanRoutes);

// User
app.use("/users", userRoutes);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Library Management API is running",
  });
});

export default app;
