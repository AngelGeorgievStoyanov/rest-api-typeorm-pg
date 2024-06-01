import { IsNull, Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { Note } from "../entity/Note";
import { User } from "../entity/User";

export async function create(noteData: Note, ownerId: string): Promise<Note> {
  const noteRepository = AppDataSource.getRepository(Note);
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOne({ where: { _id: ownerId } });
  if (!user) {
    throw new Error("User not found");
  }
  try {
    const note = noteRepository.create({
      ...noteData,
      _owner: user,
      createdAt: new Date().toISOString(),
    });
    await noteRepository.save(note);
    return note;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function getAllNotesByOwnerId(
  ownerId: string,
  page: number,
  pageSize: number,
  sortOrder: string
): Promise<{ totalCount: number; notes: Note[] }> {
  const noteRepository = AppDataSource.getRepository(Note);
  const [field, direction] = sortOrder.split("_");

  let sortField: keyof Note = "createdAt";
  switch (field) {
    case "created":
      sortField = "createdAt";
      break;
    case "edited":
      sortField = "editedAt";
      break;
    case "completed":
      sortField = "completedAt";
      break;
    default:
      sortField = "createdAt";
      break;
  }
  const sortDirection: "ASC" | "DESC" = direction === "asc" ? "ASC" : "DESC";
  const filterCondition =
    field === "edited" || field === "completed"
      ? { [sortField]: Not(IsNull()) }
      : {};

  const [notes, totalCount] = await noteRepository.findAndCount({
    where: { _owner: { _id: ownerId }, ...filterCondition },
    order: { [sortField]: sortDirection },
    skip: page * pageSize,
    take: pageSize,
  });

  return { totalCount, notes };
}

export async function getNoteById(noteId: string): Promise<Note[]> {
  const noteRepository = AppDataSource.getRepository(Note);
  try {
    const note = await noteRepository.findBy({ _id: noteId });
    return note;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function updateNoteById(
  note: Note,
  noteId: string
): Promise<Note> {
  const noteRepository = AppDataSource.getRepository(Note);
  try {
    const existingNote = await noteRepository.findOneBy({ _id: noteId });
    if (!existingNote) {
      throw new Error("Note not found");
    }

    if (note.title !== undefined) {
    }
    existingNote.title = note.title;

    if (note.content !== undefined) {
    }
    existingNote.content = note.content;

    existingNote.editedAt = new Date().toISOString();

    await noteRepository.save(existingNote);

    return existingNote;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function deleteNoteById(noteId: string): Promise<Note> {
  const noteRepository = AppDataSource.getRepository(Note);
  try {
    const existingNote = await noteRepository.findOneBy({ _id: noteId });
    if (!existingNote) {
      throw new Error("Note not found");
    }
    await noteRepository.remove(existingNote);
    return existingNote;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function completedNoteById(
  note: Note,
  noteId: string
): Promise<Note> {
  const noteRepository = AppDataSource.getRepository(Note);
  try {
    const existingNote = await noteRepository.findOneBy({ _id: noteId });
    if (!existingNote) {
      throw new Error("Note not found");
    }

    existingNote.completedAt = note.completed ? null : new Date().toISOString();

    existingNote.completed = !note.completed;

    await noteRepository.save(existingNote);

    return existingNote;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function markTableNotesAsCompleted(
  ids: string[],
  ownerId: string,
  page: number,
  pageSize: number,
  sortOrder: string
): Promise<{ totalCount: number; notes: Note[] }> {
  const noteRepository = AppDataSource.getRepository(Note);

  try {
    await noteRepository
      .createQueryBuilder()
      .update(Note)
      .set({ completed: true, completedAt: new Date().toISOString() })
      .whereInIds(ids)
      .execute();

    const notesAndCount = await getAllNotesByOwnerId(
      ownerId,
      page,
      pageSize,
      sortOrder
    );

    return notesAndCount;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function deleteNotesFromTable(
    ids: string[],
    ownerId: string,
    page: number,
    pageSize: number,
    sortOrder: string
  ): Promise<{ totalCount: number; notes: Note[] }> {
    const noteRepository = AppDataSource.getRepository(Note);
  
    try {
     
      await noteRepository.createQueryBuilder()
        .delete()
        .from(Note)
        .whereInIds(ids)
        .execute();
  
      const notesAndCount = await getAllNotesByOwnerId(ownerId, page, pageSize, sortOrder);
  
      return notesAndCount;
    } catch (err) {
      throw new Error(err.message);
    }
  }