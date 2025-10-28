import { Router, Request, Response } from "express";
import projectsService from "@services/projects.service";

const router = Router();

// GET /projects - Get all projects with filtering, sorting, and pagination
router.get("/", (req: Request, res: Response) => {
  try {
    const params = {
      filter: req.query.filter as string | undefined,
      sort: req.query.sort as string | undefined,
      current: req.query.current ? parseInt(req.query.current as string) : 1,
      size: req.query.size ? parseInt(req.query.size as string) : 10,
    };

    const result = projectsService.getAll(params);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /projects/summary - Get projects summary
router.get("/summary", (req: Request, res: Response) => {
  try {
    const summary = projectsService.getSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /projects/:id - Get project by ID
router.get("/:id", (req: Request, res: Response) => {
  try {
    const project = projectsService.getById(parseInt(req.params.id, 10));
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /projects - Create new project
router.post("/", (req: Request, res: Response) => {
  try {
    const project = projectsService.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /projects/:id - Update project
router.patch("/:id", (req: Request, res: Response) => {
  try {
    const project = projectsService.update(parseInt(req.params.id, 10), req.body);
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /projects/:id - Delete project
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const deleted = projectsService.delete(parseInt(req.params.id, 10));
    if (!deleted) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
