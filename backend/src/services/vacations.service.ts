import db from "@database/database";
import {
  Vacation,
  VacationRow,
  PaginatedResponse,
  QueryParams,
  VacationStatusEnum,
  VacationTypeEnum,
  VacationsSummary,
} from "@app-types/index";

export class VacationsService {
  private rowToVacation(row: VacationRow): Vacation {
    // Fetch user photo from users table since it's not stored in vacations table
    let userPhoto: string = "";
    if (row.userId) {
      const user = db
        .prepare("SELECT photo FROM users WHERE id = ?")
        .get(row.userId) as { photo: string | null } | undefined;
      userPhoto = user?.photo || "";
    }

    return {
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      user: {
        id: row.userId,
        firstName: row.userFirstName,
        lastName: row.userLastName,
        photo: userPhoto,
      },
      type: row.type as VacationTypeEnum,
      status: row.status as VacationStatusEnum,
      daysAvailable: row.daysAvailable,
      daysRequested: row.daysRequested,
      startDate: row.startDate,
      endDate: row.endDate,
    };
  }

  getAll(params: QueryParams): PaginatedResponse<Vacation> {
    const { sort, current = 1, size = 10, filter } = params;

    let query = "SELECT * FROM vacations WHERE 1=1";
    const queryParams: any[] = [];

    // Apply filter by vacation type
    if (filter && filter !== "total") {
      query += " AND type = ?";
      queryParams.push(filter);
    }

    // Apply sorting
    if (sort) {
      const isDesc = sort.startsWith("-");
      const field = isDesc ? sort.substring(1) : sort;
      const direction = isDesc ? "DESC" : "ASC";

      // Map firstName to userFirstName for sorting
      if (field === "firstName") {
        query += ` ORDER BY userFirstName ${direction}`;
      } else {
        query += ` ORDER BY ${field} ${direction}`;
      }
    }

    // Get total count
    const countQuery = query.replace("SELECT *", "SELECT COUNT(*) as count");
    const countResult = db.prepare(countQuery).get(...queryParams) as {
      count: number;
    };
    const total = countResult.count;

    // Apply pagination
    const offset = (current - 1) * size;
    query += " LIMIT ? OFFSET ?";
    queryParams.push(size, offset);

    const rows = db.prepare(query).all(...queryParams) as VacationRow[];
    const vacations = rows.map((row) => this.rowToVacation(row));

    return {
      results: vacations,
      page: {
        size,
        total,
        current,
      },
    };
  }

  getById(id: number): Vacation | null {
    const row = db.prepare("SELECT * FROM vacations WHERE id = ?").get(id) as
      | VacationRow
      | undefined;
    return row ? this.rowToVacation(row) : null;
  }

  create(data: any): Vacation {
    const now = new Date().toISOString();
    const userId = data.userId || data.user?.id || null;

    // Fetch user data if userId is provided
    let userFirstName: string | null = null;
    let userLastName: string | null = null;

    if (userId) {
      const user = db
        .prepare("SELECT firstName, lastName FROM users WHERE id = ?")
        .get(userId) as { firstName: string; lastName: string } | undefined;

      if (user) {
        userFirstName = user.firstName;
        userLastName = user.lastName;
      }
    }

    // Validate and set status (default to Request for new vacations)
    const validStatuses = Object.values(VacationStatusEnum);
    let status: VacationStatusEnum;

    if (
      data.status &&
      validStatuses.includes(data.status as VacationStatusEnum)
    ) {
      status = data.status as VacationStatusEnum;
    } else if (!data.status) {
      status = VacationStatusEnum.Request;
    } else {
      throw new Error(
        `Invalid status: ${data.status}. Valid values are: ${validStatuses.join(
          ", "
        )}`
      );
    }

    const stmt = db.prepare(`
      INSERT INTO vacations (
        createdAt, updatedAt, userId, userFirstName, userLastName,
        type, status, daysAvailable, daysRequested,
        startDate, endDate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      now,
      now,
      userId,
      userFirstName,
      userLastName,
      data.type || null,
      status,
      data.daysAvailable ?? null,
      data.daysRequested ?? null,
      data.startDate || null,
      data.endDate || null
    );

    return this.getById(result.lastInsertRowid as number)!;
  }

  update(id: number, data: any): Vacation | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const now = new Date().toISOString();

    const fields: string[] = [];
    const values: any[] = [];

    if (data.userId !== undefined) {
      fields.push("userId = ?");
      values.push(data.userId);
    }
    if (data.userFirstName !== undefined) {
      fields.push("userFirstName = ?");
      values.push(data.userFirstName);
    }
    if (data.userLastName !== undefined) {
      fields.push("userLastName = ?");
      values.push(data.userLastName);
    }
    if (data.type !== undefined) {
      fields.push("type = ?");
      values.push(data.type);
    }
    if (data.status !== undefined) {
      // Validate status is a valid VacationStatusEnum value
      const validStatuses = Object.values(VacationStatusEnum);
      if (!validStatuses.includes(data.status as VacationStatusEnum)) {
        throw new Error(
          `Invalid status: ${
            data.status
          }. Valid values are: ${validStatuses.join(", ")}`
        );
      }
      fields.push("status = ?");
      values.push(data.status as VacationStatusEnum);
    }
    if (data.daysAvailable !== undefined) {
      fields.push("daysAvailable = ?");
      values.push(data.daysAvailable);
    }
    if (data.daysRequested !== undefined) {
      fields.push("daysRequested = ?");
      values.push(data.daysRequested);
    }
    if (data.startDate !== undefined) {
      fields.push("startDate = ?");
      values.push(data.startDate);
    }
    if (data.endDate !== undefined) {
      fields.push("endDate = ?");
      values.push(data.endDate);
    }

    fields.push("updatedAt = ?");
    values.push(now);

    values.push(id);

    const query = `UPDATE vacations SET ${fields.join(", ")} WHERE id = ?`;
    db.prepare(query).run(...values);

    return this.getById(id);
  }

  delete(id: number): boolean {
    const result = db.prepare("DELETE FROM vacations WHERE id = ?").run(id);
    return result.changes > 0;
  }

  getSummary(): VacationsSummary {
    // Get total count
    const totalResult = db
      .prepare("SELECT COUNT(*) as count FROM vacations")
      .get() as { count: number };
    const total = totalResult.count;

    // Get count by type
    const sickLeaveResult = db
      .prepare("SELECT COUNT(*) as count FROM vacations WHERE type = ?")
      .get(VacationTypeEnum.SickLeave) as { count: number };
    const dayOffResult = db
      .prepare("SELECT COUNT(*) as count FROM vacations WHERE type = ?")
      .get(VacationTypeEnum.DayOff) as { count: number };
    const vacationResult = db
      .prepare("SELECT COUNT(*) as count FROM vacations WHERE type = ?")
      .get(VacationTypeEnum.Vacation) as { count: number };

    return {
      total,
      sickLeave: sickLeaveResult.count,
      dayOff: dayOffResult.count,
      vacation: vacationResult.count,
    };
  }
}

export default new VacationsService();
