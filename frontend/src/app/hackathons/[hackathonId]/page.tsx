'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { hackathonsApi, Hackathon, HackathonTeam, HackathonStage, CreateTeamDto } from '@/shared/api/hackathons';
import { useAuth } from '@/shared/lib/auth-context';

// ── Styles ─────────────────────────────────────────────────────────
const S = {
  bg: '#0d1117', surface: '#161b22', border: '#30363d',
  text: '#e6edf3', muted: '#8b949e', accent: '#2f81f7',
  success: '#3fb950', danger: '#f85149', warning: '#e3b341',
  purple: '#a371f7', cyan: '#39c5cf',
};

// ── Icons ──────────────────────────────────────────────────────────
const CalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0ZM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5Z"/>
  </svg>
);
const PeopleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.57 4.111.75.75 0 1 1-1.498.101 3.51 3.51 0 0 0-2.984-3.187L11 9.5a.75.75 0 0 1 0-1.5A1.5 1.5 0 0 0 11 5.5a.75.75 0 0 1 0-1.5ZM5.5 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>
  </svg>
);
const TrophyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M10.737 2.5H13A1.5 1.5 0 0 1 14.5 4v.5c0 1.32-.76 2.463-1.875 3.006a4.995 4.995 0 0 1-2.813 3.072L9.5 11.5v1h1.25a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1 0-1.5H6.5v-1l-.312-.922A4.995 4.995 0 0 1 3.375 7.506 3.5 3.5 0 0 1 1.5 4.5V4A1.5 1.5 0 0 1 3 2.5h2.263A4.498 4.498 0 0 1 8 2c.98 0 1.887.31 2.737.5ZM3 4v.5c0 .832.397 1.572 1.01 2.04A3.5 3.5 0 0 1 3.5 4.5v-.5H3a.5.5 0 0 0 0 1V4ZM13 4a.5.5 0 0 0-.5-.5H12v.5c0 .744-.215 1.438-.586 2.025A2.5 2.5 0 0 0 13 4Zm-5 5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/>
  </svg>
);
const BookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.062 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-5.073-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z"/>
  </svg>
);
const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
  </svg>
);
const TagIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M1 7.775V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.752 1.752 0 0 1 1 7.775Zm1.5 0c0 .066.026.13.073.177l6.25 6.25a.25.25 0 0 0 .354 0l5.025-5.025a.25.25 0 0 0 0-.354l-6.25-6.25a.25.25 0 0 0-.177-.073H2.75a.25.25 0 0 0-.25.25ZM6 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/>
  </svg>
);
const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"/>
  </svg>
);
const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"/>
  </svg>
);
const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8.75 1.75a.75.75 0 0 0-1.5 0V7H3.25c-.41 0-.6.4-.34.65l4.75 4.75a.47.47 0 0 0 .68 0l4.75-4.75c.26-.25.07-.65-.34-.65H8.75V1.75Zm-6 9.5h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5Z"/>
  </svg>
);

// ── Helpers ────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getStatus(h: Hackathon) {
  const now = new Date();
  const start = new Date(h.startDate), end = new Date(h.endDate);
  const reg = h.registrationDeadline ? new Date(h.registrationDeadline) : null;
  if (now > end) return { key: 'completed', label: 'Завершён', color: S.muted, bg: 'rgba(139,148,158,0.1)', border: 'rgba(139,148,158,0.25)' };
  if (now >= start) return { key: 'active', label: '● Идёт', color: S.success, bg: 'rgba(63,185,80,0.1)', border: 'rgba(63,185,80,0.3)' };
  if (reg && now > reg) return { key: 'reg-closed', label: 'Регистрация закрыта', color: S.warning, bg: 'rgba(227,179,65,0.1)', border: 'rgba(227,179,65,0.3)' };
  return { key: 'registration', label: '● Регистрация', color: S.accent, bg: 'rgba(47,129,247,0.1)', border: 'rgba(47,129,247,0.3)' };
}

