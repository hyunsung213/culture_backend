import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize
} from "sequelize";

export class Word extends Model<InferAttributes<Word>, InferCreationAttributes<Word>> {
  declare id: CreationOptional<string>;
  declare korean: string;
  declare type: CreationOptional<string>;
  declare partOfSpeech: CreationOptional<string>;
  declare romanization: string;
  declare englishTitle: string;
  declare shortMeaningKo: string;
  declare shortMeaningEn: string;
  declare fullMeaningKo: string;
  declare fullMeaningEn: string;
  declare usageTip: string;
  declare difficulty: CreationOptional<string>;
  declare tags: CreationOptional<string[]>;
  declare sortOrder: CreationOptional<number | null>;
  declare cultureNote: CreationOptional<string | null>;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initWordModel = (sequelize: Sequelize): typeof Word => {
  Word.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      korean: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "word"
      },
      partOfSpeech: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "명사"
      },
      romanization: {
        type: DataTypes.STRING,
        allowNull: false
      },
      englishTitle: {
        type: DataTypes.STRING,
        allowNull: false
      },
      shortMeaningKo: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      shortMeaningEn: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      fullMeaningKo: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      fullMeaningEn: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      usageTip: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      difficulty: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "intermediate"
      },
      tags: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: []
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      cultureNote: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      tableName: "words",
      modelName: "Word",
      timestamps: true
    }
  );

  return Word;
};
