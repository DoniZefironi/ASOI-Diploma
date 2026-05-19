'use client';
import { useState } from 'react';
import { CreateHackathonDto, CreateHackathonStageDto, CreateHackathonTaskDto } from '@/shared/api/hackathons';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

// ── Icons ──────────────────────────────────────────────────────────
const PlusIcon = () => <Plus size={14} />;
const TrashIcon = () => <Trash2 size={14} />;
const ChevronDownIcon = () => <ChevronDown size={14} />;
const ChevronRightIcon = () => <ChevronRight size={14} />;

// ── Styles ─────────────────────────────────────────────────────────
const S = {
  bg: 'var(--color-canvas-default)',
  surface: 'var(--color-canvas-overlay)',
  border: 'var(--color-border-default)',
  text: 'var(--color-fg-default)',
  muted: 'var(--color-fg-muted)',
  accent: '#2f81f7',
  danger: '#f85149',
  success: '#3fb950',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '7px 10px', boxSizing: 'border-box',
  background: S.bg, border: `1px solid ${S.border}`,
  borderRadius: 6, color: S.text, fontSize: 13, outline: 'none',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600,
  color: S.muted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em',
};
const sectionStyle: React.CSSProperties = {
  background: S.surface, border: `1px solid ${S.border}`,
  borderRadius: 8, padding: 16, marginBottom: 12,
};

