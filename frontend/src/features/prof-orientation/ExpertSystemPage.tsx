'use client';

import { useState, useEffect } from 'react';
import { QUESTIONS } from './expertSystem/knowledgeBase';
import { runExpertSystem } from './expertSystem/inferenceEngine';
import { TRAIT_LABELS, TRAIT_COLORS, TRAIT_ICONS } from './expertSystem/types';
import type { ExpertResult, TraitKey, CareerMatch } from './expertSystem/types';
import { useAuth } from '@/shared/lib/auth-context';
import { useSubmitExpertResult } from '@/shared/api/prof-orientation';

const LIKERT_OPTIONS = [
  { label: 'Нет',        active: 'border-red-500    bg-red-500/15    text-red-300'    },
  { label: 'Скорее нет', active: 'border-orange-500 bg-orange-500/15 text-orange-300' },
  { label: 'Не уверен',  active: 'border-gray-400   bg-gray-500/15   text-gray-200'   },
  { label: 'Скорее да',  active: 'border-blue-400   bg-blue-500/15   text-blue-300'   },
  { label: 'Да',         active: 'border-green-500  bg-green-500/15  text-green-300'  },
];

const DEMAND_LABELS = { high: 'Высокий спрос', medium: 'Средний спрос', low: 'Стабильный спрос' };
const DEMAND_COLORS = { high: 'text-green-400',  medium: 'text-yellow-400', low: 'text-gray-400' };

const STAGE_INFO: Record<number, { label: string; icon: string }> = {
  1: { label: 'Как ты мыслишь', icon: '🧩' },
  2: { label: 'Твои реакции',   icon: '⚡' },
  3: { label: 'Как ты работаешь', icon: '💼' },
  4: { label: 'Честно о себе',  icon: '🪞' },
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2904';

async function fetchRoadmap(match: CareerMatch, token: string | null) {
  const res = await fetch(`${API_BASE}/professional-orientation/roadmap`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      careerId: match.career.id,
      careerTitle: match.career.title,
      traitScores: {},
      firedRuleDescriptions: match.firedRules.map(r => r.description),
      confidence: match.confidence,
    }),
  });
  if (!res.ok) throw new Error('Ошибка генерации дорожной карты');
  return res.json();
}

