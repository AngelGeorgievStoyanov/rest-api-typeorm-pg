import express from "express";
import { body, validationResult } from "express-validator";
import { User } from "../entity/User";
import { create, findByEmail } from "../services/userService";
import { AppDataSource } from "../data-source";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { trimBody } from "../middleware/trim.body.middleware";

export const secret = "top secret!";

export default function authController() {
  const router = express.Router();

  router.use(trimBody);

  router.post(
    "/register",
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*\W)(?!.*\s).{8,}$/)
      .withMessage(
        "Password must contain 8 characters, at least one digit, and one special character"
      ),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const errorMessage = errors
            .array()
            .map((error) => `${error.msg}: ${error.msg}`)
            .join("\n");
          throw new Error(errorMessage);
        }

        const existing = await findByEmail(req.body.email);
        if (existing) {
          throw new Error("Email is taken");
        }

        const { email, firstName, lastName, password } = req.body;
        const user: User = await create(email, firstName, lastName, password);
        const token = createToken(user);
        res.status(201).json(token);
      } catch (err) {
        console.error(err.message);
        res.status(400).json({ error: err.message });
      }
    }
  );
  router.post("/login", async (req, res) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { email: req.body.email },
      });

      if (!user) {
        console.log(req.body.email);
        throw new Error("Incorrect email or password");
      }

      const match = await bcrypt.compare(
        req.body.password,
        user.hashedPassword
      );

      if (!match) {
        throw new Error("Incorrect email or password");
      }

      const token = createToken(user);
      res.status(200).json(token);
    } catch (err) {
      console.log(err.message);
      res.status(401).json(err.message);
    }
  });

  return router;
}

function createToken(user: User) {
  const payload = {
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  return {
    accessToken: jwt.sign(payload, secret),
  };
}
