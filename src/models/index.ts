import { sequelize } from "../config/database";
import { FeedbackResult, initFeedbackResultModel } from "./FeedbackResult";
import { initLearningLogModel, LearningLog } from "./LearningLog";
import { initSavedExpressionModel, SavedExpression } from "./SavedExpression";
import { initUserModel, User } from "./User";
import { initUserSentenceModel, UserSentence } from "./UserSentence";
import { initWordExampleModel, WordExample } from "./WordExample";
import { initWordModel, Word } from "./Word";
import { initWordUsagePatternModel, WordUsagePattern } from "./WordUsagePattern";

let modelsInitialized = false;

export const initModels = (): void => {
  if (modelsInitialized) {
    return;
  }

  initUserModel(sequelize);
  initWordModel(sequelize);
  initWordExampleModel(sequelize);
  initWordUsagePatternModel(sequelize);
  initUserSentenceModel(sequelize);
  initFeedbackResultModel(sequelize);
  initSavedExpressionModel(sequelize);
  initLearningLogModel(sequelize);

  Word.hasMany(WordExample, { foreignKey: "wordId", as: "examples" });
  WordExample.belongsTo(Word, { foreignKey: "wordId", as: "word" });

  Word.hasMany(WordUsagePattern, { foreignKey: "wordId", as: "patterns" });
  WordUsagePattern.belongsTo(Word, { foreignKey: "wordId", as: "word" });

  User.hasMany(UserSentence, { foreignKey: "userId", as: "userSentences" });
  UserSentence.belongsTo(User, { foreignKey: "userId", as: "user" });

  Word.hasMany(UserSentence, { foreignKey: "wordId", as: "userSentences" });
  UserSentence.belongsTo(Word, { foreignKey: "wordId", as: "word" });

  UserSentence.hasOne(FeedbackResult, { foreignKey: "userSentenceId", as: "feedbackResult" });
  FeedbackResult.belongsTo(UserSentence, { foreignKey: "userSentenceId", as: "userSentence" });

  User.hasMany(SavedExpression, { foreignKey: "userId", as: "savedExpressions" });
  SavedExpression.belongsTo(User, { foreignKey: "userId", as: "user" });

  Word.hasMany(SavedExpression, { foreignKey: "wordId", as: "savedExpressions" });
  SavedExpression.belongsTo(Word, { foreignKey: "wordId", as: "word" });

  UserSentence.hasMany(SavedExpression, { foreignKey: "userSentenceId", as: "savedExpressions" });
  SavedExpression.belongsTo(UserSentence, { foreignKey: "userSentenceId", as: "userSentence" });

  FeedbackResult.hasMany(SavedExpression, { foreignKey: "feedbackResultId", as: "savedExpressions" });
  SavedExpression.belongsTo(FeedbackResult, { foreignKey: "feedbackResultId", as: "feedbackResult" });

  User.hasMany(LearningLog, { foreignKey: "userId", as: "learningLogs" });
  LearningLog.belongsTo(User, { foreignKey: "userId", as: "user" });

  Word.hasMany(LearningLog, { foreignKey: "wordId", as: "learningLogs" });
  LearningLog.belongsTo(Word, { foreignKey: "wordId", as: "word" });

  modelsInitialized = true;
};

initModels();

export {
  sequelize,
  User,
  Word,
  WordExample,
  WordUsagePattern,
  UserSentence,
  FeedbackResult,
  SavedExpression,
  LearningLog
};
