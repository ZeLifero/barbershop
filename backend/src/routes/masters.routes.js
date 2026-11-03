import { Router } from "express";
import { getMasters } from "../controllers/masters.controller.js";

const router = Router();

router.get("/", getMasters);

export default router;