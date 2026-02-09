import { FastifyInstance } from "fastify";
import { z } from "zod";
import { runTriage } from "../services/triageService";

const businessContextSchema = z
  .object({
    segment: z.string().optional(),
    team_size: z.enum(["solo", "small", "mid", "large"]).optional(),
    monthly_revenue_range: z.string().optional(),
    has_sales_team: z.boolean().optional(),
    has_crm: z.boolean().optional()
  })
  .optional();

const triageSchema = z.object({
  user_message: z.string().min(1),
  business_context: businessContextSchema
});

export const triageRoutes = async (app: FastifyInstance) => {
  app.post("/v1/triage", async (request, reply) => {
    const parseResult = triageSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        error: "Invalid payload",
        details: parseResult.error.flatten()
      });
    }

    const result = runTriage(parseResult.data);
    return reply.send(result);
  });
};
