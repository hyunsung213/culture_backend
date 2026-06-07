import { Router } from "express";
import {
  getTodayWordController,
  getWordDetailController,
  getWordSummariesController,
  getWordsController
} from "../controllers/word.controller";

const router = Router();

router.get("/today", getTodayWordController);
router.get("/summary", getWordSummariesController);
router.get("/", getWordsController);
router.get("/:wordId", getWordDetailController);

export default router;
