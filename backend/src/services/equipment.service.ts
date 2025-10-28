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
    return {
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      title: row.title,
      owner: row.ownerId
        ? {
            id: row.ownerId,
            firstName: row.ownerFirstName!,
            lastName: row.ownerLastName!,
          }
        : null,
      description: row.description,
      receiptTimestamp: row.receiptTimestamp,
      wasUsed: row.wasUsed === 1,
      lastOwner: row.lastOwnerId
        ? {
            id: row.lastOwnerId,
            firstName: row.lastOwnerFirstName!,
            lastName: row.lastOwnerLastName!,
          }
        : null,
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

    const stmt = db.prepare(`
      INSERT INTO equipment (
        createdAt, updatedAt, title, ownerId, ownerFirstName,
        ownerLastName, description, receiptTimestamp, wasUsed,
        lastOwnerId, lastOwnerFirstName, lastOwnerLastName,
        hasDefect, imageUrl, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      now,
      now,
      data.title || null,
      data.owner || null,
      null,
      null,
      data.description || null,
      data.receiptTimestamp || null,
      0,
      null,
      null,
      null,
      0,
      null,
      data.status || null
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
      fields.push("ownerId = ?");
      values.push(data.ownerId);
    }
    if (data.ownerFirstName !== undefined) {
      fields.push("ownerFirstName = ?");
      values.push(data.ownerFirstName);
    }
    if (data.ownerLastName !== undefined) {
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
