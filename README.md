# advize-triage-api

API REST em Node.js + TypeScript para triagem e recomendação de trilhas ADVIZE.

## Requisitos
- Node.js 18+

## Como rodar localmente

```bash
npm install
npm run dev
```

A API sobe em `http://localhost:3000`.

## Variáveis de ambiente

Crie um `.env` baseado em `.env.example`:

```
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
RATE_LIMIT_MAX=30
RATE_LIMIT_WINDOW_MS=60000
```

## Endpoints

### GET /health

**Resposta**

```json
{ "status": "ok" }
```

### POST /v1/triage

**Request**

```json
{
  "user_message": "Estou com dificuldade para decidir prioridades e meu time depende de mim",
  "business_context": {
    "segment": "serviços",
    "team_size": "small",
    "monthly_revenue_range": "50k-100k",
    "has_sales_team": false,
    "has_crm": false
  }
}
```

**Response**

```json
{
  "category": { "id": 2, "name": "Meu negócio depende muito de mim" },
  "primary_trail": {
    "name": "Raio X operacional",
    "modules": [
      "Comece por aqui",
      "Onde tudo passa por mim",
      "Riscos invisíveis do dia-a-dia",
      "Apoio e aprofundamento"
    ]
  },
  "secondary_trail": null,
  "confidence": 0.7,
  "reasoning_short": [
    "Encontramos sinais compatíveis com a categoria escolhida.",
    "Tamanho de time informado: small."
  ],
  "missing_questions": ["Você usa algum CRM hoje?"],
  "next_step": {
    "module_to_start": "Comece por aqui",
    "action": "Iniciar pela trilha \"Raio X operacional\" e completar o módulo inicial."
  }
}
```

### POST /v1/chat

**Request**

```json
{
  "user_message": "Meu faturamento oscilou muito e não sei o que os números querem dizer",
  "business_context": {
    "segment": "varejo",
    "team_size": "mid",
    "monthly_revenue_range": "100k-200k",
    "has_sales_team": true,
    "has_crm": true
  }
}
```

**Response**

```json
{
  "assistant_message": "Entendi. Antes de recomendar a trilha, me conta: qual métrica te preocupa mais hoje?",
  "triage": {
    "category": { "id": 3, "name": "Não tenho muita certeza dos meus números" },
    "primary_trail": {
      "name": "Diagnóstico comercial",
      "modules": [
        "Comece por aqui",
        "O que os números estão dizendo",
        "Onde o resultado pode se perder",
        "Apoio e aprofundamento"
      ]
    },
    "secondary_trail": null,
    "confidence": 0.75,
    "reasoning_short": ["Oscilações e dúvidas financeiras indicam necessidade de diagnóstico."],
    "missing_questions": ["Qual é a faixa de faturamento mensal?"],
    "next_step": {
      "module_to_start": "Comece por aqui",
      "action": "Iniciar pela trilha \"Diagnóstico comercial\" e completar o módulo inicial."
    }
  }
}
```

## Observações
- A chave da OpenAI é lida de `OPENAI_API_KEY` no backend e nunca deve ser exposta no front-end.
- O rate limit simples é baseado em IP e controlado por `RATE_LIMIT_MAX` e `RATE_LIMIT_WINDOW_MS`.
- Payloads são validados com Zod.
