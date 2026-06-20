import { RowDataPacket } from "mysql2";
import { db } from "../../config/database";

interface CountRow extends RowDataPacket {
  total: number;
}

export class DashboardRepository {
  private async count(query: string): Promise<number> {
    const [rows] = await db.query<CountRow[]>(query);

    return rows[0].total;
  }

  async getAdminStats() {
    const [
      totalUsers,
      totalBooks,
      totalAvailableBooks,
      activeLoans,
      returnedLoans,
      lateLoans,
    ] = await Promise.all([
      this.count(`
        SELECT COUNT(*) AS total
        FROM users
        WHERE deleted_at IS NULL
      `),

      this.count(`
        SELECT COUNT(*) AS total
        FROM books
        WHERE deleted_at IS NULL
      `),

      this.count(`
        SELECT COALESCE(SUM(available_quantity), 0) AS total
        FROM books
        WHERE deleted_at IS NULL
      `),

      this.count(`
        SELECT COUNT(*) AS total
        FROM loans
        WHERE status = 'ACTIVE'
      `),

      this.count(`
        SELECT COUNT(*) AS total
        FROM loans
        WHERE status = 'RETURNED'
      `),

      this.count(`
        SELECT COUNT(*) AS total
        FROM loans
        WHERE status = 'LATE'
      `),
    ]);

    return {
      totalUsers,
      totalBooks,
      totalAvailableBooks,
      activeLoans,
      returnedLoans,
      lateLoans,
    };
  }
}
