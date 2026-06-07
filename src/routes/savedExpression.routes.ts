import { Router } from "express";
import {
  createSavedExpressionController,
  getMySavedExpressionsController
} from "../controllers/savedExpression.controller";

const router = Router();

router.post("/", createSavedExpressionController);
router.get("/me", getMySavedExpressionsController);

export default router;
