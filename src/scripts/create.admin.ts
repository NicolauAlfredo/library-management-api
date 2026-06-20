import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import fs from "fs";
import path from "path";

import { db } from "../config/database";
import { Role } from "../types/role";

dotenv.config();

function generateAdminCredentials() {
  const uniqueId = crypto.randomBytes(4).toString("hex");

  return {
    name: `Library Admin ${uniqueId}`,
    email: `admin.${uniqueId}@library.com`,
    password: crypto.randomBytes(8).toString("hex"),
  };
}

async function createAdmin(): Promise<void> {
  try {
    const credentials = generateAdminCredentials();

    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    await db.query(
      `
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
      `,
      [credentials.name, credentials.email, hashedPassword, Role.ADMIN],
    );

    const fileContent = ` 
    Admin created successfully
    Name: ${credentials.name}
    Email: ${credentials.email}
    Password: ${credentials.password}`;

    const filePath = path.join(process.cwd(), "generatedAdmin.txt");

    fs.writeFileSync(filePath, fileContent.trim());

    console.log("\nAdmin created successfully\n");
    console.log(`Credentials saved to: ${filePath}`);

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  }
}

createAdmin();
