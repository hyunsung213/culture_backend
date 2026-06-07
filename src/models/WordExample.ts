import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize
} from "sequelize";

export class WordExample extends Model<
  InferAttributes<WordExample>,
  InferCreationAttributes<WordExample>
> {
  declare id: CreationOptional<string>;
  declare wordId: string;
  declare exampleKo: string;
  declare exampleEn: string;
  declare exampleType: string;
  declare source: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initWordExampleModel = (sequelize: Sequelize): typeof WordExample => {
  WordExample.init(
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
      exampleKo: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      exampleEn: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      exampleType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["spoken", "formal", "writing"]]
        }
      },
      source: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      tableName: "word_examples",
      modelName: "WordExample",
      timestamps: true
    }
  );

  return WordExample;
};
