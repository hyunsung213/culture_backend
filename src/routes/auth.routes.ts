import { Router } from "express";
import {
  loginController,
  meController,
  passwordQuestionController,
  passwordResetController,
  passwordVerifyController,
  registerController
} from "../controllers/auth.controller";
import { authenticateJwt } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", authenticateJwt, meController);
router.post("/password/question", passwordQuestionController);
router.post("/password/verify", passwordVerifyController);
router.post("/password/reset", passwordResetController);

export default router;
