import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize
} from "sequelize";

export class UserSentence extends Model<
  InferAttributes<UserSentence>,
  InferCreationAttributes<UserSentence>
> {
  declare id: CreationOptional<string>;
  declare userId: CreationOptional<string | null>;
  declare wordId: CreationOptional<string | null>;
  declare originalSentence: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initUserSentenceModel = (sequelize: Sequelize): typeof UserSentence => {
  UserSentence.init(
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
      originalSentence: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      tableName: "user_sentences",
      modelName: "UserSentence",
      timestamps: true
    }
  );

  return UserSentence;
};
