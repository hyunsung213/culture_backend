import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize
} from "sequelize";

export class WordUsagePattern extends Model<
  InferAttributes<WordUsagePattern>,
  InferCreationAttributes<WordUsagePattern>
> {
  declare id: CreationOptional<string>;
  declare wordId: string;
  declare patternKo: string;
  declare descriptionKo: string;
  declare descriptionEn: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initWordUsagePatternModel = (sequelize: Sequelize): typeof WordUsagePattern => {
  WordUsagePattern.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      wordId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      patternKo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      descriptionKo: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      descriptionEn: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      tableName: "word_usage_patterns",
      modelName: "WordUsagePattern",
      timestamps: true
    }
  );

  return WordUsagePattern;
};
