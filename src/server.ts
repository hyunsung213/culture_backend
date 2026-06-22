import app from "./app";
import { env } from "./config/env";
import { testDatabaseConnection } from "./config/database";
import { MOCK_USER_ID } from "./middlewares/mockAuth.middleware";
import { initModels, sequelize, User, Word } from "./models";
import { hashSecret } from "./utils/password.util";
import { seedWords } from "./seed/seedWords";

const ensureMockUser = async (): Promise<void> => {
  await User.findOrCreate({
    where: { id: MOCK_USER_ID },
    defaults: {
      id: MOCK_USER_ID,
      loginId: "demo",
      email: "demo@ieung.app",
      name: "Demo User",
      provider: "email",
      passwordHash: await hashSecret("demo1234"),
      quizQuestion: "데모 계정의 정답은?",
      quizAnswerHash: await hashSecret("demo"),
      nativeLanguage: "en",
      koreanLevel: "intermediate"
    }
  });
};

const seedIfEmpty = async (): Promise<void> => {
  const wordCount = await Word.count();
  if (wordCount === 0) {
    await seedWords();
  }
};

const prepareRuntime = async (): Promise<void> => {
  initModels();
  await testDatabaseConnection();
  await sequelize.sync();

  await ensureMockUser();
  await seedIfEmpty();
};

const startServer = (): void => {
  const server = app.listen(env.PORT, "0.0.0.0", () => {
    console.log(`Ieung main backend server listening on port ${env.PORT}`);
  });

  server.on("error", (error) => {
    console.error("Failed to bind server port:", error);
    process.exit(1);
  });

  try {
    void prepareRuntime().catch((error) => {
      console.error("Failed to prepare server runtime:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
