import db from "@database/database";
import {
  Project,
  ProjectRow,
  PaginatedResponse,
  QueryParams,
  ProjectsSummary,
  ProjectStatusEnum,
} from "@app-types/index";

export class ProjectsService {
  private rowToProject(row: ProjectRow): Project {
    return {
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      icon: row.icon,
      title: row.title,
      location: row.location as any,
      categories: JSON.parse(row.categories),
      description: row.description,
      shortDescription: row.shortDescription,
      startDate: row.startDate,
      endDate: row.endDate,
      status: row.status as ProjectStatusEnum,
      techs: JSON.parse(row.techs),
      sprintCount: row.sprintCount,
      timezone: row.timezone,
      organization: row.organization,
    };
  }

  getAll(params: QueryParams): PaginatedResponse<Project> {
    const { filter, sort, current = 1, size = 10 } = params;

    let query = "SELECT * FROM projects WHERE 1=1";
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

    const rows = db.prepare(query).all(...queryParams) as ProjectRow[];
    const projects = rows.map((row) => this.rowToProject(row));

    return {
      results: projects,
      page: {
        size,
        total,
        current,
      },
    };
  }

  getById(id: number): Project | null {
    const row = db.prepare("SELECT * FROM projects WHERE id = ?").get(id) as
      | ProjectRow
      | undefined;
    return row ? this.rowToProject(row) : null;
  }

  create(data: Partial<Project>): Project {
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO projects (
        createdAt, updatedAt, icon, title, location, categories,
        description, shortDescription, startDate, endDate, status,
        techs, sprintCount, timezone, organization
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      now,
      now,
      null,
      data.title || null,
      null,
      JSON.stringify([]),
      null,
      null,
      null,
      null,
      ProjectStatusEnum.Active,
      JSON.stringify({
        frontend: [],
        backend: [],
        qa: [],
        db: [],
        mobile: [],
        other: [],
        manager: [],
      }),
      null,
      null,
      null
    );

    return this.getById(result.lastInsertRowid as number)!;
  }

  update(id: number, data: Partial<Project>): Project | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const now = new Date().toISOString();

    const fields: string[] = [];
    const values: any[] = [];

    if (data.icon !== undefined) {
      fields.push("icon = ?");
      values.push(data.icon);
    }
    if (data.title !== undefined) {
      fields.push("title = ?");
      values.push(data.title);
    }
    if (data.location !== undefined) {
      fields.push("location = ?");
      values.push(data.location);
    }
    if (data.categories !== undefined) {
      fields.push("categories = ?");
      values.push(JSON.stringify(data.categories));
    }
    if (data.description !== undefined) {
      fields.push("description = ?");
      values.push(data.description);
    }
    if (data.shortDescription !== undefined) {
      fields.push("shortDescription = ?");
      values.push(data.shortDescription);
    }
    if (data.startDate !== undefined) {
      fields.push("startDate = ?");
      values.push(data.startDate);
    }
    if (data.endDate !== undefined) {
      fields.push("endDate = ?");
      values.push(data.endDate);
    }
    if (data.status !== undefined) {
      fields.push("status = ?");
      values.push(data.status);
    }
    if (data.techs !== undefined) {
      fields.push("techs = ?");
      values.push(JSON.stringify(data.techs));
    }
    if (data.sprintCount !== undefined) {
      fields.push("sprintCount = ?");
      values.push(data.sprintCount);
    }
    if (data.timezone !== undefined) {
      fields.push("timezone = ?");
      values.push(data.timezone);
    }
    if (data.organization !== undefined) {
      fields.push("organization = ?");
      values.push(data.organization);
    }

    fields.push("updatedAt = ?");
    values.push(now);

    values.push(id);

    const query = `UPDATE projects SET ${fields.join(", ")} WHERE id = ?`;
    db.prepare(query).run(...values);

    return this.getById(id);
  }

  delete(id: number): boolean {
    const result = db.prepare("DELETE FROM projects WHERE id = ?").run(id);
    return result.changes > 0;
  }

  getSummary(): ProjectsSummary {
    const total = (
      db.prepare("SELECT COUNT(*) as count FROM projects").get() as {
        count: number;
      }
    ).count;
    const support = (
      db
        .prepare("SELECT COUNT(*) as count FROM projects WHERE status = ?")
        .get("support") as { count: number }
    ).count;
    const completed = (
      db
        .prepare("SELECT COUNT(*) as count FROM projects WHERE status = ?")
        .get("completed") as { count: number }
    ).count;
    const active = (
      db
        .prepare("SELECT COUNT(*) as count FROM projects WHERE status = ?")
        .get("active") as { count: number }
    ).count;

    return {
      total,
      support,
      completed,
      active,
    };
  }
}

export default new ProjectsService();
