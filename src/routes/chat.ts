import { FastifyInstance } from "fastify";
import { z } from "zod";
import { runTriage } from "../services/triageService";
import { runChatCompletion } from "../services/openaiService";

const chatSchema = z.object({
  user_message: z.string().min(1),
  business_context: z
    .object({
      segment: z.string().optional(),
      team_size: z.enum(["solo", "small", "mid", "large"]).optional(),
      monthly_revenue_range: z.string().optional(),
      has_sales_team: z.boolean().optional(),
      has_crm: z.boolean().optional()
    })
    .optional()
});

export const chatRoutes = async (app: FastifyInstance) => {
  app.post("/v1/chat", async (request, reply) => {
    const parseResult = chatSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        error: "Invalid payload",
        details: parseResult.error.flatten()
      });
    }

    const localTriage = runTriage(parseResult.data);

    try {
      const response = await runChatCompletion(parseResult.data, localTriage);
      return reply.send(response);
    } catch (error) {
      request.log.error({ err: error }, "Erro ao chamar OpenAI");
      return reply.status(500).send({
        error: "Falha ao gerar resposta",
        triage: localTriage
      });
    }
  });
};
