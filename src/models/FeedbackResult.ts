import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize
} from "sequelize";

export class FeedbackResult extends Model<
  InferAttributes<FeedbackResult>,
  InferCreationAttributes<FeedbackResult>
> {
  declare id: CreationOptional<string>;
  declare userSentenceId: string;
  declare requestId: CreationOptional<string | null>;
  declare targetWord: string;
  declare score: CreationOptional<number | null>;
  declare summary: string;
  declare meaningFeedback: string;
  declare grammarFeedback: string;
  declare nuanceFeedback: CreationOptional<string | null>;
  declare grammarJson: CreationOptional<Record<string, unknown>>;
  declare meaningJson: CreationOptional<Record<string, unknown>>;
  declare tpoJson: CreationOptional<Record<string, unknown>>;
  declare naturalExpression: CreationOptional<string | null>;
  declare politeExpression: CreationOptional<string | null>;
  declare casualExpression: CreationOptional<string | null>;
  declare writingExpression: CreationOptional<string | null>;
  declare tips: CreationOptional<string[]>;
  declare errorTypes: CreationOptional<string[]>;
  declare referencesJson: CreationOptional<Record<string, unknown>[]>;
  declare rawResponse: CreationOptional<Record<string, unknown>>;
  declare feedbackServerVersion: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initFeedbackResultModel = (sequelize: Sequelize): typeof FeedbackResult => {
  FeedbackResult.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userSentenceId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
      },
      requestId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      targetWord: {
        type: DataTypes.STRING,
        allowNull: false
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      meaningFeedback: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      grammarFeedback: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      nuanceFeedback: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      grammarJson: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {}
      },
      meaningJson: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {}
      },
      tpoJson: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {}
      },
      naturalExpression: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      politeExpression: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      casualExpression: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      writingExpression: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      tips: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: []
      },
      errorTypes: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: []
      },
      referencesJson: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: []
      },
      rawResponse: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {}
      },
      feedbackServerVersion: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      tableName: "feedback_results",
      modelName: "FeedbackResult",
      timestamps: true
    }
  );

  return FeedbackResult;
};
