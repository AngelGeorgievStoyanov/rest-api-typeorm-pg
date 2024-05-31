import { User } from "../entity/User";
import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";

export async function findByEmail(email: string): Promise<User | null> {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email } });
  return user || null;
}

export async function create(
  email: string,
  firstName: string,
  lastName: string,
  password: string
): Promise<User | null> {
  const userRepository = AppDataSource.getRepository(User);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User();
  user.email = email;
  user.firstName = firstName;
  user.lastName = lastName;
  user.hashedPassword = hashedPassword;

  try {
    const savedUser = await userRepository.save(user);
    return savedUser;
  } catch (error) {
    throw new Error(error.message);
  }
}
