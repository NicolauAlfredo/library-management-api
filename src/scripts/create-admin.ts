import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { db } from "../config/database";
import { Role } from "../types/role";

dotenv.config();

async function createAdmin(): Promise<void> {
  try {
    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!name || !email || !password) {
      throw new Error(
        "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must be defined",
      );
    }

    const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    if (Array.isArray(rows) && rows.length > 0) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
      `,
      [name, email, hashedPassword, Role.ADMIN],
    );

    console.log("Admin created successfully");
    console.log("Email:", email);

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  }
}

createAdmin();
