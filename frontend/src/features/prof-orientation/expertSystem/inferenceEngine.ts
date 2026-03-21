import { QUESTIONS, CAREER_PROFILES, RULES } from './knowledgeBase';
import type { TraitKey, ExpertResult, CareerMatch, FiredRule } from './types';
import { TRAIT_LABELS } from './types';

// ─── Likert scale multipliers ─────────────────────────────────────────────────
// Answer values: 0=Нет, 1=Скорее нет, 2=Не уверен, 3=Скорее да, 4=Да
const LIKERT_MUL = [0, 0.25, 0.5, 0.75, 1.0];

// ─── Step 1: Calculate trait scores from answers ──────────────────────────────
function computeMaxRaw(): Record<TraitKey, number> {
  const max = {} as Record<TraitKey, number>;
  for (const q of QUESTIONS) {
    for (const tc of q.traits) {
      max[tc.key] = (max[tc.key] ?? 0) + tc.weight;
    }
  }
  return max;
}
const MAX_RAW = computeMaxRaw();

export function calculateTraitScores(
  answers: Record<number, number>,
): Record<TraitKey, number> {
  const raw = {} as Record<TraitKey, number>;
  for (const q of QUESTIONS) {
    const v = answers[q.id];
    if (v === undefined) continue;
    const mul = LIKERT_MUL[v] ?? 0;
    for (const tc of q.traits) {
      raw[tc.key] = (raw[tc.key] ?? 0) + tc.weight * mul;
    }
  }
  // Normalize 0–10
  const out = {} as Record<TraitKey, number>;
  for (const key of Object.keys(MAX_RAW) as TraitKey[]) {
    out[key] = MAX_RAW[key] > 0
      ? Math.round(((raw[key] ?? 0) / MAX_RAW[key]) * 10 * 10) / 10
      : 0;
  }
  return out;
}

// ─── Step 2: Evaluate rule conditions ────────────────────────────────────────
function evaluate(traits: Record<TraitKey, number>, career: string): FiredRule[] {
  const fired: FiredRule[] = [];
  for (const rule of RULES) {
    if (rule.career !== career) continue;
    const allMet = rule.conditions.every(c => {
      const v = traits[c.trait] ?? 0;
      if (c.op === '>=') return v >= c.value;
      if (c.op === '>') return v > c.value;
      if (c.op === '<=') return v <= c.value;
      if (c.op === '<') return v < c.value;
      return false;
    });
    if (allMet) fired.push({ id: rule.id, description: rule.description, cf: rule.cf });
  }
  return fired;
}

// ─── Step 3: MYCIN certainty factor combination ───────────────────────────────
// For N independent positive rules: CF_combined = 1 − ∏(1 − CF_i)
// Applied pairwise: CF_new = CF_old + CF_rule × (1 − CF_old)
function combineCF(firedRules: FiredRule[]): number {
  if (firedRules.length === 0) return 0;
  let combined = firedRules[0].cf;
  for (let i = 1; i < firedRules.length; i++) {
    combined = combined + firedRules[i].cf * (1 - combined);
  }
  return combined;
}

// ─── Step 4: Build strengths / gaps from traits ───────────────────────────────
function buildStrengthsGaps(
  traits: Record<TraitKey, number>,
  firedRules: FiredRule[],
  career: string,
): { strengths: string[]; gaps: string[] } {
  // Collect all traits referenced in fired rules for this career
  const referencedTraits = new Set<TraitKey>();
  for (const rule of RULES) {
    if (rule.career !== career) continue;
    if (firedRules.some(fr => fr.id === rule.id)) {
      rule.conditions.forEach(c => referencedTraits.add(c.trait));
    }
  }

  const strengths: string[] = [];
  const gaps: string[] = [];

  for (const t of referencedTraits) {
    const score = traits[t] ?? 0;
    if (score >= 7) {
      strengths.push(`${TRAIT_LABELS[t]} — ${score.toFixed(1)}/10`);
    } else if (score < 5) {
      gaps.push(`Развить: ${TRAIT_LABELS[t].toLowerCase()} (${score.toFixed(1)}/10)`);
    }
  }

  return {
    strengths: strengths.slice(0, 3),
    gaps: gaps.slice(0, 2),
  };
}

