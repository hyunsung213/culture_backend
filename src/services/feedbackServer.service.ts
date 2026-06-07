import axios from "axios";
import { env } from "../config/env";
import {
  FeedbackJudgement,
  FeedbackServerRequest,
  FeedbackServerResponse,
  FeedbackTpo
} from "../types/feedback";

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
};

const buildFallbackFeedback = (
  targetWord: string,
  requestId: string
): FeedbackServerResponse => {
  const grammar: FeedbackJudgement = {
    correct: false,
    reason: "AI 문장 분석 서버 연결에 실패했습니다.",
    suggestion: null
  };
  const meaning: FeedbackJudgement = {
    correct: false,
    reason: "입력한 문장은 저장되었지만, 상세 의미 분석은 잠시 후 다시 시도해주세요.",
    suggestion: null
  };
  const tpo: FeedbackTpo = {
    best_fit: "반격식",
    reason: "피드백 서버 연결 실패로 TPO 분석을 제공할 수 없습니다.",
    공적: "잠시 후 다시 시도해주세요.",
    사적: "잠시 후 다시 시도해주세요.",
    반격식: "잠시 후 다시 시도해주세요."
  };

  return {
    requestId,
    targetWord,
    grammar,
    meaning,
    tpo,
    score: null,
    summary: "현재 AI 피드백 서버에 연결할 수 없어 기본 피드백을 제공합니다.",
    meaningFeedback: meaning.reason,
    grammarFeedback: grammar.reason,
    nuanceFeedback: tpo.reason,
    naturalExpression: "잠시 후 다시 시도해주세요.",
    politeExpression: null,
    casualExpression: null,
    writingExpression: null,
    tips: ["피드백 서버가 준비되면 더 자세한 분석을 받을 수 있습니다."],
    errorTypes: ["feedback_server_error"],
    references: [],
    feedbackServerVersion: "fallback"
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const normalizeJudgement = (
  value: unknown,
  fallbackReason: string
): FeedbackJudgement => {
  if (!isRecord(value)) {
    return {
      correct: false,
      reason: fallbackReason,
      suggestion: null
    };
  }

  return {
    correct: typeof value.correct === "boolean" ? value.correct : false,
    reason: typeof value.reason === "string" ? value.reason : fallbackReason,
    suggestion: typeof value.suggestion === "string" ? value.suggestion : null
  };
};

const normalizeTpo = (value: unknown): FeedbackTpo => {
  if (!isRecord(value)) {
    return {
      best_fit: "반격식",
      reason: "TPO 분석이 제공되지 않았습니다."
    };
  }

  return {
    ...value,
    best_fit: typeof value.best_fit === "string" ? value.best_fit : "반격식",
    reason: typeof value.reason === "string" ? value.reason : "TPO 분석이 제공되지 않았습니다."
  };
};

const normalizeFeedbackResponse = (
  payload: FeedbackServerRequest,
  data: Partial<FeedbackServerResponse> | undefined
): FeedbackServerResponse => {
  const safeData = data ?? {};
  const grammar = normalizeJudgement(safeData.grammar, safeData.grammarFeedback ?? "문법 피드백이 제공되지 않았습니다.");
  const meaning = normalizeJudgement(safeData.meaning, safeData.meaningFeedback ?? "의미 피드백이 제공되지 않았습니다.");
  const tpo = normalizeTpo(safeData.tpo);
  const originalSentence =
    typeof safeData.original_sentence === "string"
      ? safeData.original_sentence
      : typeof safeData.originalSentence === "string"
        ? safeData.originalSentence
        : payload.sentence;

  return {
    requestId: safeData.requestId ?? payload.requestId,
    targetWord: safeData.targetWord ?? safeData.target_word ?? payload.word.korean,
    target_word: safeData.target_word ?? safeData.targetWord ?? payload.word.korean,
    originalSentence,
    original_sentence: originalSentence,
    grammar,
    meaning,
    tpo,
    score: typeof safeData.score === "number" ? safeData.score : null,
    summary: safeData.summary ?? "피드백 서버 응답 요약이 없습니다.",
    meaningFeedback: safeData.meaningFeedback ?? meaning.reason,
    grammarFeedback: safeData.grammarFeedback ?? grammar.reason,
    nuanceFeedback: safeData.nuanceFeedback ?? tpo.reason,
    naturalExpression: safeData.naturalExpression ?? null,
    politeExpression: safeData.politeExpression ?? null,
    casualExpression: safeData.casualExpression ?? null,
    writingExpression: safeData.writingExpression ?? null,
    tips: toStringArray(safeData.tips),
    errorTypes: toStringArray(safeData.errorTypes),
    references: Array.isArray(safeData.references) ? safeData.references : [],
    feedbackServerVersion: safeData.feedbackServerVersion ?? "unknown",
    isMeaningCorrect: safeData.isMeaningCorrect
  };
};

export const requestFeedbackAnalysis = async (
  payload: FeedbackServerRequest
): Promise<FeedbackServerResponse> => {
  try {
    const { data } = await axios.post<FeedbackServerResponse>(
      `${env.LLM_SERVER_URL}/feedback`,
      {
        sentence: payload.sentence
      },
      {
        timeout: 30000
      }
    );

    return normalizeFeedbackResponse(payload, data);
  } catch (error) {
    console.error("Feedback server request failed:", error);
    return buildFallbackFeedback(payload.word.korean, payload.requestId);
  }
};
