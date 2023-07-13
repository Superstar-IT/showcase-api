import express from "express";
import {
  getProfileHanlder,
  loginUserHandler,
  registerUserHandler,
} from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/authenticateToken";
import { validateSchema } from "../middleware/validateSchema";
import { createUserSchema, loginUserSchema } from "../schemas/user.schema";

const router = express.Router();

router.post("/register", validateSchema(createUserSchema), registerUserHandler);
router.post("/login", validateSchema(loginUserSchema), loginUserHandler);
router.get("/profile ", authenticateToken, getProfileHanlder);

export default router;
