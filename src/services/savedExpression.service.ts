import { AppError } from "../middlewares/error.middleware";
import { FeedbackResult, SavedExpression, UserSentence, Word } from "../models";

interface CreateSavedExpressionInput {
  wordId?: string;
  userSentenceId?: string;
  feedbackResultId?: string;
  savedExpression: string;
  memo?: string | null;
}

export const createSavedExpression = async (
  input: CreateSavedExpressionInput,
  userId: string | null
) => {
  const savedExpressionText = input.savedExpression?.trim();
  if (!savedExpressionText) {
    throw new AppError("savedExpression is required", 400);
  }

  if (!input.userSentenceId) {
    throw new AppError("userSentenceId is required", 400);
  }

  const userSentence = await UserSentence.findByPk(input.userSentenceId);
  if (!userSentence) {
    throw new AppError("userSentence not found", 404);
  }

  if (input.wordId) {
    const word = await Word.findByPk(input.wordId);
    if (!word) {
      throw new AppError("word not found", 404);
    }
  }

  if (input.feedbackResultId) {
    const feedback = await FeedbackResult.findByPk(input.feedbackResultId);
    if (!feedback) {
      throw new AppError("feedback result not found", 404);
    }
  }

  return SavedExpression.create({
    userId,
    wordId: input.wordId ?? userSentence.wordId ?? null,
    userSentenceId: input.userSentenceId,
    feedbackResultId: input.feedbackResultId ?? null,
    originalSentence: userSentence.originalSentence,
    savedExpression: savedExpressionText,
    memo: input.memo ?? null
  });
};

export const getMySavedExpressions = async (userId: string) => {
  return SavedExpression.findAll({
    where: { userId },
    include: [
      {
        model: Word,
        as: "word",
        attributes: ["id", "korean", "romanization", "englishTitle", "shortMeaningKo", "shortMeaningEn"]
      }
    ],
    order: [["createdAt", "DESC"]]
  });
};
