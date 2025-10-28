export const config = {
  port: process.env.PORT || 8000,
  env: process.env.NODE_ENV || "development",
  db: {
    path: process.env.DB_PATH || "./database.db",
  },
} as const;
