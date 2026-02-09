import { decisionTree } from "../domain/decisionTree";
import { TriageInput, TriageOutput } from "../domain/triageTypes";

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

const countKeywordMatches = (text: string, keywords: string[]) =>
  keywords.reduce((count, keyword) =>
    text.includes(normalizeText(keyword)) ? count + 1 : count, 0);

const buildMissingQuestions = (input: TriageInput): string[] => {
  const questions: string[] = [];
  const context = input.business_context;

  if (!context?.segment) {
    questions.push("Qual é o segmento do seu negócio?");
  }
  if (!context?.team_size) {
    questions.push("Qual é o tamanho atual do seu time?");
  }
  if (!context?.monthly_revenue_range) {
    questions.push("Qual é a faixa de faturamento mensal?");
  }
  if (context?.has_sales_team === undefined) {
    questions.push("Você já possui time de vendas?");
  }
  if (context?.has_crm === undefined) {
    questions.push("Você usa algum CRM hoje?");
  }

  return questions;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const runTriage = (input: TriageInput): TriageOutput => {
  const text = normalizeText(input.user_message || "");

  const categoryScores = decisionTree.map((category) => {
    const keywordHits = countKeywordMatches(text, category.keywords);
    let contextBoost = 0;
    const context = input.business_context;

    if (category.id === 2 && context?.team_size === "solo") {
      contextBoost += 2;
    }
    if (category.id === 3 && context?.has_crm === false) {
      contextBoost += 1;
    }
    if (category.id === 3 && context?.has_sales_team === false) {
      contextBoost += 1;
    }

    return {
      category,
      score: keywordHits + contextBoost
    };
  });

  const sortedCategories = [...categoryScores].sort((a, b) => b.score - a.score);
  const topCategory = sortedCategories[0]?.category ?? decisionTree[0];

  const trailScores = topCategory.trails.map((trail) => {
    const keywordHits = countKeywordMatches(text, trail.keywords);
    return { trail, score: keywordHits };
  });

  const sortedTrails = trailScores.sort((a, b) => b.score - a.score);
  const primaryTrail = sortedTrails[0]?.trail ?? topCategory.trails[0];
  const secondaryTrail = sortedTrails[1]?.score ? sortedTrails[1].trail : null;

  const totalTopScore = sortedCategories[0]?.score ?? 0;
  const runnerUpScore = sortedCategories[1]?.score ?? 0;
  const confidence = clamp(
    totalTopScore === 0 ? 0.4 : 0.6 + (totalTopScore - runnerUpScore) * 0.1,
    0.3,
    0.95
  );

  const reasoning: string[] = [];
  if (totalTopScore > 0) {
    reasoning.push("Encontramos sinais compatíveis com a categoria escolhida.");
  }
  if (input.business_context?.team_size) {
    reasoning.push(`Tamanho de time informado: ${input.business_context.team_size}.`);
  }
  if (!reasoning.length) {
    reasoning.push("Poucos sinais claros; assumimos uma trilha inicial para orientar.");
  }

  const missingQuestions = buildMissingQuestions(input);

  return {
    category: {
      id: topCategory.id,
      name: topCategory.name
    },
    primary_trail: {
      name: primaryTrail.name,
      modules: primaryTrail.modules
    },
    secondary_trail: secondaryTrail
      ? { name: secondaryTrail.name, modules: secondaryTrail.modules }
      : null,
    confidence,
    reasoning_short: reasoning.slice(0, 3),
    missing_questions: missingQuestions.slice(0, 4),
    next_step: {
      module_to_start: "Comece por aqui",
      action: `Iniciar pela trilha "${primaryTrail.name}" e completar o módulo inicial.`
    }
  };
};
