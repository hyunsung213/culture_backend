import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize
} from "sequelize";

export class SavedExpression extends Model<
  InferAttributes<SavedExpression>,
  InferCreationAttributes<SavedExpression>
> {
  declare id: CreationOptional<string>;
  declare userId: CreationOptional<string | null>;
  declare wordId: CreationOptional<string | null>;
  declare userSentenceId: CreationOptional<string | null>;
  declare feedbackResultId: CreationOptional<string | null>;
  declare originalSentence: string;
  declare savedExpression: string;
  declare memo: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initSavedExpressionModel = (sequelize: Sequelize): typeof SavedExpression => {
  SavedExpression.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true
      },
      wordId: {
        type: DataTypes.UUID,
        allowNull: true
      },
      userSentenceId: {
        type: DataTypes.UUID,
        allowNull: true
      },
      feedbackResultId: {
        type: DataTypes.UUID,
        allowNull: true
      },
      originalSentence: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      savedExpression: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      memo: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      tableName: "saved_expressions",
      modelName: "SavedExpression",
      timestamps: true
    }
  );

  return SavedExpression;
};
