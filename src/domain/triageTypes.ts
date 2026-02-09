export type BusinessContext = {
  segment?: string;
  team_size?: "solo" | "small" | "mid" | "large";
  monthly_revenue_range?: string;
  has_sales_team?: boolean;
  has_crm?: boolean;
};

export type TriageInput = {
  user_message: string;
  business_context?: BusinessContext;
};

export type TriageOutput = {
  category: {
    id: 1 | 2 | 3;
    name: string;
  };
  primary_trail: {
    name: string;
    modules: string[];
  };
  secondary_trail: {
    name: string;
    modules: string[];
  } | null;
  confidence: number;
  reasoning_short: string[];
  missing_questions: string[];
  next_step: {
    module_to_start: string;
    action: string;
  };
};
