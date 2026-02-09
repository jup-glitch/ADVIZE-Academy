import "dotenv/config";
import { buildServer } from "./server";

const port = Number(process.env.PORT ?? 3000);

const start = async () => {
  const app = buildServer();
  try {
    await app.listen({ port, host: "0.0.0.0" });
    app.log.info(`Servidor iniciado na porta ${port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
