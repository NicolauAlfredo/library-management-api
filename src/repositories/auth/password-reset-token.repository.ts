import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/database";

interface PasswordResetTokenRow extends RowDataPacket {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
  used_at: Date | null;
  created_at: Date;
}

export class PasswordResetTokenRepository {
  async create(userId: number, token: string, expiresAt: Date): Promise<void> {
    await db.query<ResultSetHeader>(
      `
      INSERT INTO password_reset_tokens (user_id, token, expires_at)
      VALUES (?, ?, ?)
      `,
      [userId, token, expiresAt],
    );
  }

  async findValidToken(token: string): Promise<PasswordResetTokenRow | null> {
    const [rows] = await db.query<PasswordResetTokenRow[]>(
      `
      SELECT *
      FROM password_reset_tokens
      WHERE token = ?
        AND used_at IS NULL
        AND expires_at > NOW()
      LIMIT 1
      `,
      [token],
    );

    return rows[0] ?? null;
  }

  async markAsUsed(id: number): Promise<void> {
    await db.query(
      `
      UPDATE password_reset_tokens
      SET used_at = NOW()
      WHERE id = ?
      `,
      [id],
    );
  }

  async invalidateUserTokens(userId: number): Promise<void> {
    await db.query(
      `
      UPDATE password_reset_tokens
      SET used_at = NOW()
      WHERE user_id = ?
        AND used_at IS NULL
      `,
      [userId],
    );
  }
}
