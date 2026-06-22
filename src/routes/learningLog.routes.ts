import { Router } from "express";
import {
  createLearningCompleteController,
  createLearningStartController,
  getMyLearningLogsController,
  resetMyLearningLogsController
} from "../controllers/learningLog.controller";

const router = Router();

router.post("/start", createLearningStartController);
router.post("/complete", createLearningCompleteController);
router.get("/me", getMyLearningLogsController);
router.delete("/me", resetMyLearningLogsController);

export default router;
