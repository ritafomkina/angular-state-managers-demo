import { Router, Request, Response } from "express";
import usersService from "@services/users.service";

const router = Router();

// GET /users - Get all users with filtering, sorting, and pagination
router.get("/", (req: Request, res: Response) => {
  try {
    const params = {
      filter: req.query.filter as string | undefined,
      sort: req.query.sort as string | undefined,
      current: req.query.current ? parseInt(req.query.current as string) : 1,
      size: req.query.size ? parseInt(req.query.size as string) : 10,
    };

    const result = usersService.getAll(params);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /users/summary - Get users summary
router.get("/summary", (req: Request, res: Response) => {
  try {
    const summary = usersService.getSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /users/:id - Get user by ID
router.get("/:id", (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const user = usersService.getById(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /users - Create new user
router.post("/", (req: Request, res: Response) => {
  try {
    const user = usersService.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /users/:id - Update user
router.patch("/:id", (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const user = usersService.update(id, req.body);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /users/:id - Delete user
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = usersService.delete(id);
    if (!deleted) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
