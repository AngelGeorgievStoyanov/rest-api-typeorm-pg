import express from "express";
import { Note } from "../entity/Note";
import { create } from "../services/noteService";

export default function noteController() {
  const router = express.Router();

  router.post("/create", async (req, res) => {
    try {
      const userId = req.body.userId;
      const note: Note = await create({ ...req.body }, userId);
      res.status(201).json(note);
    } catch (err) {
      console.error(err.message);
      res.status(400).json(err.message);
    }
  });

  return router;
}
