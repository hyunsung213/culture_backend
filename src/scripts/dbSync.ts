import { testDatabaseConnection } from "../config/database";
import { initModels, sequelize } from "../models";

const runDbSync = async (): Promise<void> => {
  try {
    initModels();
    await testDatabaseConnection();
    await sequelize.sync({ alter: true });

    const tables = Object.keys(sequelize.models);
    console.log("Database connection OK.");
    console.log(`Synced models: ${tables.join(", ")}`);
  } catch (error) {
    console.error("Database sync failed:", error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

void runDbSync();
