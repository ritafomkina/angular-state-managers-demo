import Database from "better-sqlite3";

const dbPath = "./database.db";
const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Create tables
export function initDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      firstName TEXT,
      lastName TEXT,
      dateOfBirth TEXT,
      position TEXT,
      photo TEXT,
      startDate TEXT,
      status TEXT,
      email TEXT,
      phone TEXT,
      location TEXT,
      projectId INTEGER,
      projectTitle TEXT
    )
  `);

  // Projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      icon TEXT,
      title TEXT,
      location TEXT,
      categories TEXT,
      description TEXT,
      shortDescription TEXT,
      startDate TEXT,
      endDate TEXT,
      status TEXT,
      techs TEXT,
      sprintCount INTEGER,
      timezone TEXT,
      organization INTEGER
    )
  `);

  // Equipment table
  db.exec(`
    CREATE TABLE IF NOT EXISTS equipment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      title TEXT,
      ownerId INTEGER,
      ownerFirstName TEXT,
      ownerLastName TEXT,
      description TEXT,
      receiptTimestamp TEXT,
      wasUsed INTEGER,
      lastOwnerId INTEGER,
      lastOwnerFirstName TEXT,
      lastOwnerLastName TEXT,
      hasDefect INTEGER,
      imageUrl TEXT,
      status TEXT
    )
  `);

  // Vacations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS vacations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      userId INTEGER,
      userFirstName TEXT,
      userLastName TEXT,
      type TEXT,
      status TEXT,
      daysAvailable INTEGER,
      daysRequested INTEGER,
      createdDate TEXT,
      startDate TEXT,
      endDate TEXT
    )
  `);

  console.log("Database initialized successfully");
}

export default db;