// ─── Roadmap component ────────────────────────────────────────────────────────
function RoadmapView({ match, onClose }: { match: CareerMatch; onClose: () => void }) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRoadmap(match, token);
      setRoadmap(data);
    } catch (e: any) {
      setError(e.message ?? 'Что-то пошло не так');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#30363d]">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{match.career.icon}</span>
            <div>
              <p className="text-xs text-gray-500">Дорожная карта</p>
              <h3 className="text-white font-semibold">{match.career.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-[#21262d] transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          {!roadmap && !loading && !error && (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🗺️</div>
              <p className="text-gray-300 font-medium mb-2">Построим твой путь к профессии</p>
              <p className="text-gray-500 text-sm mb-6">
                ИИ составит персонализированную дорожную карту с учётом твоего профиля,
                сильных сторон и областей для роста
              </p>
              <button
                onClick={load}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
              >
                Сгенерировать дорожную карту
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 text-gray-400">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span className="text-sm">Составляю персональный маршрут…</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
              <p className="text-red-400 text-sm mb-3">{error}</p>
              <button onClick={load} className="text-xs text-red-300 hover:text-red-200 underline">
                Попробовать снова
              </button>
            </div>
          )}

          {roadmap && (
            <div className="space-y-5">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#21262d] rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Общий срок</p>
                  <p className="text-white font-semibold text-sm">{roadmap.totalDuration}</p>
                </div>
                <div className="bg-[#21262d] rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Совпадение профиля</p>
                  <p className="text-green-400 font-semibold text-sm">{match.confidence}%</p>
                </div>
              </div>

              {/* Personal advice */}
              {roadmap.advice && (
                <div className="bg-blue-500/8 border border-blue-500/25 rounded-xl p-4">
                  <p className="text-xs text-blue-400 font-medium mb-1">Персональный совет</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{roadmap.advice}</p>
                </div>
              )}

              {/* Phases */}
              <div className="space-y-3">
                {roadmap.phases?.map((phase: any, i: number) => (
                  <div key={i} className="border border-[#30363d] rounded-xl overflow-hidden">
                    <div className="flex items-center gap-3 p-4 bg-[#21262d]">
                      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm">{phase.title}</p>
                        <p className="text-gray-500 text-xs">{phase.duration} · {phase.focus}</p>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1.5 font-medium">Цели</p>
                        <ul className="space-y-1">
                          {phase.goals?.map((g: string, j: number) => (
                            <li key={j} className="text-xs text-gray-300 flex items-start gap-1.5">
                              <span className="text-blue-400 mt-0.5 flex-shrink-0">→</span>{g}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1.5 font-medium">Ресурсы</p>
                        <div className="flex flex-wrap gap-1.5">
                          {phase.resources?.map((r: string, j: number) => (
                            <span key={j} className="text-xs bg-[#21262d] text-blue-300 px-2 py-1 rounded-lg border border-[#30363d]">{r}</span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-green-500/8 border border-green-500/20 rounded-lg p-3">
                        <p className="text-xs text-green-400 font-medium mb-0.5">Результат фазы</p>
                        <p className="text-xs text-gray-300">{phase.milestone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* First step */}
              {roadmap.firstStep && (
                <div className="bg-yellow-500/8 border border-yellow-500/25 rounded-xl p-4">
                  <p className="text-xs text-yellow-400 font-medium mb-1">⚡ Первый шаг — прямо сейчас</p>
                  <p className="text-gray-300 text-sm">{roadmap.firstStep}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CareerOrientationPage() {
  const [step, setStep] = useState<'welcome' | 'questions' | 'results'>('welcome');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<ExpertResult | null>(null);
  const [expandedCareer, setExpandedCareer] = useState<string | null>(null);
  const [roadmapMatch, setRoadmapMatch] = useState<CareerMatch | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const { token } = useAuth();
  const { submit: submitExpert } = useSubmitExpertResult();

  const currentQ = QUESTIONS[currentIdx];
  const totalQ = QUESTIONS.length;
  const progress = Math.round((currentIdx / totalQ) * 100);

  // Сохранение результатов при переходе на вкладку результатов
  useEffect(() => {
    if (step === 'results' && result && token && !isSaved && !isSaving) {
      saveResults();
    }
  }, [step, result, token]);

  async function saveResults() {
    if (!result || !token) return;
    
    setIsSaving(true);
    try {
      await submitExpert({
        profileTitle: result.profileTitle,
        profileDescription: result.profileDescription,
        dominantTraits: result.dominantTraits,
        traitScores: result.traitScores,
        topMatches: result.topMatches.map(m => ({
          careerId: m.career.id,
          careerTitle: m.career.title,
          confidence: m.confidence,
        })),
      });
      setIsSaved(true);
    } catch (error) {
      console.error('Ошибка сохранения результатов:', error);
    } finally {
      setIsSaving(false);
    }
  }

  function handleConfirm() {
    if (selected === null) return;
    const newAnswers = { ...answers, [currentQ.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);
    if (currentIdx + 1 >= totalQ) {
      setResult(runExpertSystem(newAnswers));
      setStep('results');
    } else {
      setCurrentIdx(i => i + 1);
    }
  }

  function goBack() {
    if (currentIdx > 0) {
      setCurrentIdx(i => i - 1);
      setSelected(answers[QUESTIONS[currentIdx - 1].id] ?? null);
    }
  }

  function restart() {
    setStep('welcome');
    setCurrentIdx(0);
    setAnswers({});
    setSelected(null);
    setResult(null);
    setExpandedCareer(null);
    setRoadmapMatch(null);
    setIsSaving(false);
    setIsSaved(false);
  }

  // ── Welcome ────────────────────────────────────────────────────────────────
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl mb-6">
              <span className="text-4xl">🧭</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3 leading-snug">
              Какая IT-профессия<br />тебе подойдёт?
            </h1>
            <p className="text-gray-400 leading-relaxed">
              Ответь честно на 40 вопросов о том, как ты думаешь и работаешь.
              Мы предложим направления, где ты будешь расти с удовольствием —
              и построим дорожную карту.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {Object.values(STAGE_INFO).map(({ label, icon }) => (
              <div key={label} className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <span className="text-sm text-gray-300 font-medium">{label}</span>
              </div>
            ))}
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 mb-6 flex items-start gap-3">
            <span className="text-blue-400 mt-0.5">ℹ️</span>
            <p className="text-sm text-gray-400 leading-relaxed">
              Нет правильных или неправильных ответов. Чем честнее ты отвечаешь,
              тем точнее будет результат и дорожная карта.
            </p>
          </div>

          <button
            onClick={() => setStep('questions')}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-lg"
          >
            Начать →
          </button>
          <p className="text-center text-xs text-gray-600 mt-4">
            40 вопросов · ~7 минут · 12 направлений
          </p>
        </div>
      </div>
    );
  }

  // ── Questions ──────────────────────────────────────────────────────────────
  if (step === 'questions') {
    const stageNum = currentQ.stage;
    const stageInfo = STAGE_INFO[stageNum];

    return (
      <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center p-4">
        <div className="max-w-xl w-full">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">{stageInfo.icon} {stageInfo.label}</span>
              <span className="text-xs text-gray-500">{currentIdx + 1} / {totalQ}</span>
            </div>
            <div className="w-full bg-[#21262d] rounded-full h-1">
              <div className="bg-blue-500 h-1 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex gap-1.5 mt-3 justify-center">
              {[1, 2, 3, 4].map(s => {
                const isDone = s < stageNum;
                const isActive = s === stageNum;
                const sLen = QUESTIONS.filter(q => q.stage === s).length;
                const answered = QUESTIONS.filter(q => q.stage === s && answers[q.id] !== undefined).length;
                return (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all duration-300 ${isDone ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-[#30363d]'}`}
                    style={{ width: isActive ? `${(answered / sLen) * 40 + 20}px` : '20px' }}
                  />
                );
              })}
            </div>
          </div>

          {/* Question */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 mb-3">
            <p className="text-white text-lg font-medium leading-relaxed mb-6">
              {currentQ.text}
            </p>
            <div className="flex flex-col gap-2">
              {LIKERT_OPTIONS.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all duration-150 ${
                    selected === i
                      ? opt.active
                      : 'border-[#30363d] text-gray-400 hover:border-[#58a6ff]/50 hover:text-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            {currentIdx > 0 && (
              <button
                onClick={goBack}
                className="px-4 py-3 border border-[#30363d] text-gray-500 hover:text-gray-300 hover:border-[#58a6ff] rounded-xl text-sm transition-colors"
              >
                ← Назад
              </button>
            )}
            <button
              onClick={handleConfirm}
              disabled={selected === null}
              className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {currentIdx + 1 === totalQ ? 'Завершить →' : 'Далее →'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Results ────────────────────────────────────────────────────────────────
  if (!result) return null;

  const confColor = (c: number) => c >= 75 ? 'text-green-400' : c >= 55 ? 'text-yellow-400' : 'text-orange-400';
  const confBg    = (c: number) => c >= 75 ? 'bg-green-500'   : c >= 55 ? 'bg-yellow-500'   : 'bg-orange-500';

  return (
    <div className="min-h-screen bg-[#0d1117] text-white py-8 px-4">
      {roadmapMatch && (
        <RoadmapView match={roadmapMatch} onClose={() => setRoadmapMatch(null)} />
      )}

      <div className="max-w-3xl mx-auto">
        {/* Status indicator */}
        <div className="mb-4 flex items-center justify-center gap-2">
          {isSaving ? (
            <div className="flex items-center gap-2 text-blue-400 text-sm">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Сохранение результатов...</span>
            </div>
          ) : isSaved ? (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Результаты сохранены</span>
            </div>
          ) : !token ? (
            <div className="text-gray-500 text-sm">Войдите, чтобы сохранить результаты</div>
          ) : null}
        </div>

        {/* Profile */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1a2030] to-[#161b22] border border-[#30363d] rounded-2xl p-6 mb-5">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full -mr-10 -mt-10 pointer-events-none" />
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-blue-500/15 border border-blue-500/30 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">🪞</div>
            <div className="flex-1">
              <p className="text-xs text-blue-400 font-medium uppercase tracking-wider mb-1">Твой профиль</p>
              <h2 className="text-xl font-bold text-white mb-2">{result.profileTitle}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{result.profileDescription}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {result.dominantTraits.map(t => (
              <span key={t} className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: TRAIT_COLORS[t] + '20', color: TRAIT_COLORS[t], border: `1px solid ${TRAIT_COLORS[t]}40` }}>
                {TRAIT_ICONS[t]} {TRAIT_LABELS[t]}
              </span>
            ))}
          </div>
        </div>

        {/* Trait bars */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 mb-5">
          <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wide">Характеристики</h3>
          <div className="space-y-3">
            {(Object.entries(result.traitScores) as [TraitKey, number][])
              .sort((a, b) => b[1] - a[1])
              .map(([key, score]) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-base w-5 text-center flex-shrink-0">{TRAIT_ICONS[key]}</span>
                  <div className="w-40 text-xs text-gray-400 flex-shrink-0 truncate">{TRAIT_LABELS[key]}</div>
                  <div className="flex-1 bg-[#21262d] rounded-full h-1.5">
                    <div className="h-1.5 rounded-full transition-all"
                      style={{ width: `${score * 10}%`, background: TRAIT_COLORS[key] }} />
                  </div>
                  <span className="text-xs font-semibold w-8 text-right flex-shrink-0" style={{ color: TRAIT_COLORS[key] }}>
                    {score.toFixed(1)}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Career matches */}
        <h3 className="font-semibold text-white mb-3">Подходящие направления</h3>
        <div className="space-y-2 mb-8">
          {result.topMatches.map((match, i) => (
            <div key={match.career.id} className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden">
              {/* Header row */}
              <button
                className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-[#1c2128] transition-colors"
                onClick={() => setExpandedCareer(expandedCareer === match.career.id ? null : match.career.id)}
              >
                <div className="w-8 text-center flex-shrink-0">
                  {i === 0 ? <span className="text-yellow-400 font-bold text-lg">①</span>
                   : i === 1 ? <span className="text-gray-400 font-bold text-lg">②</span>
                   : <span className="text-gray-600 text-sm font-medium">{i + 1}</span>}
                </div>
                <div className="w-10 h-10 bg-[#21262d] rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {match.career.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm">{match.career.title}</div>
                  <div className="text-gray-500 text-xs mt-0.5 truncate">{match.career.description}</div>
                </div>
                <div className="text-right flex-shrink-0 mr-2">
                  <div className={`text-xl font-bold ${confColor(match.confidence)}`}>{match.confidence}%</div>
                  <div className="text-xs text-gray-600">CF={match.cf.toFixed(2)}</div>
                </div>
                <svg className={`w-4 h-4 text-gray-600 flex-shrink-0 transition-transform ${expandedCareer === match.career.id ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* CF bar */}
              <div className="h-0.5 bg-[#21262d]">
                <div className={`h-0.5 ${confBg(match.confidence)}`} style={{ width: `${match.confidence}%` }} />
              </div>

              {/* Expanded */}
              {expandedCareer === match.career.id && (
                <div className="px-5 py-4 border-t border-[#21262d] space-y-4">
                  {/* Fired rules (the "why") */}
                  <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4">
                    <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">
                      Почему эта профессия ({match.firedRules.length} {match.firedRules.length === 1 ? 'правило' : match.firedRules.length < 5 ? 'правила' : 'правил'})
                    </p>
                    <ul className="space-y-2">
                      {match.firedRules.map(rule => (
                        <li key={rule.id} className="flex items-start gap-2">
                          <span className="text-xs font-mono text-blue-500 flex-shrink-0 mt-0.5">{rule.id}</span>
                          <span className="text-xs text-gray-300">{rule.description}</span>
                          <span className="text-xs text-gray-600 flex-shrink-0 ml-auto">CF={rule.cf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="bg-[#21262d] rounded-xl p-3">
                      <div className="text-xs text-gray-500 mb-1">Зарплата</div>
                      <div className="text-sm text-green-400 font-medium">{match.career.salaryRange}</div>
                    </div>
                    <div className="bg-[#21262d] rounded-xl p-3">
                      <div className="text-xs text-gray-500 mb-1">Спрос</div>
                      <div className={`text-sm font-medium ${DEMAND_COLORS[match.career.demand]}`}>
                        {DEMAND_LABELS[match.career.demand]}
                      </div>
                    </div>
                    <div className="bg-[#21262d] rounded-xl p-3">
                      <div className="text-xs text-gray-500 mb-1">Потолок</div>
                      <div className="text-xs text-gray-300">{match.career.growthPath[match.career.growthPath.length - 1]}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-2 font-medium">Ключевые навыки</div>
                      <div className="flex flex-wrap gap-1.5">
                        {match.career.skills.map(s => (
                          <span key={s} className="text-xs bg-[#21262d] text-gray-300 px-2 py-1 rounded-lg">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-2 font-medium">Инструменты</div>
                      <div className="flex flex-wrap gap-1.5">
                        {match.career.tools.map(t => (
                          <span key={t} className="text-xs bg-[#21262d] text-blue-300 px-2 py-1 rounded-lg">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {(match.strengths.length > 0 || match.gaps.length > 0) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {match.strengths.length > 0 && (
                        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-3">
                          <div className="text-xs text-green-400 font-medium mb-2">Твои сильные стороны</div>
                          <ul className="space-y-1">
                            {match.strengths.map(s => (
                              <li key={s} className="text-xs text-gray-400 flex items-start gap-1.5">
                                <span className="text-green-500 mt-0.5">✓</span>{s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {match.gaps.length > 0 && (
                        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
                          <div className="text-xs text-yellow-400 font-medium mb-2">Что стоит развить</div>
                          <ul className="space-y-1">
                            {match.gaps.map(g => (
                              <li key={g} className="text-xs text-gray-400 flex items-start gap-1.5">
                                <span className="text-yellow-500 mt-0.5">→</span>{g}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Career path */}
                  <div>
                    <div className="text-xs text-gray-500 mb-2 font-medium">Карьерный путь</div>
                    <div className="flex items-center gap-1 flex-wrap">
                      {match.career.growthPath.map((stage, idx) => (
                        <div key={stage} className="flex items-center gap-1">
                          <span className={`text-xs px-2 py-1 rounded-lg ${idx === 0 ? 'bg-blue-500/15 text-blue-300' : 'bg-[#21262d] text-gray-400'}`}>
                            {stage}
                          </span>
                          {idx < match.career.growthPath.length - 1 && <span className="text-gray-600 text-xs">→</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Roadmap button */}
                  <button
                    onClick={() => setRoadmapMatch(match)}
                    className="w-full py-3 flex items-center justify-center gap-2 rounded-xl border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 transition-colors text-sm font-medium"
                  >
                    🗺️ Построить дорожную карту с помощью ИИ
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center pb-4">
          <button onClick={restart} className="px-6 py-3 border border-[#30363d] hover:border-[#58a6ff] text-gray-400 hover:text-white rounded-xl text-sm transition-colors">
            Пройти заново
          </button>
        </div>
      </div>
    </div>
  );
}
