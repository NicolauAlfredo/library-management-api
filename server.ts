import dotenv from "dotenv";
import app from "./src/app";
import { connectDB } from "./src/config/database";

dotenv.config();

const PORT = process.env.PORT || 8000;

async function startServer(): Promise<void> {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
