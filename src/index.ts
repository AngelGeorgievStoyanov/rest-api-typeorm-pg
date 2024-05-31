import "reflect-metadata";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { AppDataSource } from "./data-source";
import authController from "./controllers/authController";
import noteController from "./controllers/noteController";

const app = express();
const PORT = 8080;

const allowedOrigins = ["http://localhost:5173"];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: "GET,POST,PUT,DELETE",
};
app.use(cors(options));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 100000,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.raw({ limit: "50mb", inflate: true }));

app.use("/auth", authController());
app.use("/note", noteController());


AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log("Server error:", error));
