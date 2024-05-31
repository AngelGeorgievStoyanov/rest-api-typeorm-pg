import express from "express";
import { Note } from "../entity/Note";
import { create, getAllNotesByOwnerId } from "../services/noteService";

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
          console.log(ownerId)
          console.log(page)
          console.log(pageSize)
          console.log(sortOrder)
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

  return router;
}
