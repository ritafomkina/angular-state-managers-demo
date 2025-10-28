import { Router, Request, Response } from "express";
import equipmentService from "@services/equipment.service";

const router = Router();

// GET /equipment - Get all equipment with filtering and pagination
router.get("/", (req: Request, res: Response) => {
  try {
    const params = {
      filter: req.query.filter as string | undefined,
      current: req.query.current ? parseInt(req.query.current as string) : 1,
      size: req.query.size ? parseInt(req.query.size as string) : 10,
    };

    const result = equipmentService.getAll(params);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /equipment/summary - Get equipment summary
router.get("/summary", (req: Request, res: Response) => {
  try {
    const summary = equipmentService.getSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /equipment/:id - Get equipment by ID
router.get("/:id", (req: Request, res: Response) => {
  try {
    const equipment = equipmentService.getById(parseInt(req.params.id, 10));
    if (!equipment) {
      res.status(404).json({ error: "Equipment not found" });
      return;
    }
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /equipment - Create new equipment
router.post("/", (req: Request, res: Response) => {
  try {
    const equipment = equipmentService.create(req.body);
    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /equipment/:id - Update equipment
router.patch("/:id", (req: Request, res: Response) => {
  try {
    const equipment = equipmentService.update(parseInt(req.params.id, 10), req.body);
    if (!equipment) {
      res.status(404).json({ error: "Equipment not found" });
      return;
    }
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /equipment/:id - Delete equipment
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const deleted = equipmentService.delete(parseInt(req.params.id, 10));
    if (!deleted) {
      res.status(404).json({ error: "Equipment not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
