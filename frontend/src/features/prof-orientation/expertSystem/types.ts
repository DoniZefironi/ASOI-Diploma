export type TraitKey =
  | 'logical'
  | 'analytical'
  | 'technical'
  | 'creative'
  | 'social'
  | 'managerial'
  | 'research'
  | 'detail'
  | 'risk';

export const TRAIT_LABELS: Record<TraitKey, string> = {
  logical: 'Логическое мышление',
  analytical: 'Аналитика и данные',
  technical: 'Техническая склонность',
  creative: 'Творческое мышление',
  social: 'Коммуникабельность',
  managerial: 'Лидерство и организация',
  research: 'Самообучаемость',
  detail: 'Внимание к деталям',
  risk: 'Готовность к риску',
};

export const TRAIT_COLORS: Record<TraitKey, string> = {
  logical: '#3b82f6',
  analytical: '#8b5cf6',
  technical: '#06b6d4',
  creative: '#f59e0b',
  social: '#10b981',
  managerial: '#ef4444',
  research: '#a855f7',
  detail: '#6b7280',
  risk: '#f97316',
};

export const TRAIT_ICONS: Record<TraitKey, string> = {
  logical: '🧮',
  analytical: '📊',
  technical: '⚙️',
  creative: '🎨',
  social: '🤝',
  managerial: '🎯',
  research: '📚',
  detail: '🔍',
  risk: '🚀',
};

// ─── Expert System types ──────────────────────────────────────────────────────

// 5-point Likert: 0=Нет, 1=Скорее нет, 2=Не уверен, 3=Скорее да, 4=Да
// multipliers: [0, 0.25, 0.5, 0.75, 1.0]
export type Stage = 1 | 2 | 3 | 4;

export interface TraitContribution {
  key: TraitKey;
  weight: number;
}

export interface Question {
  id: number;
  text: string;
  stage: Stage;
  stageLabel: string;
  traits: TraitContribution[];
}

// ─── Production rule (IF conditions THEN career, CF) ─────────────────────────
export interface Condition {
  trait: TraitKey;
  op: '>=' | '>' | '<=' | '<';
  value: number; // normalized 0–10
}

export interface Rule {
  id: string;
  career: string; // career profile id
  cf: number; // certainty factor 0.0–1.0
  description: string; // human-readable explanation shown to user
  conditions: Condition[]; // ALL must be satisfied (AND logic)
}

// ─── Career profiles ──────────────────────────────────────────────────────────
export interface CareerProfile {
  id: string;
  title: string;
  icon: string;
  description: string;
  longDescription: string;
  salaryRange: string;
  demand: 'high' | 'medium' | 'low';
  skills: string[];
  tools: string[];
  growthPath: string[];
}

// ─── Inference results ───────────────────────────────────────────────────────
export interface FiredRule {
  id: string;
  description: string;
  cf: number;
}

export interface CareerMatch {
  career: CareerProfile;
  cf: number; // combined MYCIN certainty factor 0–1
  confidence: number; // cf * 100 rounded
  firedRules: FiredRule[]; // which rules triggered this career
  strengths: string[]; // top traits contributing
  gaps: string[]; // traits below expected
}

export interface ExpertResult {
  traitScores: Record<TraitKey, number>; // 0–10 normalized
  topMatches: CareerMatch[];
  profileTitle: string;
  profileDescription: string;
  dominantTraits: TraitKey[];
}
