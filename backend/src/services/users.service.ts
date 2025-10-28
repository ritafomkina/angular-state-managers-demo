import db from "@database/database";
import {
  User,
  UserRow,
  PaginatedResponse,
  QueryParams,
  UsersSummary,
  UserStatusEnum,
} from "@app-types/index";

export class UsersService {
  private rowToUser(row: UserRow): User {
    return {
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      firstName: row.firstName,
      lastName: row.lastName,
      dateOfBirth: row.dateOfBirth,
      position: row.position,
      photo: row.photo,
      startDate: row.startDate,
      status: row.status as UserStatusEnum,
      contacts: {
        email: row.email,
        phone: row.phone,
      },
      location: row.location as any,
      project: row.projectId
        ? {
            id: row.projectId,
            title: row.projectTitle,
          }
        : null,
    };
  }

  getAll(params: QueryParams): PaginatedResponse<User> {
    const { filter, sort, current = 1, size = 10 } = params;

    let query = "SELECT * FROM users WHERE 1=1";
    const queryParams: any[] = [];

    // Apply filters
    if (filter && filter !== "total") {
      query += " AND status = ?";
      queryParams.push(filter);
    }

    // Apply sorting
    if (sort) {
      const isDesc = sort.startsWith("-");
      const field = isDesc ? sort.substring(1) : sort;
      const direction = isDesc ? "DESC" : "ASC";
      query += ` ORDER BY ${field} ${direction}`;
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

    const rows = db.prepare(query).all(...queryParams) as UserRow[];
    const users = rows.map((row) => this.rowToUser(row));

    return {
      results: users,
      page: {
        size,
        total,
        current,
      },
    };
  }

  getById(id: number): User | null {
    const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as
      | UserRow
      | undefined;
    return row ? this.rowToUser(row) : null;
  }

  create(data: Partial<User>): User {
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO users (
        createdAt, updatedAt, firstName, lastName, dateOfBirth,
        position, photo, startDate, status, email, phone, location,
        projectId, projectTitle
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      now,
      now,
      data.firstName || null,
      data.lastName || null,
      data.dateOfBirth || null,
      data.position || null,
      data.photo || null,
      data.startDate || null,
      data.status || UserStatusEnum.Works, // Default to 'works' if not provided
      data.contacts?.email || null,
      data.contacts?.phone || null,
      data.location || null,
      data.project?.id || null,
      data.project?.title || null
    );

    return this.getById(result.lastInsertRowid as number)!;
  }

  update(id: number, data: Partial<User>): User | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const now = new Date().toISOString();

    const fields: string[] = [];
    const values: any[] = [];

    if (data.firstName !== undefined) {
      fields.push("firstName = ?");
      values.push(data.firstName);
    }
    if (data.lastName !== undefined) {
      fields.push("lastName = ?");
      values.push(data.lastName);
    }
    if (data.dateOfBirth !== undefined) {
      fields.push("dateOfBirth = ?");
      values.push(data.dateOfBirth);
    }
    if (data.position !== undefined) {
      fields.push("position = ?");
      values.push(data.position);
    }
    if (data.photo !== undefined) {
      fields.push("photo = ?");
      values.push(data.photo);
    }
    if (data.startDate !== undefined) {
      fields.push("startDate = ?");
      values.push(data.startDate);
    }
    if (data.status !== undefined) {
      fields.push("status = ?");
      values.push(data.status);
    }
    if (data.contacts?.email !== undefined) {
      fields.push("email = ?");
      values.push(data.contacts.email);
    }
    if (data.contacts?.phone !== undefined) {
      fields.push("phone = ?");
      values.push(data.contacts.phone);
    }
    if (data.location !== undefined) {
      fields.push("location = ?");
      values.push(data.location);
    }
    if (data.project !== undefined) {
      if (data.project === null) {
        fields.push("projectId = ?");
        values.push(null);
        fields.push("projectTitle = ?");
        values.push(null);
      } else {
        if (data.project.id !== undefined) {
          fields.push("projectId = ?");
          values.push(data.project.id);
        }
        if (data.project.title !== undefined) {
          fields.push("projectTitle = ?");
          values.push(data.project.title);
        }
      }
    }

    fields.push("updatedAt = ?");
    values.push(now);

    values.push(id);

    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    db.prepare(query).run(...values);

    return this.getById(id);
  }

  delete(id: number): boolean {
    const result = db.prepare("DELETE FROM users WHERE id = ?").run(id);
    return result.changes > 0;
  }

  getSummary(): UsersSummary {
    const total = (
      db.prepare("SELECT COUNT(*) as count FROM users").get() as {
        count: number;
      }
    ).count;
    const works = (
      db
        .prepare("SELECT COUNT(*) as count FROM users WHERE status = ?")
        .get("works") as { count: number }
    ).count;
    const vacation = (
      db
        .prepare("SELECT COUNT(*) as count FROM users WHERE status = ?")
        .get("vacation") as { count: number }
    ).count;
    const sick = (
      db
        .prepare("SELECT COUNT(*) as count FROM users WHERE status = ?")
        .get("sick") as { count: number }
    ).count;
    const dayOff = (
      db
        .prepare("SELECT COUNT(*) as count FROM users WHERE status = ?")
        .get("dayOff") as { count: number }
    ).count;

    return {
      total,
      works,
      vacation,
      sick,
      dayOff,
    };
  }
}

export default new UsersService();
