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