// ─── Step 5: Personality profile from dominant traits ────────────────────────
const PROFILES: Array<{
  dominant: [TraitKey, TraitKey];
  title: string;
  description: string;
}> = [
  { dominant: ['logical', 'technical'], title: 'Инженер-мыслитель',
    description: 'Ты сочетаешь техническую глубину с аналитическим умом. Твоя суперсила — разбираться в сложных системах и находить элегантные технические решения там, где другие видят хаос.' },
  { dominant: ['logical', 'analytical'], title: 'Аналитик данных',
    description: 'Ты мыслишь структурами и паттернами. Данные для тебя — не просто числа, а источник ценных инсайтов. Ты рождён превращать информацию в знание.' },
  { dominant: ['creative', 'detail'], title: 'Дизайнер-перфекционист',
    description: 'Ты видишь красоту в деталях. Твои работы сочетают эстетику с точностью. Ты не успокоишься, пока каждый элемент не встанет на своё место.' },
  { dominant: ['social', 'managerial'], title: 'Лидер проектов',
    description: 'Ты прирождённый лидер — умеешь объединять людей, ставить цели и вести команду к результату. Под твоим руководством задачи выполняются вовремя.' },
  { dominant: ['technical', 'detail'], title: 'Специалист по качеству',
    description: 'Ты не терпишь несовершенства. Твой взгляд замечает то, что другие пропускают. Это делает тебя незаменимым везде, где важна надёжность.' },
  { dominant: ['research', 'technical'], title: 'Технологический исследователь',
    description: 'Тебя привлекают новые технологии — и ты их быстро осваиваешь. Горизонт твоих знаний постоянно расширяется. Ты всегда на острие прогресса.' },
  { dominant: ['social', 'analytical'], title: 'Бизнес-консультант',
    description: 'Ты понимаешь людей и видишь скрытые закономерности в процессах. Умеешь слышать «боль» бизнеса и переводить её в конкретные решения.' },
  { dominant: ['managerial', 'risk'], title: 'Предприниматель',
    description: 'Ты не боишься рисковать и брать ответственность. В неопределённости ты чувствуешь себя как рыба в воде. Стартапы — твоя стихия.' },
  { dominant: ['creative', 'social'], title: 'Коммуникатор-творец',
    description: 'Ты совмещаешь творческое мышление с умением работать с людьми. Ты создаёшь вещи, которые находят отклик у аудитории.' },
  { dominant: ['analytical', 'managerial'], title: 'Стратегический мыслитель',
    description: 'Ты видишь картину целиком и умеешь планировать наперёд. Твои решения основаны на данных, а не на интуиции.' },
  { dominant: ['logical', 'creative'], title: 'Системный изобретатель',
    description: 'Ты умеешь мыслить чётко и нестандартно одновременно. Ты строишь системы, которые работают красиво — и технически, и визуально.' },
  { dominant: ['research', 'analytical'], title: 'Исследователь',
    description: 'Ты любишь разбираться в новом и находить в этом смысл. Твоё любопытство — твоё главное преимущество в мире, который меняется каждый год.' },
];

const FALLBACK_PROFILES: Partial<Record<TraitKey, { title: string; description: string }>> = {
  logical: { title: 'Системный аналитик', description: 'Ты мыслишь логически и системно. Сложные задачи — твоя стихия.' },
  analytical: { title: 'Аналитик', description: 'Ты умеешь находить смысл в данных и делать выводы.' },
  technical: { title: 'Технический специалист', description: 'Тебе нравится разбираться в том, как устроены системы.' },
  creative: { title: 'Творческая личность', description: 'Ты мыслишь нестандартно и создаёшь оригинальные решения.' },
  social: { title: 'Коммуникатор', description: 'Ты умеешь строить отношения и работать с людьми.' },
  managerial: { title: 'Организатор', description: 'Ты умеешь управлять процессами и вести за собой других.' },
  research: { title: 'Исследователь', description: 'Ты постоянно учишься и любишь открывать новое.' },
  detail: { title: 'Перфекционист', description: 'Ты внимателен к деталям и не терпишь поверхностных решений.' },
  risk: { title: 'Новатор', description: 'Ты готов рисковать и пробовать то, что другие боятся.' },
};

function buildProfile(dominant: TraitKey[]): { title: string; description: string } {
  const [t1, t2] = dominant as [TraitKey, TraitKey];
  for (const p of PROFILES) {
    if (p.dominant.includes(t1) && p.dominant.includes(t2)) return p;
  }
  return FALLBACK_PROFILES[t1] ?? { title: 'Универсал', description: 'У тебя разносторонние способности.' };
}

// ─── Main entry: run the expert system ───────────────────────────────────────
export function runExpertSystem(answers: Record<number, number>): ExpertResult {
  // 1. Calculate normalized trait scores (working memory facts)
  const traitScores = calculateTraitScores(answers);

  // 2. Forward chaining: evaluate all production rules per career
  const matches: CareerMatch[] = [];
  for (const career of CAREER_PROFILES) {
    const firedRules = evaluate(traitScores, career.id);
    if (firedRules.length === 0) continue;

    // 3. Combine certainty factors (MYCIN formula)
    const cf = combineCF(firedRules);
    const confidence = Math.min(100, Math.round(cf * 100));

    // 4. Build explanation
    const { strengths, gaps } = buildStrengthsGaps(traitScores, firedRules, career.id);

    matches.push({ career, cf, confidence, firedRules, strengths, gaps });
  }

  // 5. Sort by CF descending, take top 6
  const topMatches = matches.sort((a, b) => b.cf - a.cf).slice(0, 6);

  // 6. Personality profile
  const sortedTraits = (Object.entries(traitScores) as [TraitKey, number][])
    .sort((a, b) => b[1] - a[1]);
  const dominantTraits = sortedTraits.slice(0, 3).map(([k]) => k);
  const { title, description } = buildProfile(dominantTraits);

  return { traitScores, topMatches, profileTitle: title, profileDescription: description, dominantTraits };
}
