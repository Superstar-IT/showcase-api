import express from "express";
import { getRandomUserHandler } from "../controllers/user.controller";

const router = express.Router();

router.get("/random", getRandomUserHandler);

export default router;
