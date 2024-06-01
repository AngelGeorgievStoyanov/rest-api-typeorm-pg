import express from "express";
import { Note } from "../entity/Note";
import {
  create,
  deleteNoteById,
  getAllNotesByOwnerId,
  getNoteById,
  updateNoteById,
} from "../services/noteService";

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

  router.get(
    "/getNotesByOwnerId/:ownerId/page/:page/pageSize/:pageSize/sortOrder/:sortOrder",
    async (req, res) => {
      try {
        const ownerId = req.params.ownerId;
        const page = Number(req.params.page);
        const pageSize = Number(req.params.pageSize);
        const sortOrder = req.params.sortOrder;
        console.log(ownerId);
        console.log(page);
        console.log(pageSize);
        console.log(sortOrder);
        const notes = await getAllNotesByOwnerId(
          ownerId,
          page,
          pageSize,
          sortOrder
        );
        res.status(200).json(notes);
      } catch (err) {
        console.log(err.message);
        res.status(400).json(err.message);
      }
    }
  );
  router.get("/getNoteById/:noteId", async (req, res) => {
    try {
      const noteId = req.params.noteId;
      const note = await getNoteById(noteId);
      res.status(200).json(note);
    } catch (err) {
      console.log(err.message);
      res.status(400).json(err.message);
    }
  });

  router.post("/update/:noteId", async (req, res) => {
    const noteId = req.params.noteId;
    const userId = req.body._ownerId;
    const note = req.body.data;
    try {
      const updatedNote = await updateNoteById(note, noteId);
      res.status(200).json(updatedNote);
    } catch (err) {
      console.log(err.message);
      res.status(400).json(err.message);
    }
  });

  router.delete("/delete/:noteId", async (req, res) => {
    const noteId = req.params.noteId;
    try {
      const deletedNote = await deleteNoteById(noteId);
      res.status(200).json(deletedNote);
    } catch (err) {
      console.log(err.message);
      res.status(400).json(err.message);
    }
  });

  return router;
}
