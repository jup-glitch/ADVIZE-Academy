import Fastify from "fastify";
import { chatRoutes } from "./routes/chat";
import { healthRoutes } from "./routes/health";
import { triageRoutes } from "./routes/triage";
import { RateLimiter } from "./utils/rateLimiter";

const rateLimitMax = Number(process.env.RATE_LIMIT_MAX ?? 30);
const rateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000);
const rateLimiter = new RateLimiter(rateLimitMax, rateLimitWindowMs);

export const buildServer = () => {
  const app = Fastify({
    logger: true,
    trustProxy: true
  });

  app.addHook("onRequest", async (request, reply) => {
    const ip = request.ip || "unknown";
    const limit = rateLimiter.check(ip);

    reply.header("X-RateLimit-Limit", rateLimitMax);
    reply.header("X-RateLimit-Remaining", limit.remaining);
    reply.header("X-RateLimit-Reset", Math.ceil(limit.resetInMs / 1000));

    if (!limit.allowed) {
      return reply.status(429).send({
        error: "Too Many Requests",
        message: "Limite de requisições excedido. Tente novamente em instantes."
      });
    }
  });

  app.register(healthRoutes);
  app.register(triageRoutes);
  app.register(chatRoutes);

  return app;
};
