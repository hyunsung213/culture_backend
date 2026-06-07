import { randomUUID } from "crypto";
import { AppError } from "../middlewares/error.middleware";
import { FeedbackResult, UserSentence, Word, WordExample, WordUsagePattern } from "../models";
import { FeedbackServerRequest } from "../types/feedback";
import { requestFeedbackAnalysis } from "./feedbackServer.service";

interface CreateFeedbackInput {
  userId: string | null;
  wordId: string;
  sentence: string;
  userLevel?: string | null;
}

export const createFeedbackForSentence = async (input: CreateFeedbackInput) => {
  const cleanedSentence = input.sentence?.trim();
  if (!cleanedSentence) {
    throw new AppError("sentence is required", 400);
  }

  const word = await Word.findByPk(input.wordId, {
    include: [
      {
        model: WordExample,
        as: "examples",
        attributes: ["exampleKo"],
        required: false
      },
      {
        model: WordUsagePattern,
        as: "patterns",
        attributes: ["patternKo"],
        required: false
      }
    ]
  });

  if (!word || !word.isActive) {
    throw new AppError("word not found", 404);
  }

  const userSentence = await UserSentence.create({
    userId: input.userId,
    wordId: word.id,
    originalSentence: cleanedSentence
  });

  const requestId = randomUUID();
  const payload: FeedbackServerRequest = {
    requestId,
    userId: input.userId ?? "mock-user-id",
    word: {
      id: word.id,
      korean: word.korean,
      romanization: word.romanization,
      meaningKo: word.shortMeaningKo,
      meaningEn: word.shortMeaningEn,
      usageTip: word.usageTip,
      examples: (word.get("examples") as WordExample[] | undefined)?.map((example) => example.exampleKo) ?? [],
      patterns: (word.get("patterns") as WordUsagePattern[] | undefined)?.map((pattern) => pattern.patternKo) ?? []
    },
    sentence: cleanedSentence,
    userLevel: input.userLevel ?? "intermediate",
    outputLanguage: "ko-en"
  };

  const feedbackFromServer = await requestFeedbackAnalysis(payload);
  const targetWord = feedbackFromServer.target_word ?? feedbackFromServer.targetWord;

  const feedback = await FeedbackResult.create({
    userSentenceId: userSentence.id,
    requestId: feedbackFromServer.requestId ?? requestId,
    targetWord,
    score: feedbackFromServer.score,
    summary: feedbackFromServer.summary,
    meaningFeedback: feedbackFromServer.meaning?.reason ?? feedbackFromServer.meaningFeedback,
    grammarFeedback: feedbackFromServer.grammar?.reason ?? feedbackFromServer.grammarFeedback,
    nuanceFeedback: feedbackFromServer.tpo?.reason ?? feedbackFromServer.nuanceFeedback,
    grammarJson: feedbackFromServer.grammar ?? {},
    meaningJson: feedbackFromServer.meaning ?? {},
    tpoJson: feedbackFromServer.tpo ?? {},
    naturalExpression: feedbackFromServer.naturalExpression,
    politeExpression: feedbackFromServer.politeExpression,
    casualExpression: feedbackFromServer.casualExpression,
    writingExpression: feedbackFromServer.writingExpression,
    tips: feedbackFromServer.tips,
    errorTypes: feedbackFromServer.errorTypes,
    referencesJson: feedbackFromServer.references,
    rawResponse: feedbackFromServer,
    feedbackServerVersion: feedbackFromServer.feedbackServerVersion
  });

  return {
    original_sentence: userSentence.originalSentence,
    target_word: targetWord,
    grammar: feedback.grammarJson,
    meaning: feedback.meaningJson,
    tpo: feedback.tpoJson,
    summary: feedback.summary,
    meta: {
      user_sentence_id: userSentence.id,
      feedback_result_id: feedback.id,
      request_id: feedback.requestId,
      score: feedback.score,
      feedback_server_version: feedback.feedbackServerVersion
    }
  };
};
