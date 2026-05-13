'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { hackathonsApi, Hackathon, HackathonTeam, HackathonStage, CreateTeamDto } from '@/shared/api/hackathons';
import { useAuth } from '@/shared/lib/auth-context';
import { apiClient } from '@/shared/api/client';

// ── Styles ─────────────────────────────────────────────────────────
const S = {
  bg: 'var(--color-canvas-default)', surface: 'var(--color-canvas-overlay)', border: 'var(--color-border-default)',
  text: 'var(--color-fg-default)', muted: 'var(--color-fg-muted)', accent: '#2f81f7',
  success: '#3fb950', danger: '#f85149', warning: '#e3b341',
  purple: '#a371f7', cyan: '#39c5cf',
};

// ── Icons (lucide-react) ───────────────────────────────────────────
import {
  Calendar, Users, Trophy, Check, BookOpen, Star,
  Tag, ChevronDown, ChevronRight, Upload,
} from 'lucide-react';
const CalIcon          = () => <Calendar     size={14} />;
const PeopleIcon       = () => <Users        size={14} />;
const TrophyIcon       = () => <Trophy       size={14} />;
const CheckIcon        = () => <Check        size={14} />;
const BookIcon         = () => <BookOpen     size={14} />;
const StarIcon         = () => <Star         size={13} />;
const TagIcon          = () => <Tag          size={14} />;
const ChevronDownIcon  = () => <ChevronDown  size={14} />;
const ChevronRightIcon = () => <ChevronRight size={14} />;
const UploadIcon       = () => <Upload       size={14} />;

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

// ── StageTimeline + Grades ─────────────────────────────────────────
function TaskReviewerBadges({ taskId }: { taskId: number }) {
  const [reviewers, setReviewers] = React.useState<any[]>([]);
  React.useEffect(() => {
    apiClient.get(`/hackathons/tasks/${taskId}/reviewers`).then(d => setReviewers(d || [])).catch(() => {});
  }, [taskId]);
  if (!reviewers.length) return null;
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginLeft: 30, marginTop: 6 }}>
      <span style={{ fontSize: 10, color: S.muted, alignSelf: 'center' }}>Проверяющие:</span>
      {reviewers.map(r => (
        <span key={r.id} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'rgba(139,148,158,0.1)', border: `1px solid ${S.border}`, color: S.muted }}>
          {r.user?.firstName} {r.user?.lastName}
        </span>
      ))}
    </div>
  );
}