// ── TaskRow ────────────────────────────────────────────────────────
function TaskRow({ task, onChange, onRemove }: {
  task: CreateHackathonTaskDto;
  onChange: (t: CreateHackathonTaskDto) => void;
  onRemove: () => void;
}) {
  return (
    <div style={{
      background: S.bg, border: `1px solid ${S.border}`, borderRadius: 6,
      padding: '10px 12px', marginBottom: 8,
    }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            value={task.title}
            onChange={e => onChange({ ...task, title: e.target.value })}
            placeholder="Название задания"
            style={{ ...inputStyle, fontWeight: 600 }}
          />
          <textarea
            value={task.description || ''}
            onChange={e => onChange({ ...task, description: e.target.value })}
            placeholder="Описание задания"
            rows={2}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
          />
          <textarea
            value={task.scoringCriteria || ''}
            onChange={e => onChange({ ...task, scoringCriteria: e.target.value })}
            placeholder="Критерии оценивания (как проверяется)"
            rows={2}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: 12, color: S.muted, whiteSpace: 'nowrap' }}>Макс. балл:</label>
            <input
              type="number" min={0} max={1000}
              value={task.maxScore ?? 100}
              onChange={e => onChange({ ...task, maxScore: parseInt(e.target.value) || 100 })}
              style={{ ...inputStyle, width: 80 }}
            />
          </div>
        </div>
        <button
          type="button" onClick={onRemove}
          style={{
            padding: '6px', background: 'none', border: `1px solid ${S.border}`,
            borderRadius: 6, cursor: 'pointer', color: S.danger, flexShrink: 0,
          }}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

// ── StageBlock ─────────────────────────────────────────────────────
function StageBlock({ stage, index, onChange, onRemove }: {
  stage: CreateHackathonStageDto;
  index: number;
  onChange: (s: CreateHackathonStageDto) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(true);

  const addTask = () => {
    onChange({ ...stage, tasks: [...(stage.tasks || []), { title: '', maxScore: 100, order: stage.tasks?.length || 0 }] });
  };

  const updateTask = (i: number, t: CreateHackathonTaskDto) => {
    const tasks = [...(stage.tasks || [])];
    tasks[i] = t;
    onChange({ ...stage, tasks });
  };

  const removeTask = (i: number) => {
    const tasks = (stage.tasks || []).filter((_, idx) => idx !== i);
    onChange({ ...stage, tasks });
  };

  return (
    <div style={{ ...sectionStyle, borderLeft: `3px solid ${S.accent}`, marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: open ? 12 : 0 }}>
        <button
          type="button" onClick={() => setOpen(o => !o)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: S.muted, padding: 0, flexShrink: 0 }}
        >
          {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </button>
        <span style={{ fontSize: 11, color: S.accent, fontWeight: 700, flexShrink: 0 }}>
          ЭТАП {index + 1}
        </span>
        <input
          value={stage.title}
          onChange={e => onChange({ ...stage, title: e.target.value })}
          placeholder="Название этапа"
          style={{ ...inputStyle, fontWeight: 600, flex: 1 }}
        />
        <span style={{ fontSize: 11, color: S.muted, flexShrink: 0 }}>
          {stage.tasks?.length || 0} задан.
        </span>
        <button
          type="button" onClick={onRemove}
          style={{ background: 'none', border: `1px solid ${S.border}`, borderRadius: 6, cursor: 'pointer', color: S.danger, padding: '4px 6px', flexShrink: 0 }}
        >
          <TrashIcon />
        </button>
      </div>

      {open && (
        <>
          <textarea
            value={stage.description || ''}
            onChange={e => onChange({ ...stage, description: e.target.value })}
            placeholder="Описание этапа (необязательно)"
            rows={2}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', marginBottom: 10 }}
          />
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Начало этапа</label>
              <input
                type="datetime-local"
                value={stage.startDate ? stage.startDate.slice(0, 16) : ''}
                onChange={e => onChange({ ...stage, startDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Конец этапа</label>
              <input
                type="datetime-local"
                value={stage.endDate ? stage.endDate.slice(0, 16) : ''}
                onChange={e => onChange({ ...stage, endDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Tasks */}
          <div style={{ paddingLeft: 12, borderLeft: `2px solid ${S.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: S.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Задания этапа
              </span>
              <button
                type="button" onClick={addTask}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '4px 10px', background: 'rgba(47,129,247,0.1)',
                  border: `1px solid rgba(47,129,247,0.3)`, borderRadius: 6,
                  color: S.accent, fontSize: 12, cursor: 'pointer',
                }}
              >
                <PlusIcon /> Добавить задание
              </button>
            </div>
            {(stage.tasks || []).length === 0 ? (
              <p style={{ fontSize: 12, color: S.muted, padding: '8px 0' }}>Нет заданий — этап без конкретных задач</p>
            ) : (
              (stage.tasks || []).map((task, i) => (
                <TaskRow key={i} task={task} onChange={t => updateTask(i, t)} onRemove={() => removeTask(i)} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Form ──────────────────────────────────────────────────────
interface HackathonFormProps {
  hackathon?: any;
  onSave: (data: CreateHackathonDto) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function HackathonForm({ hackathon, onSave, onCancel, isSubmitting }: HackathonFormProps) {
  const toLocalDT = (iso?: string) => iso ? new Date(iso).toISOString().slice(0, 16) : '';

  const [form, setForm] = useState<CreateHackathonDto>({
    title: hackathon?.title || hackathon?.name || '',
    description: hackathon?.description || '',
    theme: hackathon?.theme || '',
    startDate: hackathon?.startDate || '',
    endDate: hackathon?.endDate || '',
    registrationDeadline: hackathon?.registrationDeadline || '',
    maxTeamSize: hackathon?.maxTeamSize ?? 5,
    minTeamSize: hackathon?.minTeamSize ?? 2,
    prizePool: hackathon?.prizePool ?? undefined,
    isActive: hackathon?.isActive ?? true,
    judgingCriteria: hackathon?.judgingCriteria ?? null,
    rules: hackathon?.rules || '',
    stages: hackathon?.stages?.map((s: any) => ({
      title: s.title,
      description: s.description || '',
      order: s.order ?? 0,
      startDate: s.startDate || '',
      endDate: s.endDate || '',
      tasks: (s.tasks || []).map((t: any) => ({
        title: t.title,
        description: t.description || '',
        maxScore: t.maxScore ?? 100,
        scoringCriteria: t.scoringCriteria || '',
        order: t.order ?? 0,
      })),
    })) || [],
  });

  const set = (key: keyof CreateHackathonDto, val: any) => setForm(f => ({ ...f, [key]: val }));

  const addStage = () => {
    set('stages', [...(form.stages || []), {
      title: '',
      description: '',
      order: form.stages?.length || 0,
      tasks: [],
    }]);
  };

  const updateStage = (i: number, s: CreateHackathonStageDto) => {
    const stages = [...(form.stages || [])];
    stages[i] = s;
    set('stages', stages);
  };

  const removeStage = (i: number) => {
    set('stages', (form.stages || []).filter((_, idx) => idx !== i));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateHackathonDto = {
      ...form,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : form.startDate,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : form.endDate,
      registrationDeadline: form.registrationDeadline ? new Date(form.registrationDeadline).toISOString() : undefined,
      theme: form.theme || undefined,
      rules: form.rules || undefined,
      stages: (form.stages || []).map((s, i) => ({
        ...s,
        order: i,
        startDate: s.startDate || undefined,
        endDate: s.endDate || undefined,
        tasks: (s.tasks || []).map((t, j) => ({ ...t, order: j })),
      })),
    };
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} style={{ color: S.text, fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>

      {/* ── Basic info ── */}
      <div style={{ ...sectionStyle, marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: S.text, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: S.accent }}>⬡</span> Основная информация
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={labelStyle}>Название *</label>
          <input required value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="Название хакатона" style={inputStyle} />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={labelStyle}>Тема / трек</label>
          <input value={form.theme || ''} onChange={e => set('theme', e.target.value)}
            placeholder="Напр. «Умный город», «IoT», «AI»" style={inputStyle} />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={labelStyle}>Описание *</label>
          <textarea required rows={4} value={form.description} onChange={e => set('description', e.target.value)}
            placeholder="Опишите цели, тематику и формат хакатона"
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
        </div>
      </div>

      {/* ── Dates ── */}
      <div style={{ ...sectionStyle, marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: S.text, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#e3b341' }}>⬡</span> Даты
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div>
            <label style={labelStyle}>Начало *</label>
            <input required type="datetime-local" value={toLocalDT(form.startDate)}
              onChange={e => set('startDate', e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Конец *</label>
            <input required type="datetime-local" value={toLocalDT(form.endDate)}
              onChange={e => set('endDate', e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Дедлайн регистрации</label>
          <input type="datetime-local" value={toLocalDT(form.registrationDeadline)}
            onChange={e => set('registrationDeadline', e.target.value)} style={inputStyle} />
        </div>
      </div>

      {/* ── Team settings ── */}
      <div style={{ ...sectionStyle, marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: S.text, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#3fb950' }}>⬡</span> Команды и призовой фонд
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div>
            <label style={labelStyle}>Мин. размер</label>
            <input type="number" min={1} max={20} value={form.minTeamSize}
              onChange={e => set('minTeamSize', parseInt(e.target.value))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Макс. размер</label>
            <input type="number" min={1} max={20} value={form.maxTeamSize}
              onChange={e => set('maxTeamSize', parseInt(e.target.value))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Призовой фонд (₽)</label>
            <input type="number" min={0} value={form.prizePool ?? ''}
              onChange={e => set('prizePool', e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="0" style={inputStyle} />
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: S.text }}>
            <input type="checkbox" checked={form.isActive ?? true}
              onChange={e => set('isActive', e.target.checked)}
              style={{ width: 14, height: 14 }} />
            Хакатон активен (виден студентам)
          </label>
        </div>
      </div>

      {/* ── Rules ── */}
      <div style={{ ...sectionStyle, marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: S.text, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#a371f7' }}>⬡</span> Правила участия
        </div>
        <textarea
          rows={5} value={form.rules || ''}
          onChange={e => set('rules', e.target.value)}
          placeholder="Опишите правила, ограничения, требования к оформлению работ, что запрещено и т.д."
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>

      {/* ── Stages ── */}
      <div style={{ ...sectionStyle, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: S.text, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#39c5cf' }}>⬡</span> Этапы и задания
          </div>
          <button
            type="button" onClick={addStage}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
              background: 'rgba(47,129,247,0.1)', border: `1px solid rgba(47,129,247,0.3)`,
              borderRadius: 6, color: S.accent, fontSize: 13, cursor: 'pointer', fontWeight: 600,
            }}
          >
            <PlusIcon /> Добавить этап
          </button>
        </div>

        {(form.stages || []).length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '24px', border: `2px dashed ${S.border}`,
            borderRadius: 8, color: S.muted, fontSize: 13,
          }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>📋</div>
            Этапы не добавлены. Хакатон будет без структурированных этапов.
          </div>
        ) : (
          (form.stages || []).map((stage, i) => (
            <StageBlock key={i} stage={stage} index={i}
              onChange={s => updateStage(i, s)} onRemove={() => removeStage(i)} />
          ))
        )}
      </div>

      {/* ── Actions ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 8 }}>
        <button type="button" onClick={onCancel} disabled={isSubmitting}
          style={{
            padding: '8px 18px', background: S.surface, border: `1px solid ${S.border}`,
            borderRadius: 6, color: S.text, fontSize: 13, cursor: 'pointer',
          }}>
          Отмена
        </button>
        <button type="submit" disabled={isSubmitting}
          style={{
            padding: '8px 18px', background: S.accent, border: 'none',
            borderRadius: 6, color: '#fff', fontSize: 13, cursor: 'pointer', fontWeight: 600,
            opacity: isSubmitting ? 0.6 : 1,
          }}>
          {isSubmitting ? 'Сохранение...' : hackathon ? 'Сохранить изменения' : 'Создать хакатон'}
        </button>
      </div>
    </form>
  );
}
