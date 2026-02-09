import OpenAI from "openai";
import { TriageInput, TriageOutput } from "../domain/triageTypes";

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  console.warn("OPENAI_API_KEY não definido. /v1/chat irá falhar até configurar.");
}

const client = new OpenAI({
  apiKey: openaiApiKey
});

const systemPrompt = `Você é um assistente de triagem para líderes de negócios.
Regras:
- Faça no máximo 2 a 4 perguntas curtas de triagem se necessário.
- Depois forneça uma recomendação completa seguindo o schema solicitado.
- Responda sempre em português.
- Retorne JSON válido. Nunca inclua markdown.
Schema esperado:
{
  "assistant_message": string,
  "triage": {
    "category": { "id": 1|2|3, "name": string },
    "primary_trail": { "name": string, "modules": string[] },
    "secondary_trail": { "name": string, "modules": string[] } | null,
    "confidence": number,
    "reasoning_short": string[],
    "missing_questions": string[],
    "next_step": { "module_to_start": "Comece por aqui", "action": string }
  }
}`;

export const runChatCompletion = async (
  input: TriageInput,
  localTriage: TriageOutput
): Promise<{ assistant_message: string; triage: TriageOutput }> => {
  if (!openaiApiKey) {
    return {
      assistant_message:
        "Ainda não consigo conversar porque a API key não foi configurada, mas já preparei a triagem inicial.",
      triage: localTriage
    };
  }

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Mensagem do usuário: ${input.user_message}\nContexto: ${JSON.stringify(
          input.business_context ?? {}
        )}`
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "advize_triage_response",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            assistant_message: { type: "string" },
            triage: {
              type: "object",
              additionalProperties: false,
              properties: {
                category: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    id: { type: "number" },
                    name: { type: "string" }
                  },
                  required: ["id", "name"]
                },
                primary_trail: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    name: { type: "string" },
                    modules: { type: "array", items: { type: "string" } }
                  },
                  required: ["name", "modules"]
                },
                secondary_trail: {
                  anyOf: [
                    {
                      type: "object",
                      additionalProperties: false,
                      properties: {
                        name: { type: "string" },
                        modules: { type: "array", items: { type: "string" } }
                      },
                      required: ["name", "modules"]
                    },
                    { type: "null" }
                  ]
                },
                confidence: { type: "number" },
                reasoning_short: { type: "array", items: { type: "string" } },
                missing_questions: { type: "array", items: { type: "string" } },
                next_step: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    module_to_start: { type: "string" },
                    action: { type: "string" }
                  },
                  required: ["module_to_start", "action"]
                }
              },
              required: [
                "category",
                "primary_trail",
                "secondary_trail",
                "confidence",
                "reasoning_short",
                "missing_questions",
                "next_step"
              ]
            }
          },
          required: ["assistant_message", "triage"]
        }
      }
    }
  });

  const outputText = response.output_text;
  try {
    const parsed = JSON.parse(outputText) as {
      assistant_message: string;
      triage: TriageOutput;
    };

    return {
      assistant_message: parsed.assistant_message,
      triage: parsed.triage
    };
  } catch (error) {
    console.error("Falha ao interpretar resposta da OpenAI, usando fallback.", error);
    return {
      assistant_message:
        "Obrigado por compartilhar. Preparei uma triagem inicial com base no que você contou.",
      triage: localTriage
    };
  }
};
