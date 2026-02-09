export type Trail = {
  name: string;
  modules: string[];
  keywords: string[];
};

export type Category = {
  id: 1 | 2 | 3;
  name: string;
  keywords: string[];
  trails: Trail[];
};

export const decisionTree: Category[] = [
  {
    id: 1,
    name: "Minha cabeça está um caos",
    keywords: [
      "confuso",
      "confusa",
      "caos",
      "perdido",
      "perdida",
      "sem foco",
      "sobrecarga",
      "ansioso",
      "ansiosa",
      "prioridade",
      "decidir"
    ],
    trails: [
      {
        name: "Clareza no meu papel de líder",
        modules: [
          "Comece por aqui",
          "O meu papel de líder",
          "Foco e decisões",
          "Apoio e aprofundamento"
        ],
        keywords: ["liderança", "lider", "equipe", "direção", "papel"]
      },
      {
        name: "Leitura estratégica do negócio",
        modules: [
          "Comece por aqui",
          "Entendendo o cenário atual",
          "Onde o negócio ganha e perde energia",
          "Apoio e aprofundamento"
        ],
        keywords: ["estratégia", "cenário", "diagnóstico", "energia"]
      },
      {
        name: "Definindo prioridades",
        modules: [
          "Comece por aqui",
          "Separando o que importa do que confunde",
          "Decisões estratégicas na prática",
          "Quando NÃO decidir também é uma decisão",
          "Apoio e aprofundamento"
        ],
        keywords: ["prioridades", "decisão", "decisões", "foco", "tarefas"]
      }
    ]
  },
  {
    id: 2,
    name: "Meu negócio depende muito de mim",
    keywords: [
      "depende de mim",
      "centralizado",
      "tudo passa por mim",
      "operacional",
      "excesso",
      "delegar",
      "processo",
      "sobrecarga"
    ],
    trails: [
      {
        name: "Raio X operacional",
        modules: [
          "Comece por aqui",
          "Onde tudo passa por mim",
          "Riscos invisíveis do dia-a-dia",
          "Apoio e aprofundamento"
        ],
        keywords: ["operacional", "processos", "rotina", "bastidores"]
      },
      {
        name: "Preciso estruturar antes de escalar",
        modules: [
          "Comece por aqui",
          "O mínimo que sustenta o crescimento",
          "Organizando sem burocratizar",
          "Apoio e aprofundamento"
        ],
        keywords: ["escalar", "crescimento", "estrutura", "organizar"]
      },
      {
        name: "Dependência de pessoas-chave",
        modules: [
          "Comece por aqui",
          "Onde o negócio está frágil",
          "Reduzindo riscos",
          "Apoio e aprofundamento"
        ],
        keywords: ["pessoas-chave", "dependência", "risco", "time"]
      }
    ]
  },
  {
    id: 3,
    name: "Não tenho muita certeza dos meus números",
    keywords: [
      "números",
      "resultado",
      "financeiro",
      "faturamento",
      "previsibilidade",
      "vendas",
      "receita",
      "margem",
      "lucro"
    ],
    trails: [
      {
        name: "Diagnóstico comercial",
        modules: [
          "Comece por aqui",
          "O que os números estão dizendo",
          "Onde o resultado pode se perder",
          "Apoio e aprofundamento"
        ],
        keywords: ["diagnóstico", "números", "resultado", "performance"]
      },
      {
        name: "Estrutura comercial essencial",
        modules: [
          "Comece por aqui",
          "O mínimo para ter previsibilidade",
          "Organizando as vendas sem travar o time",
          "Apoio e aprofundamento"
        ],
        keywords: ["previsibilidade", "vendas", "crm", "pipeline"]
      },
      {
        name: "Experiência do cliente e retenção",
        modules: [
          "Comece por aqui",
          "O que faz o seu cliente ficar (ou sair)",
          "Sustentando os resultados ao longo do tempo",
          "Apoio e aprofundamento"
        ],
        keywords: ["cliente", "retenção", "churn", "experiência"]
      }
    ]
  }
];