// ── StageTimeline ──────────────────────────────────────────────────
function StageTimeline({ stages }: { stages: HackathonStage[] }) {
  const [openStages, setOpenStages] = useState<Record<number, boolean>>(
    Object.fromEntries(stages.map((_, i) => [i, true]))
  );

  const toggle = (i: number) => setOpenStages(s => ({ ...s, [i]: !s[i] }));

  const stageColors = [S.accent, S.success, S.purple, S.warning, S.cyan, S.danger];

  return (
    <div>
      {stages.map((stage, si) => {
        const color = stageColors[si % stageColors.length];
        const open = openStages[si];
        const totalScore = stage.tasks?.reduce((s, t) => s + (t.maxScore || 0), 0) || 0;

        return (
          <div key={stage.id} style={{ display: 'flex', gap: 0, marginBottom: si < stages.length - 1 ? 0 : 0 }}>
            {/* Timeline line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 32, flexShrink: 0 }}>
              <div style={{
                width: 12, height: 12, borderRadius: '50%',
                background: color, border: `2px solid ${color}`, boxShadow: `0 0 0 3px ${color}22`,
                marginTop: 14, flexShrink: 0,
              }} />
              {si < stages.length - 1 && (
                <div style={{ width: 2, flex: 1, background: `${S.border}`, minHeight: 20 }} />
              )}
            </div>

            {/* Stage card */}
            <div style={{
              flex: 1, marginBottom: 16,
              background: S.surface, border: `1px solid ${S.border}`,
              borderRadius: 8, overflow: 'hidden',
            }}>
              {/* Stage header */}
              <button
                type="button"
                onClick={() => toggle(si)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: open ? `1px solid ${S.border}` : 'none',
                  textAlign: 'left',
                }}
              >
                <span style={{
                  fontSize: 10, fontWeight: 700, color, padding: '2px 8px',
                  background: `${color}1a`, border: `1px solid ${color}40`,
                  borderRadius: 12, whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                  ЭТАП {si + 1}
                </span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: S.text }}>{stage.title}</span>
                {stage.tasks?.length > 0 && (
                  <span style={{ fontSize: 11, color: S.muted, flexShrink: 0 }}>
                    {stage.tasks.length} задан. · {totalScore} балл.
                  </span>
                )}
                {(stage.startDate || stage.endDate) && (
                  <span style={{ fontSize: 11, color: S.muted, display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <CalIcon />
                    {stage.startDate ? formatDate(stage.startDate) : '?'} — {stage.endDate ? formatDate(stage.endDate) : '?'}
                  </span>
                )}
                <span style={{ color: S.muted }}>{open ? <ChevronDownIcon /> : <ChevronRightIcon />}</span>
              </button>

              {open && (
                <div style={{ padding: '12px 16px' }}>
                  {stage.description && (
                    <p style={{ fontSize: 13, color: S.muted, marginBottom: 12, lineHeight: 1.6 }}>{stage.description}</p>
                  )}

                  {stage.tasks?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {stage.tasks.map((task, ti) => (
                        <div key={task.id} style={{
                          background: S.bg, border: `1px solid ${S.border}`,
                          borderRadius: 6, padding: '12px 14px',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: task.description || task.scoringCriteria ? 8 : 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{
                                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                                background: `${color}1a`, border: `1px solid ${color}40`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 10, fontWeight: 700, color,
                              }}>
                                {ti + 1}
                              </span>
                              <span style={{ fontSize: 13, fontWeight: 700, color: S.text }}>{task.title}</span>
                            </div>
                            <div style={{
                              display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
                              padding: '2px 10px', borderRadius: 12,
                              background: 'rgba(227,179,65,0.1)', border: '1px solid rgba(227,179,65,0.3)',
                              fontSize: 11, fontWeight: 700, color: S.warning,
                            }}>
                              <StarIcon /> {task.maxScore} балл.
                            </div>
                          </div>

                          {task.description && (
                            <p style={{ fontSize: 12, color: S.muted, marginLeft: 30, marginBottom: task.scoringCriteria ? 8 : 0, lineHeight: 1.6 }}>
                              {task.description}
                            </p>
                          )}

                          {task.scoringCriteria && (
                            <div style={{
                              marginLeft: 30,
                              background: 'rgba(47,129,247,0.05)', border: `1px solid rgba(47,129,247,0.15)`,
                              borderRadius: 6, padding: '8px 12px',
                            }}>
                              <div style={{ fontSize: 10, fontWeight: 700, color: S.accent, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Критерии оценивания
                              </div>
                              <p style={{ fontSize: 12, color: S.muted, lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' }}>
                                {task.scoringCriteria}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: 12, color: S.muted }}>Задания этапа не указаны</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────
export default function HackathonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [hackathonId, setHackathonId] = useState<number | null>(null);
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [teams, setTeams] = useState<HackathonTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [rankings, setRankings] = useState<any[]>([]);
  const [userTeam, setUserTeam] = useState<HackathonTeam | null>(null);
  const [teamSubmission, setTeamSubmission] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'stages' | 'rules' | 'teams'>('overview');

  useEffect(() => {
    if (params?.hackathonId) setHackathonId(parseInt(params.hackathonId as string));
    else router.push('/hackathons');
  }, [params, router]);

  useEffect(() => { if (hackathonId) loadData(); }, [hackathonId]);

  const loadData = async () => {
    if (!hackathonId) return;
    try {
      const [hData, rankData, userTeamsData] = await Promise.all([
        hackathonsApi.getOne(hackathonId),
        hackathonsApi.getRankings(hackathonId).catch(() => []),
        hackathonsApi.getUserTeams().catch(() => []),
      ]);
      setHackathon(hData);
      setTeams(hData?.teams || []);
      setRankings(rankData || []);
      const ut = userTeamsData?.find((t: any) => t.hackathonId === hackathonId);
      setUserTeam(ut || null);
      if (ut) {
        hackathonsApi.getTeamSubmission(ut.id).then(setTeamSubmission).catch(() => setTeamSubmission(null));
      }
    } catch { /* ignore */ }
    finally { setIsLoading(false); }
  };

  if (isLoading) return (
    <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.muted }}>
      Загрузка...
    </div>
  );
  if (!hackathon) return (
    <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.muted }}>
      Хакатон не найден
    </div>
  );

  const status = getStatus(hackathon);
  const canRegister = status.key === 'registration';
  const isActive = status.key === 'active';
  const isLeader = userTeam && user?.id && String(userTeam.leaderId) === String(user.id);
  const stages = hackathon.stages || [];
  const totalTaskScore = stages.reduce((s, st) => s + (st.tasks || []).reduce((ss, t) => ss + (t.maxScore || 0), 0), 0);

  const tabs = [
    { key: 'overview', label: 'Обзор' },
    ...(stages.length > 0 ? [{ key: 'stages', label: `Этапы (${stages.length})` }] : []),
    ...(hackathon.rules ? [{ key: 'rules', label: 'Правила' }] : []),
    { key: 'teams', label: `Команды (${teams.length})` },
  ] as const;

  return (
    <div style={{ minHeight: '100vh', background: S.bg, color: S.text, fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px 64px' }}>

        {/* Back link */}
        <Link href="/hackathons" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: S.muted, fontSize: 13, textDecoration: 'none', marginBottom: 20 }}>
          ← Все хакатоны
        </Link>

        {/* Header card */}
        <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 10, padding: '24px 28px', marginBottom: 0, borderBottom: 'none', borderRadius: '10px 10px 0 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{
                padding: '3px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                color: status.color, background: status.bg, border: `1px solid ${status.border}`,
              }}>
                {status.label}
              </span>
              {hackathon.theme && (
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px',
                  borderRadius: 12, fontSize: 12, color: S.purple,
                  background: 'rgba(163,113,247,0.1)', border: '1px solid rgba(163,113,247,0.25)',
                }}>
                  <TagIcon /> {hackathon.theme}
                </span>
              )}
            </div>
            {hackathon.prizePool && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 8, background: 'rgba(227,179,65,0.08)', border: '1px solid rgba(227,179,65,0.2)' }}>
                <TrophyIcon />
                <span style={{ color: S.warning, fontWeight: 700, fontSize: 16 }}>
                  {Number(hackathon.prizePool).toLocaleString('ru-RU')} ₽
                </span>
              </div>
            )}
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 700, color: S.text, margin: '0 0 10px' }}>{hackathon.title}</h1>
          <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 800 }}>{hackathon.description}</p>

          {/* Meta row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, borderTop: `1px solid ${S.border}`, paddingTop: 16 }}>
            <MetaItem icon={<CalIcon />} label="Начало" value={formatDateTime(hackathon.startDate)} />
            <MetaItem icon={<CalIcon />} label="Конец" value={formatDateTime(hackathon.endDate)} />
            {hackathon.registrationDeadline && (
              <MetaItem icon={<CalIcon />} label="Регистрация до" value={formatDateTime(hackathon.registrationDeadline)} />
            )}
            <MetaItem icon={<PeopleIcon />} label="Команда" value={`${hackathon.minTeamSize}–${hackathon.maxTeamSize} чел.`} />
            {stages.length > 0 && <MetaItem icon={<BookIcon />} label="Этапов" value={String(stages.length)} />}
            {totalTaskScore > 0 && <MetaItem icon={<StarIcon />} label="Макс. баллов" value={String(totalTaskScore)} />}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ background: S.surface, borderLeft: `1px solid ${S.border}`, borderRight: `1px solid ${S.border}`, borderBottom: `1px solid ${S.border}`, display: 'flex', gap: 0, overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '10px 18px', background: 'none', border: 'none',
                borderBottom: activeTab === tab.key ? `2px solid ${S.accent}` : '2px solid transparent',
                color: activeTab === tab.key ? S.text : S.muted,
                fontSize: 13, fontWeight: activeTab === tab.key ? 600 : 400,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action bar — registration */}
        {user && (canRegister || isActive || userTeam) && (
          <div style={{
            background: S.surface, border: `1px solid ${S.border}`, borderTop: 'none',
            borderRadius: '0 0 8px 8px', padding: '14px 20px',
            display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 20,
          }}>
            {userTeam ? (
              <>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px',
                  borderRadius: 6, background: 'rgba(63,185,80,0.1)', border: '1px solid rgba(63,185,80,0.3)',
                }}>
                  <CheckIcon />
                  <span style={{ color: S.success, fontSize: 13, fontWeight: 600 }}>Команда: {userTeam.name}</span>
                  {userTeam.members && (
                    <span style={{ color: S.muted, fontSize: 12 }}>· {userTeam.members.length}/{hackathon.maxTeamSize} уч.</span>
                  )}
                </div>
                <Link href={`/hackathons/${hackathonId}/team/${userTeam.id}`}
                  style={{ padding: '7px 16px', borderRadius: 6, background: S.bg, border: `1px solid ${S.border}`, color: S.text, fontSize: 13, textDecoration: 'none' }}>
                  Страница команды
                </Link>
                {isActive && isLeader && (
                  <button onClick={() => setShowSubmitModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 6, background: S.accent, border: 'none', color: '#fff', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                    <UploadIcon /> {teamSubmission ? 'Обновить проект' : 'Сдать проект'}
                  </button>
                )}
              </>
            ) : canRegister ? (
              <>
                <button onClick={() => setShowCreateTeamModal(true)}
                  style={{ padding: '7px 18px', borderRadius: 6, background: S.accent, border: 'none', color: '#fff', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                  Создать команду
                </button>
                <button onClick={() => setShowJoinModal(true)}
                  style={{ padding: '7px 16px', borderRadius: 6, background: S.surface, border: `1px solid ${S.border}`, color: S.text, fontSize: 13, cursor: 'pointer' }}>
                  Присоединиться
                </button>
              </>
            ) : null}
          </div>
        )}

        {/* Tab content */}
        <div style={{ marginTop: 20 }}>
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: stages.length > 0 ? '1fr 300px' : '1fr', gap: 20 }}>
              {/* Left: judging criteria */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {hackathon.judgingCriteria && (
                  <Section title="Критерии оценивания" icon="⬡" color={S.accent}>
                    {typeof hackathon.judgingCriteria === 'object' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {Object.entries(hackathon.judgingCriteria).map(([k, v]) => (
                          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: S.bg, borderRadius: 6, border: `1px solid ${S.border}` }}>
                            <span style={{ fontSize: 13, color: S.text, textTransform: 'capitalize' }}>{k}</span>
                            <span style={{ fontSize: 13, color: S.accent, fontWeight: 700 }}>{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: 13, color: S.muted, whiteSpace: 'pre-line', lineHeight: 1.7 }}>{String(hackathon.judgingCriteria)}</p>
                    )}
                  </Section>
                )}

                {stages.length > 0 && (
                  <Section title="Структура хакатона" icon="📋" color={S.cyan}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {stages.map((s, i) => {
                        const pts = (s.tasks || []).reduce((sum, t) => sum + (t.maxScore || 0), 0);
                        return (
                          <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: S.bg, borderRadius: 6, border: `1px solid ${S.border}` }}>
                            <div>
                              <span style={{ fontSize: 11, color: S.accent, fontWeight: 700, marginRight: 8 }}>Этап {i + 1}</span>
                              <span style={{ fontSize: 13, color: S.text }}>{s.title}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                              {s.tasks?.length > 0 && <span style={{ fontSize: 11, color: S.muted }}>{s.tasks.length} задан.</span>}
                              {pts > 0 && <span style={{ fontSize: 11, color: S.warning, fontWeight: 600 }}>{pts} балл.</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Section>
                )}
              </div>

              {/* Right: quick info sidebar */}
              {stages.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 8, padding: '14px 16px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Быстрая информация</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <InfoRow label="Статус" value={<span style={{ color: status.color }}>{status.label}</span>} />
                      <InfoRow label="Этапов" value={stages.length} />
                      <InfoRow label="Заданий" value={stages.reduce((s, st) => s + (st.tasks?.length || 0), 0)} />
                      {totalTaskScore > 0 && <InfoRow label="Макс. баллов" value={totalTaskScore} />}
                      <InfoRow label="Размер команды" value={`${hackathon.minTeamSize}–${hackathon.maxTeamSize}`} />
                      <InfoRow label="Участвует команд" value={teams.length} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stages' && stages.length > 0 && (
            <div>
              <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(47,129,247,0.06)', border: `1px solid rgba(47,129,247,0.2)`, borderRadius: 8, fontSize: 13, color: S.muted }}>
                Хакатон разбит на <strong style={{ color: S.text }}>{stages.length} этапа</strong>. Всего заданий: <strong style={{ color: S.text }}>{stages.reduce((s, st) => s + (st.tasks?.length || 0), 0)}</strong>. Максимальный суммарный балл: <strong style={{ color: S.warning }}>{totalTaskScore}</strong>.
              </div>
              <StageTimeline stages={stages} />
            </div>
          )}

          {activeTab === 'rules' && hackathon.rules && (
            <Section title="Правила участия" icon="📜" color={S.purple}>
              <div style={{ fontSize: 14, color: S.muted, lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {hackathon.rules}
              </div>
            </Section>
          )}

          {activeTab === 'teams' && (
            <div>
              {status.key === 'completed' && rankings.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <PodiumSection rankings={rankings} />
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                {teams.length === 0 ? (
                  <p style={{ color: S.muted, fontSize: 14, gridColumn: '1/-1', textAlign: 'center', padding: 32 }}>
                    Команд пока нет
                  </p>
                ) : teams.map(team => (
                  <Link key={team.id} href={`/hackathons/${hackathonId}/team/${team.id}`}
                    style={{
                      display: 'block', textDecoration: 'none',
                      background: S.surface, border: `1px solid ${S.border}`, borderRadius: 8, padding: '14px 16px',
                    }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: S.text, marginBottom: 6 }}>{team.name}</div>
                    {team.projectName && <div style={{ fontSize: 12, color: S.accent, marginBottom: 6 }}>{team.projectName}</div>}
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: S.muted, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <PeopleIcon /> {team.members?.length || 0}/{hackathon.maxTeamSize}
                      </span>
                      {team.submissions && team.submissions.length > 0 && (
                        <span style={{ fontSize: 11, color: S.success, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <CheckIcon /> Сдано
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateTeamModal && hackathonId && (
        <CreateTeamModal hackathonId={hackathonId} onClose={() => setShowCreateTeamModal(false)}
          onSuccess={async (data) => { await hackathonsApi.createTeam(data); setShowCreateTeamModal(false); loadData(); }} />
      )}
      {showJoinModal && (
        <JoinTeamModal teams={teams} onClose={() => setShowJoinModal(false)}
          onSelectTeam={async (team) => {
            if (!confirm(`Присоединиться к команде "${team.name}"?`)) return;
            await hackathonsApi.joinTeam(team.id);
            setShowJoinModal(false); loadData();
          }} />
      )}
      {showSubmitModal && userTeam && (
        <SubmitProjectModal team={userTeam} existingSubmission={teamSubmission}
          onClose={() => setShowSubmitModal(false)}
          onSuccess={() => { setShowSubmitModal(false); loadData(); }} />
      )}
    </div>
  );
}

// ── Helper components ──────────────────────────────────────────────
function MetaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: S.muted, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: S.text }}>{value}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 12, color: S.muted }}>{label}</span>
      <span style={{ fontSize: 12, color: S.text, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function Section({ title, icon, color, children }: { title: string; icon: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${S.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: S.text }}>{title}</span>
      </div>
      <div style={{ padding: '14px 16px' }}>{children}</div>
    </div>
  );
}

// ── Podium ─────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 5;
function PodiumSection({ rankings }: { rankings: any[] }) {
  const [page, setPage] = useState(0);
  const top3 = rankings.slice(0, 3);
  const rest = rankings.slice(3);
  const totalPages = Math.ceil(rest.length / ITEMS_PER_PAGE);
  const paginated = rest.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  const slots = [
    { team: top3[1], medal: '🥈', place: 2, height: 112, color: '#9ea7b3' },
    { team: top3[0], medal: '🥇', place: 1, height: 144, color: S.warning },
    { team: top3[2], medal: '🥉', place: 3, height: 96, color: '#cd7f32' },
  ];
  return (
    <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 8, padding: '20px 24px' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: S.text, marginBottom: 20, textAlign: 'center' }}>Итоги хакатона</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
        {slots.map(({ team, medal, place, height, color }) => {
          if (!team) return <div key={place} style={{ width: 160 }} />;
          return (
            <div key={place} style={{ width: 160, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>{medal}</div>
              <div style={{ width: '100%', background: `${color}18`, border: `1px solid ${color}50`, borderBottom: 'none', borderRadius: '6px 6px 0 0', padding: '10px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: S.text }}>{team.teamName}</div>
                {team.projectName && <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>{team.projectName}</div>}
                <div style={{ fontSize: 22, fontWeight: 700, color, marginTop: 6 }}>{team.totalScore}</div>
                <div style={{ fontSize: 10, color: S.muted }}>баллов</div>
              </div>
              <div style={{ width: '100%', height, background: `${color}10`, border: `1px solid ${color}50`, borderTop: 'none', borderRadius: '0 0 4px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 18, fontWeight: 700, color, opacity: 0.4 }}>{place}</span>
              </div>
            </div>
          );
        })}
      </div>
      {rest.length > 0 && (
        <div>
          {paginated.map((team, i) => (
            <div key={team.teamId} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: S.bg, borderRadius: 6, border: `1px solid ${S.border}`, marginBottom: 4 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: S.muted, width: 20, textAlign: 'right' }}>{page * ITEMS_PER_PAGE + i + 4}</span>
                <span style={{ fontSize: 13, color: S.text }}>{team.teamName}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: S.success }}>{team.totalScore}</span>
            </div>
          ))}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 10 }}>
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                style={{ padding: '4px 12px', background: S.surface, border: `1px solid ${S.border}`, borderRadius: 6, color: S.muted, cursor: 'pointer', fontSize: 12 }}>
                ←
              </button>
              <span style={{ fontSize: 12, color: S.muted, padding: '4px 0' }}>{page + 1}/{totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
                style={{ padding: '4px 12px', background: S.surface, border: `1px solid ${S.border}`, borderRadius: 6, color: S.muted, cursor: 'pointer', fontSize: 12 }}>
                →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Modals (kept from original) ────────────────────────────────────
function CreateTeamModal({ hackathonId, onClose, onSuccess }: { hackathonId: number; onClose: () => void; onSuccess: (d: CreateTeamDto) => void }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', projectName: '', projectDescription: '' });
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try { await onSuccess({ name: form.name, hackathonId, memberIds: user?.id ? [parseInt(user.id)] : [], projectName: form.projectName || undefined, projectDescription: form.projectDescription || undefined }); }
    finally { setLoading(false); }
  };
  return (
    <Modal title="Создать команду" onClose={onClose}>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Field label="Название команды *"><input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={modalInput} /></Field>
        <Field label="Название проекта"><input value={form.projectName} onChange={e => setForm(f => ({ ...f, projectName: e.target.value }))} style={modalInput} /></Field>
        <Field label="Описание проекта"><textarea rows={3} value={form.projectDescription} onChange={e => setForm(f => ({ ...f, projectDescription: e.target.value }))} style={{ ...modalInput, resize: 'vertical', fontFamily: 'inherit' }} /></Field>
        <ModalActions onCancel={onClose} submitLabel={loading ? 'Создание...' : 'Создать'} disabled={loading} />
      </form>
    </Modal>
  );
}

function JoinTeamModal({ teams, onClose, onSelectTeam }: { teams: HackathonTeam[]; onClose: () => void; onSelectTeam: (t: HackathonTeam) => void }) {
  return (
    <Modal title="Присоединиться к команде" onClose={onClose}>
      <div style={{ maxHeight: 360, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {teams.map(t => (
          <button key={t.id} onClick={() => onSelectTeam(t)} style={{ textAlign: 'left', padding: '10px 14px', background: S.bg, border: `1px solid ${S.border}`, borderRadius: 6, cursor: 'pointer', color: S.text }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</div>
            <div style={{ fontSize: 12, color: S.muted }}>👥 {t.members?.length || 0} участников</div>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={onClose} style={{ width: '100%', padding: '8px', background: S.surface, border: `1px solid ${S.border}`, borderRadius: 6, color: S.muted, cursor: 'pointer' }}>Отмена</button>
      </div>
    </Modal>
  );
}

function SubmitProjectModal({ team, existingSubmission, onClose, onSuccess }: { team: HackathonTeam; existingSubmission: any; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ sourceCodeUrl: existingSubmission?.sourceCodeUrl || '', archiveUrl: existingSubmission?.archiveUrl || '', documentationUrl: existingSubmission?.documentationUrl || '', presentationUrl: existingSubmission?.presentationUrl || '', videoDemoUrl: existingSubmission?.videoDemoUrl || '', submissionNote: existingSubmission?.submissionNote || '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { const r = await hackathonsApi.uploadArchive(team.id, file); setForm(f => ({ ...f, archiveUrl: r.archiveUrl })); }
    catch (err: any) { setError(err.message || 'Ошибка загрузки'); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sourceCodeUrl && !form.archiveUrl) { setError('Укажите GitHub или загрузите архив'); return; }
    setLoading(true); setError('');
    try { await hackathonsApi.submitProject({ teamId: team.id, ...form }); onSuccess(); }
    catch (err: any) { setError(err.message || 'Ошибка'); }
    finally { setLoading(false); }
  };

  return (
    <Modal title="Загрузка проекта" onClose={onClose}>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '60vh', overflowY: 'auto', paddingRight: 4 }}>
        <Field label="GitHub / ссылка на код"><input type="url" value={form.sourceCodeUrl} onChange={e => setForm(f => ({ ...f, sourceCodeUrl: e.target.value }))} placeholder="https://github.com/..." style={modalInput} /></Field>
        <Field label="Архив проекта (.zip, макс. 50 МБ)">
          {form.archiveUrl ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'rgba(63,185,80,0.08)', border: '1px solid rgba(63,185,80,0.3)', borderRadius: 6 }}>
              <span style={{ flex: 1, fontSize: 12, color: S.success }}>{form.archiveUrl.split('/').pop()}</span>
              <button type="button" onClick={() => setForm(f => ({ ...f, archiveUrl: '' }))} style={{ background: 'none', border: 'none', color: S.danger, cursor: 'pointer', fontSize: 11 }}>✕</button>
            </div>
          ) : (
            <div onClick={() => fileRef.current?.click()} style={{ padding: '20px', border: `2px dashed ${S.border}`, borderRadius: 6, textAlign: 'center', cursor: 'pointer', color: S.muted, fontSize: 13 }}>
              {uploading ? 'Загрузка...' : 'Нажмите для выбора файла'}
              <input ref={fileRef} type="file" accept=".zip,.tar,.gz,.rar,.7z" hidden onChange={handleUpload} />
            </div>
          )}
        </Field>
        <Field label="Документация"><input type="url" value={form.documentationUrl} onChange={e => setForm(f => ({ ...f, documentationUrl: e.target.value }))} placeholder="https://..." style={modalInput} /></Field>
        <Field label="Презентация"><input type="url" value={form.presentationUrl} onChange={e => setForm(f => ({ ...f, presentationUrl: e.target.value }))} placeholder="https://..." style={modalInput} /></Field>
        <Field label="Видео демо"><input type="url" value={form.videoDemoUrl} onChange={e => setForm(f => ({ ...f, videoDemoUrl: e.target.value }))} placeholder="https://youtube.com/..." style={modalInput} /></Field>
        <Field label="Комментарий"><textarea rows={3} value={form.submissionNote} onChange={e => setForm(f => ({ ...f, submissionNote: e.target.value }))} style={{ ...modalInput, resize: 'vertical', fontFamily: 'inherit' }} /></Field>
        {error && <p style={{ fontSize: 12, color: S.danger }}>{error}</p>}
        <ModalActions onCancel={onClose} submitLabel={loading ? 'Сохранение...' : existingSubmission ? 'Обновить' : 'Загрузить'} disabled={loading || uploading} />
      </form>
    </Modal>
  );
}

// ── Modal primitives ───────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
      <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 10, width: '100%', maxWidth: 540, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${S.border}` }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: S.text }}>{title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: S.muted, cursor: 'pointer', fontSize: 18, padding: 0 }}>✕</button>
        </div>
        <div style={{ padding: '16px 20px', overflowY: 'auto' }}>{children}</div>
      </div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, color: S.muted, marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}
function ModalActions({ onCancel, submitLabel, disabled }: { onCancel: () => void; submitLabel: string; disabled?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 8, paddingTop: 8 }}>
      <button type="button" onClick={onCancel} style={{ flex: 1, padding: '8px', background: S.bg, border: `1px solid ${S.border}`, borderRadius: 6, color: S.muted, cursor: 'pointer' }}>Отмена</button>
      <button type="submit" disabled={disabled} style={{ flex: 1, padding: '8px', background: S.accent, border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', fontWeight: 600, opacity: disabled ? 0.6 : 1 }}>{submitLabel}</button>
    </div>
  );
}
const modalInput: React.CSSProperties = {
  width: '100%', padding: '7px 10px', boxSizing: 'border-box',
  background: S.bg, border: `1px solid ${S.border}`, borderRadius: 6,
  color: S.text, fontSize: 13, outline: 'none',
};
