import express from "express";
import { body, validationResult } from "express-validator";
import { User } from "../entity/User";
import { create, findByEmail } from "../services/userService";

export const secret = "top secret!";

export default function authController() {
  const router = express.Router();

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
        res.status(201).json(user);
      } catch (err) {
        console.error(err.message);
        res.status(400).json({ error: err.message });
      }
    }
  );

  return router;
}
