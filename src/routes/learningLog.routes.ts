import { Router } from "express";
import {
  createLearningCompleteController,
  createLearningStartController,
  getMyLearningLogsController
} from "../controllers/learningLog.controller";

const router = Router();

router.post("/start", createLearningStartController);
router.post("/complete", createLearningCompleteController);
router.get("/me", getMyLearningLogsController);

export default router;
