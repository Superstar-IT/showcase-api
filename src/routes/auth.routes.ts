import express, { Router } from "express";
import {
  getProfileHanlder,
  loginUserHandler,
  registerUserHandler,
} from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/authenticateToken";
import { validateSchema } from "../middleware/validateSchema";
import { createUserSchema, loginUserSchema } from "../schemas/user.schema";

const router: Router = express.Router();

router.get("/profile", authenticateToken, getProfileHanlder);
router.post("/register", validateSchema(createUserSchema), registerUserHandler);
router.post("/login", validateSchema(loginUserSchema), loginUserHandler);

export default router;
