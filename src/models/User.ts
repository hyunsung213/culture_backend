import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize
} from "sequelize";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare loginId: CreationOptional<string | null>;
  declare email: CreationOptional<string | null>;
  declare name: string;
  declare provider: CreationOptional<string>;
  declare passwordHash: CreationOptional<string | null>;
  declare quizQuestion: CreationOptional<string | null>;
  declare quizAnswerHash: CreationOptional<string | null>;
  declare nativeLanguage: CreationOptional<string | null>;
  declare koreanLevel: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initUserModel = (sequelize: Sequelize): typeof User => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      loginId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "email"
      },
      passwordHash: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      quizQuestion: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      quizAnswerHash: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      nativeLanguage: {
        type: DataTypes.STRING,
        allowNull: true
      },
      koreanLevel: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User",
      timestamps: true
    }
  );

  return User;
};
