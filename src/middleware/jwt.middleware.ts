import  jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { secret } from "../controllers/authController";



export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.header("Authorization");
   if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Access denied. No token provided.");
    return res.status(401).json("Access denied. No token provided.");
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      console.log(err.message);
      return res.status(403).json("Invalid token.");
    }

    req["user"] = user;

    next();
  });
}
