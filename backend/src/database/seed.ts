import db from "./database";
import { MOCKED_USERS } from "@mocks/users.mocks";
import { MOCKED_PROJECTS } from "@mocks/projects.mocks";
import { MOCKED_EQUIPMENT } from "@mocks/equipment.mocks";
import { MOCKED_VACATIONS } from "@mocks/vacations.mocks";

export function seedDatabase() {
  // Clear existing data
  db.exec("DELETE FROM vacations");
  db.exec("DELETE FROM equipment");
  db.exec("DELETE FROM users");
  db.exec("DELETE FROM projects");

  // Insert projects first (since users reference projects)
  const insertProject = db.prepare(`
    INSERT INTO projects (
      createdAt, updatedAt, icon, title, location, categories,
      description, shortDescription, startDate, endDate, status,
      techs, sprintCount, timezone, organization
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const project of MOCKED_PROJECTS) {
    insertProject.run(
      project.createdAt,
      project.updatedAt,
      project.icon,
      project.title,
      project.location,
      JSON.stringify(project.categories),
      project.description,
      project.shortDescription,
      project.startDate,
      project.endDate,
      project.status,
      JSON.stringify(project.techs),
      project.sprintCount,
      project.timezone,
      project.organization
    );
  }

  // Insert users
  const insertUser = db.prepare(`
    INSERT INTO users (
      createdAt, updatedAt, firstName, lastName, dateOfBirth,
      position, photo, startDate, status, email, phone, location,
      projectId, projectTitle
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const user of MOCKED_USERS) {
    insertUser.run(
      user.createdAt,
      user.updatedAt,
      user.firstName,
      user.lastName,
      user.dateOfBirth,
      user.position,
      user.photo,
      user.startDate,
      user.status,
      user.contacts.email,
      user.contacts.phone,
      user.location,
      user.project ? parseInt(user.project.id as any) : null,
      user.project?.title || null
    );
  }

  // Insert equipment
  const insertEquipment = db.prepare(`
    INSERT INTO equipment (
      createdAt, updatedAt, title, ownerId, ownerFirstName,
      ownerLastName, description, receiptTimestamp, wasUsed,
      lastOwnerId, lastOwnerFirstName, lastOwnerLastName,
      hasDefect, imageUrl, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const equipment of MOCKED_EQUIPMENT) {
    insertEquipment.run(
      equipment.createdAt,
      equipment.updatedAt,
      equipment.title,
      equipment.owner ? parseInt(equipment.owner.id as any) : null,
      equipment.owner?.firstName || null,
      equipment.owner?.lastName || null,
      equipment.description,
      equipment.receiptTimestamp,
      equipment.wasUsed ? 1 : 0,
      equipment.lastOwner ? parseInt(equipment.lastOwner.id as any) : null,
      equipment.lastOwner?.firstName || null,
      equipment.lastOwner?.lastName || null,
      equipment.hasDefect ? 1 : 0,
      equipment.imageUrl,
      equipment.status
    );
  }

  // Insert vacations
  const insertVacation = db.prepare(`
    INSERT INTO vacations (
      createdAt, updatedAt, userId, userFirstName, userLastName,
      type, status, daysAvailable, daysRequested, createdDate,
      startDate, endDate
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const vacation of MOCKED_VACATIONS) {
    insertVacation.run(
      vacation.createdAt,
      vacation.updatedAt,
      parseInt(vacation.user.id as any),
      vacation.user.firstName,
      vacation.user.lastName,
      vacation.type,
      vacation.status,
      vacation.daysAvailable,
      vacation.daysRequested,
      vacation.createdDate,
      vacation.startDate,
      vacation.endDate
    );
  }

  console.log("Database seeded successfully");
  console.log(`- Projects: ${MOCKED_PROJECTS.length}`);
  console.log(`- Users: ${MOCKED_USERS.length}`);
  console.log(`- Equipment: ${MOCKED_EQUIPMENT.length}`);
  console.log(`- Vacations: ${MOCKED_VACATIONS.length}`);
}
