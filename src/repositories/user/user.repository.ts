import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/database";
import { User } from "../../models/user/userModel";
import { Role } from "../../types/role";
import { AppError } from "../../errors/app-errors";

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  role?: Role;
}

export class UserRepository {
  async findAll(): Promise<User[]> {
    const [rows] = await db.query<UserRow[]>(
      "SELECT * FROM users ORDER BY created_at DESC",
    );

    return rows.map((user) => this.mapToUser(user));
  }

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await db.query<UserRow[]>(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email],
    );

    const user = rows[0];

    if (!user) {
      return null;
    }

    return this.mapToUser(user);
  }

  async findById(id: number): Promise<User | null> {
    const [rows] = await db.query<UserRow[]>(
      "SELECT * FROM users WHERE id = ? LIMIT 1",
      [id],
    );

    const user = rows[0];

    if (!user) {
      return null;
    }

    return this.mapToUser(user);
  }

  async create(data: CreateUserData): Promise<User> {
    const [result] = await db.query<ResultSetHeader>(
      `
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
      `,
      [data.name, data.email, data.password, data.role ?? Role.USER],
    );

    const createdUser = await this.findById(result.insertId);

    if (!createdUser) {
      throw new AppError("User could not be created", 500);
    }

    return createdUser;
  }

  async update(id: number, data: UpdateUserData): Promise<User | null> {
    const currentUser = await this.findById(id);

    if (!currentUser) {
      return null;
    }

    await db.query(
      `
    UPDATE users
    SET name = ?, email = ?, role = ?
    WHERE id = ?
    `,
      [
        data.name ?? currentUser.name,
        data.email ?? currentUser.email,
        data.role ?? currentUser.role,
        id,
      ],
    );

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM users WHERE id = ?",
      [id],
    );

    return result.affectedRows > 0;
  }

  private mapToUser(row: UserRow): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      password: row.password,
      role: row.role,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
