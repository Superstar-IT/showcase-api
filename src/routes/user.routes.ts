import express, { Router } from "express";
import { getRandomUserHandler } from "../controllers/user.controller";

const router: Router = express.Router();

router.get("/random", getRandomUserHandler);

export default router;
