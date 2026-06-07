import { LearningLog, Word, WordExample, WordUsagePattern } from "../models";
import { AppError } from "../middlewares/error.middleware";

type WordWithAssociations = Word & {
  examples?: WordExample[];
  patterns?: WordUsagePattern[];
};

const wordOrder = [
  ["sortOrder", "ASC"],
  ["createdAt", "ASC"]
] as [string, "ASC"][];

const toTodayWordResponse = (word: WordWithAssociations) => ({
  id: word.id,
  korean: word.korean,
  type: word.type,
  partOfSpeech: word.partOfSpeech,
  romanization: word.romanization,
  englishTitle: word.englishTitle,
  shortMeaningKo: word.shortMeaningKo,
  shortMeaningEn: word.shortMeaningEn,
  usageTip: word.usageTip,
  difficulty: word.difficulty,
  tags: word.tags,
  sortOrder: word.sortOrder,
  cultureNote: word.cultureNote,
  examples: (word.examples ?? []).slice(0, 1),
  patterns: (word.patterns ?? []).slice(0, 3).map((pattern) => ({
    id: pattern.id,
    patternKo: pattern.patternKo,
    descriptionKo: pattern.descriptionKo,
    descriptionEn: pattern.descriptionEn
  }))
});

const toWordSummaryResponse = (word: Word) => ({
  id: word.id,
  korean: word.korean,
  type: word.type,
  partOfSpeech: word.partOfSpeech,
  romanization: word.romanization,
  englishTitle: word.englishTitle,
  shortMeaningKo: word.shortMeaningKo,
  shortMeaningEn: word.shortMeaningEn,
  difficulty: word.difficulty,
  tags: word.tags,
  sortOrder: word.sortOrder
});

export const getTodayWord = async (userId?: string | null) => {
  const activeWords = await Word.findAll({
    where: { isActive: true },
    include: [
      {
        model: WordExample,
        as: "examples",
        attributes: ["id", "exampleKo", "exampleEn", "exampleType"],
        required: false
      },
      {
        model: WordUsagePattern,
        as: "patterns",
        attributes: ["id", "patternKo", "descriptionKo", "descriptionEn"],
        required: false
      }
    ],
    order: wordOrder
  });

  if (activeWords.length === 0) {
    throw new AppError("No active word found", 404);
  }

  const completedWordIds = new Set<string>();

  if (userId) {
    const completedLogs = await LearningLog.findAll({
      where: {
        userId,
        status: "completed"
      },
      attributes: ["wordId"]
    });

    for (const log of completedLogs) {
      if (log.wordId) {
        completedWordIds.add(log.wordId);
      }
    }
  }

  const nextWord = activeWords.find((word) => !completedWordIds.has(word.id));
  const completedActiveWordCount = activeWords.filter((word) => completedWordIds.has(word.id)).length;

  if (!nextWord) {
    return {
      word: null,
      progress: {
        totalWords: activeWords.length,
        completedWords: activeWords.length,
        currentOrder: null,
        allCompleted: true
      }
    };
  }

  const plainWord = nextWord.get({ plain: true }) as WordWithAssociations;

  return {
    word: toTodayWordResponse(plainWord),
    progress: {
      totalWords: activeWords.length,
      completedWords: completedActiveWordCount,
      currentOrder: plainWord.sortOrder,
      allCompleted: false
    }
  };
};

export const getWordSummaries = async () => {
  const words = await Word.findAll({
    where: { isActive: true },
    attributes: [
      "id",
      "korean",
      "type",
      "partOfSpeech",
      "romanization",
      "englishTitle",
      "shortMeaningKo",
      "shortMeaningEn",
      "difficulty",
      "tags",
      "sortOrder"
    ],
    order: wordOrder
  });

  return words.map(toWordSummaryResponse);
};

export const getWords = async () => {
  return Word.findAll({
    where: { isActive: true },
    attributes: [
      "id",
      "korean",
      "type",
      "partOfSpeech",
      "romanization",
      "englishTitle",
      "shortMeaningKo",
      "shortMeaningEn",
      "usageTip",
      "difficulty",
      "tags",
      "sortOrder",
      "cultureNote",
      "createdAt",
      "updatedAt"
    ],
    order: wordOrder
  });
};

export const getWordDetail = async (wordId: string) => {
  const word = await Word.findOne({
    where: {
      id: wordId,
      isActive: true
    },
    include: [
      {
        model: WordExample,
        as: "examples",
        attributes: ["id", "exampleKo", "exampleEn", "exampleType", "source"],
        required: false
      },
      {
        model: WordUsagePattern,
        as: "patterns",
        attributes: ["id", "patternKo", "descriptionKo", "descriptionEn"],
        required: false
      }
    ]
  });

  if (!word) {
    throw new AppError("Word not found", 404);
  }

  return word;
};
