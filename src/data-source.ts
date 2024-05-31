import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Note } from "./entity/Note";

// Database connection configuration variables.
// In production environment, these values should be set via .env file.
const TYPE = "postgres";
const USERNAME = "postgres"; // Database user name
const HOST = "localhost"; // Database host
const DB = "typeorm-pg"; // Database name
const PASSWORD = "1234"; // Database connection password
const PORTDB = 5432; // Database connection port
// Note: In production environment, the above configuration variables should be
// moved to a .env file to ensure data security and ease of management.

export const AppDataSource = new DataSource({
  type: TYPE,
  host: HOST,
  port: PORTDB,
  username: USERNAME,
  password: PASSWORD,
  database: DB,
  synchronize: true,
  logging: true,
  entities: [User, Note],
  subscribers: [],
  migrations: [],
});