function TaskGradeForm({ taskId, teamId, maxScore, userId }: { taskId: number; teamId: number; maxScore: number; userId: number }) {
  const [score, setScore] = React.useState('');
  const [feedback, setFeedback] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [isReviewer, setIsReviewer] = React.useState(false);

  React.useEffect(() => {
    apiClient.get(`/hackathons/tasks/${taskId}/reviewers`).then((reviewers: any[]) => {
      setIsReviewer(reviewers.some(r => r.userId === userId));
    }).catch(() => {});
    apiClient.get(`/hackathons/tasks/${taskId}/grades`).then((grades: any[]) => {
      const myGrade = grades.find(g => g.reviewerId === userId && g.teamId === teamId);
      if (myGrade) { setScore(String(myGrade.score)); setFeedback(myGrade.feedback || ''); }
    }).catch(() => {});
  }, [taskId, teamId, userId]);

  if (!isReviewer) return null;

  const save = async () => {
    if (!score) return;
    setSaving(true);
    try {
      await apiClient.post(`/hackathons/tasks/${taskId}/grades`, { teamId, score: Number(score), feedback });
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch (e: any) { alert(e.message); } finally { setSaving(false); }
  };

  return (
    <div style={{ marginLeft: 30, marginTop: 8, padding: '10px 12px', background: 'rgba(47,129,247,0.06)', border: `1px solid rgba(47,129,247,0.2)`, borderRadius: 6 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: S.accent, marginBottom: 8, textTransform: 'uppercase' }}>Ваша оценка</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontSize: 11, color: S.muted, display: 'block', marginBottom: 3 }}>Балл (0–{maxScore})</label>
          <input type="number" value={score} onChange={e => setScore(e.target.value)} min={0} max={maxScore}
            style={{ width: 80, background: S.bg, border: `1px solid ${S.border}`, borderRadius: 6, padding: '5px 8px', color: S.text, fontSize: 13 }} />
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <label style={{ fontSize: 11, color: S.muted, display: 'block', marginBottom: 3 }}>Комментарий</label>
          <input value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Необязательно"
            style={{ width: '100%', background: S.bg, border: `1px solid ${S.border}`, borderRadius: 6, padding: '5px 8px', color: S.text, fontSize: 13, boxSizing: 'border-box' }} />
        </div>
        <button onClick={save} disabled={saving || !score}
          style={{ padding: '6px 14px', background: saved ? '#238636' : S.accent, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
          {saved ? '✓ Сохранено' : saving ? '...' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
}

function StageSubmissionForm({ stageId, teamId }: { stageId: number; teamId: number }) {
  const [url, setUrl] = React.useState('');
  const [note, setNote] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    apiClient.get(`/hackathons/stages/${stageId}/submissions`).then((subs: any[]) => {
      const mine = subs.find(s => s.teamId === teamId);
      if (mine) { setUrl(mine.projectUrl); setNote(mine.note || ''); }
    }).catch(() => {});
  }, [stageId, teamId]);

  const save = async () => {
    if (!url.trim()) return;
    setSaving(true);
    try {
      await apiClient.post(`/hackathons/stages/${stageId}/submit`, { teamId, projectUrl: url, note });
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch (e: any) { alert(e.message); } finally { setSaving(false); }
  };

  return (
    <div style={{ marginTop: 12, padding: '12px 14px', background: 'rgba(35,134,54,0.06)', border: '1px solid rgba(35,134,54,0.25)', borderRadius: 6 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#3fb950', marginBottom: 8, textTransform: 'uppercase' }}>Сдача этапа — ссылка на проект</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ fontSize: 11, color: S.muted, display: 'block', marginBottom: 3 }}>URL проекта *</label>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://github.com/...или другая ссылка"
            style={{ width: '100%', background: S.bg, border: `1px solid ${S.border}`, borderRadius: 6, padding: '6px 10px', color: S.text, fontSize: 13, boxSizing: 'border-box' }} />
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <label style={{ fontSize: 11, color: S.muted, display: 'block', marginBottom: 3 }}>Примечание</label>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Необязательно"
            style={{ width: '100%', background: S.bg, border: `1px solid ${S.border}`, borderRadius: 6, padding: '6px 10px', color: S.text, fontSize: 13, boxSizing: 'border-box' }} />
        </div>
        <button onClick={save} disabled={saving || !url.trim()}
          style={{ padding: '6px 14px', background: saved ? '#1a7f37' : '#238636', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
          {saved ? '✓ Отправлено' : saving ? '...' : 'Отправить'}
        </button>
      </div>
    </div>
  );
}

function StageTimeline({ stages, userTeamId, userId }: { stages: HackathonStage[]; userTeamId?: number; userId?: number }) {
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
                          {/* Reviewers */}
                          <TaskReviewerBadges taskId={task.id} />
                          {/* Grade form for reviewers */}
                          {userId && userTeamId && (
                            <TaskGradeForm taskId={task.id} teamId={userTeamId} maxScore={task.maxScore} userId={userId} />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: 12, color: S.muted }}>Задания этапа не указаны</p>
                  )}
                  {/* Stage submission for team */}
                  {userTeamId && (
                    <StageSubmissionForm stageId={stage.id} teamId={userTeamId} />
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
  const isAdminOrMentor = user?.roles?.includes('admin') || user?.roles?.some(r => r.startsWith('mentor_'));

  const tabs = [
    { key: 'overview', label: 'Обзор' },
    ...(stages.length > 0 ? [{ key: 'stages', label: `Этапы (${stages.length})` }] : []),
    ...(hackathon.rules ? [{ key: 'rules', label: 'Правила' }] : []),
    { key: 'teams', label: `Команды (${teams.length})` },
    ...(isAdminOrMentor ? [{ key: 'leaderboard', label: '🏆 Рейтинг' }] : []),
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
              <StageTimeline stages={stages} userTeamId={userTeam?.id} userId={user?.id} />
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

          {(activeTab as string) === 'leaderboard' && hackathonId && (
            <LeaderboardTab hackathonId={hackathonId} teams={teams} />
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

// ── Leaderboard Tab ────────────────────────────────────────────────
function LeaderboardTab({ hackathonId, teams }: { hackathonId: number; teams: any[] }) {
  const [scores, setScores] = React.useState<{ teamId: number; teamName: string; totalAverage: number | null }[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    apiClient.get(`/hackathons/${hackathonId}/leaderboard`)
      .then(d => setScores(d || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [hackathonId]);

  if (loading) return <div style={{ color: S.muted, fontSize: 13, padding: 20 }}>Загрузка рейтинга...</div>;
  if (!scores.length) return <div style={{ color: S.muted, fontSize: 13, padding: 20 }}>Оценки ещё не выставлены</div>;

  return (
    <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${S.border}`, fontSize: 13, fontWeight: 700, color: S.text }}>
        🏆 Рейтинг команд (средний балл по всем задачам)
      </div>
      <div style={{ padding: '8px 0' }}>
        {scores.map((t, i) => (
          <div key={t.teamId} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px', borderBottom: i < scores.length - 1 ? `1px solid ${S.border}` : 'none' }}>
            <span style={{ fontSize: 18, width: 28, textAlign: 'center', flexShrink: 0 }}>
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : <span style={{ color: S.muted, fontSize: 13 }}>{i + 1}</span>}
            </span>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: S.text }}>{t.teamName}</span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {t.totalAverage !== null ? (
                <>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#d29922' }}>{t.totalAverage}</span>
                  <span style={{ fontSize: 11, color: S.muted }}>ср. балл</span>
                </>
              ) : (
                <span style={{ fontSize: 12, color: S.muted }}>Нет оценок</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
