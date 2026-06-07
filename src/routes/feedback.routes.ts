import { Router } from "express";
import { createFeedbackController } from "../controllers/feedback.controller";

const router = Router();

router.post("/", createFeedbackController);

export default router;
