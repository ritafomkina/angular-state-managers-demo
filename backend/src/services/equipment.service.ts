import db from "@database/database";
import {
  Equipment,
  EquipmentRow,
  PaginatedResponse,
  QueryParams,
  EquipmentSummary,
  EquipmentStatusEnum,
} from "@app-types/index";

export class EquipmentService {
  private rowToEquipment(row: EquipmentRow): Equipment {
    // Fetch owner data if ownerId exists but firstName/lastName are missing
    let ownerFirstName: string | null = row.ownerFirstName;
    let ownerLastName: string | null = row.ownerLastName;

    if (row.ownerId && (!ownerFirstName || !ownerLastName)) {
      const user = db
        .prepare("SELECT firstName, lastName FROM users WHERE id = ?")
        .get(row.ownerId) as
        | { firstName: string; lastName: string }
        | undefined;

      if (user) {
        ownerFirstName = user.firstName;
        ownerLastName = user.lastName;

        // Update the database row to cache the fetched values
        const now = new Date().toISOString();
        db.prepare(
          "UPDATE equipment SET ownerFirstName = ?, ownerLastName = ?, updatedAt = ? WHERE id = ?"
        ).run(ownerFirstName, ownerLastName, now, row.id);
      }
    }

    return {
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      title: row.title,
      owner: row.ownerId
        ? {
            id: row.ownerId,
            firstName: ownerFirstName || "",
            lastName: ownerLastName || "",
          }
        : null,
      description: row.description,
      receiptTimestamp: row.receiptTimestamp,
      wasUsed: row.wasUsed === 1,
      hasDefect: row.hasDefect === 1,
      imageUrl: row.imageUrl,
      status: row.status as EquipmentStatusEnum,
    };
  }

  getAll(params: QueryParams): PaginatedResponse<Equipment> {
    const { filter, current = 1, size = 10 } = params;

    let query = "SELECT * FROM equipment WHERE 1=1";
    const queryParams: any[] = [];

    // Apply filters
    if (filter && filter !== "total") {
      query += " AND status = ?";
      queryParams.push(filter);
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

    const rows = db.prepare(query).all(...queryParams) as EquipmentRow[];
    const equipment = rows.map((row) => this.rowToEquipment(row));

    return {
      results: equipment,
      page: {
        size,
        total,
        current,
      },
    };
  }

  getById(id: number): Equipment | null {
    const row = db.prepare("SELECT * FROM equipment WHERE id = ?").get(id) as
      | EquipmentRow
      | undefined;
    return row ? this.rowToEquipment(row) : null;
  }

  create(data: any): Equipment {
    const now = new Date().toISOString();

    // Validate and set status (default to Available for new equipment)
    const validStatuses = Object.values(EquipmentStatusEnum);
    let status: EquipmentStatusEnum;

    if (
      data.status &&
      validStatuses.includes(data.status as EquipmentStatusEnum)
    ) {
      status = data.status as EquipmentStatusEnum;
    } else if (!data.status) {
      status = EquipmentStatusEnum.Available;
    } else {
      throw new Error(
        `Invalid status: ${data.status}. Valid values are: ${validStatuses.join(
          ", "
        )}`
      );
    }

    // Handle owner data if provided
    const ownerId = data.ownerId || data.owner?.id || null;
    let ownerFirstName: string | null = null;
    let ownerLastName: string | null = null;

    if (ownerId) {
      const ownerIdNum = Number(ownerId);
      if (!isNaN(ownerIdNum)) {
        const user = db
          .prepare("SELECT firstName, lastName FROM users WHERE id = ?")
          .get(ownerIdNum) as
          | { firstName: string; lastName: string }
          | undefined;

        if (user) {
          ownerFirstName = user.firstName;
          ownerLastName = user.lastName;
        }
      }
    }

    const stmt = db.prepare(`
      INSERT INTO equipment (
        createdAt, updatedAt, title, ownerId, ownerFirstName,
        ownerLastName, description, receiptTimestamp, wasUsed,
        hasDefect, imageUrl, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      now,
      now,
      data.title || null,
      ownerId,
      ownerFirstName,
      ownerLastName,
      data.description || null,
      data.receiptTimestamp || null,
      data.wasUsed ? 1 : 0,
      data.hasDefect ? 1 : 0,
      data.imageUrl || null,
      status
    );

    return this.getById(result.lastInsertRowid as number)!;
  }

  update(id: number, data: any): Equipment | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const now = new Date().toISOString();

    const fields: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) {
      fields.push("title = ?");
      values.push(data.title);
    }
    if (data.ownerId !== undefined) {
      // Convert ownerId to number if it's a string
      const ownerId = data.ownerId === null ? null : Number(data.ownerId);

      fields.push("ownerId = ?");
      values.push(ownerId);

      // Fetch owner's firstName and lastName from users table
      let ownerFirstName: string | null = null;
      let ownerLastName: string | null = null;

      if (ownerId && !isNaN(ownerId)) {
        const user = db
          .prepare("SELECT firstName, lastName FROM users WHERE id = ?")
          .get(ownerId) as { firstName: string; lastName: string } | undefined;

        if (user) {
          ownerFirstName = user.firstName;
          ownerLastName = user.lastName;
        }
      }

      fields.push("ownerFirstName = ?");
      values.push(ownerFirstName);
      fields.push("ownerLastName = ?");
      values.push(ownerLastName);
    }
    if (data.ownerFirstName !== undefined && data.ownerId === undefined) {
      fields.push("ownerFirstName = ?");
      values.push(data.ownerFirstName);
    }
    if (data.ownerLastName !== undefined && data.ownerId === undefined) {
      fields.push("ownerLastName = ?");
      values.push(data.ownerLastName);
    }
    if (data.description !== undefined) {
      fields.push("description = ?");
      values.push(data.description);
    }
    if (data.receiptTimestamp !== undefined) {
      fields.push("receiptTimestamp = ?");
      values.push(data.receiptTimestamp);
    }
    if (data.wasUsed !== undefined) {
      fields.push("wasUsed = ?");
      values.push(data.wasUsed ? 1 : 0);
    }
    if (data.hasDefect !== undefined) {
      fields.push("hasDefect = ?");
      values.push(data.hasDefect ? 1 : 0);
    }
    if (data.imageUrl !== undefined) {
      fields.push("imageUrl = ?");
      values.push(data.imageUrl);
    }
    if (data.status !== undefined) {
      fields.push("status = ?");
      values.push(data.status);
    }

    fields.push("updatedAt = ?");
    values.push(now);

    values.push(id);

    const query = `UPDATE equipment SET ${fields.join(", ")} WHERE id = ?`;
    db.prepare(query).run(...values);

    return this.getById(id);
  }

  delete(id: number): boolean {
    const result = db.prepare("DELETE FROM equipment WHERE id = ?").run(id);
    return result.changes > 0;
  }

  getSummary(): EquipmentSummary {
    const total = (
      db.prepare("SELECT COUNT(*) as count FROM equipment").get() as {
        count: number;
      }
    ).count;
    const occupied = (
      db
        .prepare("SELECT COUNT(*) as count FROM equipment WHERE status = ?")
        .get("occupied") as { count: number }
    ).count;
    const available = (
      db
        .prepare("SELECT COUNT(*) as count FROM equipment WHERE status = ?")
        .get("available") as { count: number }
    ).count;

    return {
      total,
      occupied,
      available,
    };
  }
}

export default new EquipmentService();
