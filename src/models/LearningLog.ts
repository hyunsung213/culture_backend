import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize
} from "sequelize";

export class LearningLog extends Model<
  InferAttributes<LearningLog>,
  InferCreationAttributes<LearningLog>
> {
  declare id: CreationOptional<string>;
  declare userId: CreationOptional<string | null>;
  declare wordId: CreationOptional<string | null>;
  declare status: string;
  declare completedAt: CreationOptional<Date | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initLearningLogModel = (sequelize: Sequelize): typeof LearningLog => {
  LearningLog.init(
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
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["started", "completed"]]
        }
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      tableName: "learning_logs",
      modelName: "LearningLog",
      timestamps: true
    }
  );

  return LearningLog;
};
