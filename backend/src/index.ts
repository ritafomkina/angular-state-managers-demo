import express from "express";
import cors from "cors";
import { initDatabase, seedDatabase } from "@database/index";
import {
  usersRoutes,
  projectsRoutes,
  equipmentRoutes,
  vacationsRoutes,
} from "@routes/index";
import { config } from "./config";

const app = express();
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database and seed data
initDatabase();
seedDatabase();

// Routes with /api prefix
app.use("/api/users", usersRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/vacations", vacationsRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Backend API is running",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      projects: "/api/projects",
      equipment: "/api/equipment",
      vacations: "/api/vacations",
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   - Users: http://localhost:${PORT}/api/users`);
  console.log(`   - Projects: http://localhost:${PORT}/api/projects`);
  console.log(`   - Equipment: http://localhost:${PORT}/api/equipment`);
  console.log(`   - Vacations: http://localhost:${PORT}/api/vacations`);
});

export default app;
