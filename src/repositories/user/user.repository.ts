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
  deleted_at: Date | null;
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

interface FindAllUsersParams {
  page: number;
  limit: number;
  search?: string;
  role?: Role;
}

interface FindAllUsersResult {
  users: User[];
  total: number;
}

export class UserRepository {
  async findAll(params: FindAllUsersParams): Promise<FindAllUsersResult> {
    const { page, limit, search, role } = params;

    const offset = (page - 1) * limit;

    const conditions: string[] = ["deleted_at IS NULL"];
    const values: unknown[] = [];

    if (search) {
      conditions.push("(name LIKE ? OR email LIKE ?)");

      const searchValue = `%${search}%`;

      values.push(searchValue, searchValue);
    }

    if (role) {
      conditions.push("role = ?");
      values.push(role);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [rows] = await db.query<UserRow[]>(
      `
    SELECT *
    FROM users
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
    `,
      [...values, limit, offset],
    );

    const [countRows] = await db.query<RowDataPacket[]>(
      `
    SELECT COUNT(*) AS total
    FROM users
    ${whereClause}
    `,
      values,
    );

    return {
      users: rows.map((user) => this.mapToUser(user)),
      total: countRows[0].total,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await db.query<UserRow[]>(
      `
    SELECT *
    FROM users
    WHERE email = ?
      AND deleted_at IS NULL
    LIMIT 1
    `,
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
      `
    SELECT *
    FROM users
    WHERE id = ?
      AND deleted_at IS NULL
    LIMIT 1
    `,
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
      UPDATE users  SET name = ?, email = ?, role = ? WHERE id = ? AND deleted_at IS NULL
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
      `
      UPDATE users  SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL
      `,
      [id],
    );

    return result.affectedRows > 0;
  }

  async updatePassword(id: number, hashedPassword: string): Promise<void> {
    await db.query(
      `
    UPDATE users
    SET password = ?
    WHERE id = ?
      AND deleted_at IS NULL
    `,
      [hashedPassword, id],
    );
  }

  async hasActiveLoans(userId: number): Promise<boolean> {
    const [rows] = await db.query<RowDataPacket[]>(
      `
      SELECT id  FROM loans  WHERE user_id = ?   AND status = 'ACTIVE'  LIMIT 1
      `,
      [userId],
    );

    return rows.length > 0;
  }

  private mapToUser(row: UserRow): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      password: row.password,
      role: row.role,
      deletedAt: row.deleted_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
