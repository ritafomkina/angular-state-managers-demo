import { Router, Request, Response } from "express";
import vacationsService from "@services/vacations.service";

const router = Router();

// GET /vacations - Get all vacations with sorting, pagination, and filtering
router.get("/", (req: Request, res: Response) => {
  try {
    const params = {
      sort: req.query.sort as string | undefined,
      current: req.query.current ? parseInt(req.query.current as string) : 1,
      size: req.query.size ? parseInt(req.query.size as string) : 10,
      filter: req.query.filter as string | undefined,
    };

    const result = vacationsService.getAll(params);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /vacations/summary - Get vacations summary
router.get("/summary", (req: Request, res: Response) => {
  try {
    const summary = vacationsService.getSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /vacations/:id - Get vacation by ID
router.get("/:id", (req: Request, res: Response) => {
  try {
    const vacation = vacationsService.getById(parseInt(req.params.id, 10));
    if (!vacation) {
      res.status(404).json({ error: "Vacation not found" });
      return;
    }
    res.json(vacation);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /vacations - Create new vacation
router.post("/", (req: Request, res: Response) => {
  try {
    const vacation = vacationsService.create(req.body);
    res.status(201).json(vacation);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /vacations/:id - Update vacation
router.patch("/:id", (req: Request, res: Response) => {
  try {
    const vacation = vacationsService.update(
      parseInt(req.params.id, 10),
      req.body
    );
    if (!vacation) {
      res.status(404).json({ error: "Vacation not found" });
      return;
    }
    res.json(vacation);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /vacations/:id - Delete vacation
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const deleted = vacationsService.delete(parseInt(req.params.id, 10));
    if (!deleted) {
      res.status(404).json({ error: "Vacation not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
