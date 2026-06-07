export interface FeedbackWordContext {
  id: string;
  korean: string;
  romanization: string;
  meaningKo: string;
  meaningEn: string;
  usageTip: string;
  examples: string[];
  patterns: string[];
}

export interface FeedbackServerRequest {
  requestId: string;
  userId: string;
  word: FeedbackWordContext;
  sentence: string;
  userLevel: string;
  outputLanguage: "ko-en";
}

export interface FeedbackReference {
  type: string;
  content: string;
  [key: string]: unknown;
}

export interface FeedbackJudgement {
  correct: boolean;
  reason: string;
  suggestion: string | null;
  [key: string]: unknown;
}

export interface FeedbackTpo {
  best_fit: "공적" | "사적" | "반격식" | string;
  reason: string;
  공적?: string;
  사적?: string;
  반격식?: string;
  [key: string]: unknown;
}

export interface FeedbackServerResponse {
  requestId?: string;
  targetWord: string;
  target_word?: string;
  originalSentence?: string;
  original_sentence?: string;
  grammar?: FeedbackJudgement;
  meaning?: FeedbackJudgement;
  tpo?: FeedbackTpo;
  isMeaningCorrect?: boolean;
  score: number | null;
  summary: string;
  meaningFeedback: string;
  grammarFeedback: string;
  nuanceFeedback: string | null;
  naturalExpression: string | null;
  politeExpression: string | null;
  casualExpression: string | null;
  writingExpression: string | null;
  tips: string[];
  errorTypes: string[];
  references: FeedbackReference[];
  feedbackServerVersion: string;
  [key: string]: unknown;
}
