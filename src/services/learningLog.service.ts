import { AppError } from "../middlewares/error.middleware";
import { LearningLog, Word } from "../models";

const ensureWordExists = async (wordId: string): Promise<void> => {
  const word = await Word.findByPk(wordId);
  if (!word) {
    throw new AppError("word not found", 404);
  }
};

export const createLearningStartLog = async (wordId: string, userId: string | null) => {
  await ensureWordExists(wordId);

  return LearningLog.create({
    userId,
    wordId,
    status: "started",
    completedAt: null
  });
};

export const createLearningCompleteLog = async (wordId: string, userId: string | null) => {
  await ensureWordExists(wordId);

  return LearningLog.create({
    userId,
    wordId,
    status: "completed",
    completedAt: new Date()
  });
};

export const getMyLearningLogs = async (userId: string) => {
  return LearningLog.findAll({
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

export const resetMyLearningLogs = async (userId: string) => {
  const deletedCount = await LearningLog.destroy({
    where: { userId }
  });

  return {
    success: true,
    deletedCount,
    message: "Learning progress has been reset"
  };
};
