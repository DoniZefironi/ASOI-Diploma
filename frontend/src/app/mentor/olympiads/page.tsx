'use client';

import { useState, useEffect } from 'react';
import { olympiadsApi, type Olympiad, type OlympiadProblem } from '@/shared/api/olympiads';
import { Modal, ModalField, ModalCancelBtn, ModalSubmitBtn, modalInputStyle } from '@/shared/ui/modal';
import { Plus, Trash2, Edit, ChevronRight, Trophy, Users, BarChart2 } from 'lucide-react';
import Link from 'next/link';

const DIFF_COLOR = { easy: '#3fb950', medium: '#d29922', hard: '#f85149' };
const DIFF_LABEL = { easy: 'Лёгкая', medium: 'Средняя', hard: 'Сложная' };

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getStatus(o: Olympiad) {
  const now = new Date();
  if (now < new Date(o.startDate)) return 'upcoming';
  if (now > new Date(o.endDate))   return 'ended';
  return 'active';
}

const STATUS_CFG = {
  active:   { label: 'Идёт',       color: '#3fb950' },
  upcoming: { label: 'Предстоит',  color: '#d29922' },
  ended:    { label: 'Завершена',  color: '#6e7681' },
};

// ── Olympiad Form Modal ─────────────────────────────────────────────
function OlympiadModal({ initial, onClose, onSaved }: {
  initial?: Olympiad;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    title:               initial?.title               || '',
    description:         initial?.description         || '',
    startDate:           initial?.startDate           ? new Date(initial.startDate).toISOString().slice(0, 16)  : '',
    endDate:             initial?.endDate             ? new Date(initial.endDate).toISOString().slice(0, 16)    : '',
    registrationDeadline: initial?.registrationDeadline ? new Date(initial.registrationDeadline).toISOString().slice(0, 16) : '',
    allowedLanguages:    initial?.allowedLanguages?.join(', ') || 'js, python, cpp, java',
    isActive:            initial?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description || undefined,
        startDate: form.startDate,
        endDate: form.endDate,
        registrationDeadline: form.registrationDeadline || undefined,
        allowedLanguages: form.allowedLanguages.split(',').map(s => s.trim()).filter(Boolean),
        isActive: form.isActive,
      };
      if (isEdit) await olympiadsApi.update(initial!.id, payload);
      else        await olympiadsApi.create(payload);
      onSaved();
    } catch (e: any) { alert(e.message || 'Ошибка'); }
    finally { setSaving(false); }
  };

  return (
    <Modal title={isEdit ? 'Редактировать олимпиаду' : 'Создать олимпиаду'} onClose={onClose} maxWidth={560}
      footer={<><ModalCancelBtn onClose={onClose} /><ModalSubmitBtn loading={saving} label={isEdit ? 'Сохранить' : 'Создать'} form="olympiad-form" /></>}
    >
      <form id="olympiad-form" onSubmit={handleSubmit}>
        <ModalField label="Название" required>
          <input style={modalInputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required autoFocus />
        </ModalField>
        <ModalField label="Описание">
          <textarea style={{ ...modalInputStyle, resize: 'vertical' }} rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </ModalField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <ModalField label="Начало" required>
            <input type="datetime-local" style={modalInputStyle} value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} required />
          </ModalField>
          <ModalField label="Конец" required>
            <input type="datetime-local" style={modalInputStyle} value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} required />
          </ModalField>
        </div>
        <ModalField label="Дедлайн регистрации">
          <input type="datetime-local" style={modalInputStyle} value={form.registrationDeadline} onChange={e => setForm(f => ({ ...f, registrationDeadline: e.target.value }))} />
        </ModalField>
        <ModalField label="Языки (через запятую)">
          <input style={modalInputStyle} value={form.allowedLanguages} onChange={e => setForm(f => ({ ...f, allowedLanguages: e.target.value }))} placeholder="js, python, cpp, java" />
        </ModalField>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-fg-default)', cursor: 'pointer' }}>
          <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} style={{ accentColor: 'var(--color-accent-fg)' }} />
          Активна (видна студентам)
        </label>
      </form>
    </Modal>
  );
}

// ── Problem Form Modal ──────────────────────────────────────────────
function ProblemModal({ olympiadId, initial, onClose, onSaved }: {
  olympiadId: number;
  initial?: OlympiadProblem;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    title:              initial?.title              || '',
    description:        initial?.description        || '',
    inputDescription:   initial?.inputDescription   || '',
    outputDescription:  initial?.outputDescription  || '',
    difficulty:         initial?.difficulty         || 'medium',
    points:             String(initial?.points      ?? 100),
    examples:           initial?.examples           ? JSON.stringify(initial.examples, null, 2) : '[\n  {"input": "5\\n3", "output": "8", "explanation": "5 + 3 = 8"}\n]',
  });
  const [saving, setSaving] = useState(false);
  const [exampleError, setExampleError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let parsedExamples;
    try { parsedExamples = JSON.parse(form.examples); setExampleError(''); }
    catch { setExampleError('Некорректный JSON в примерах'); return; }

    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        inputDescription: form.inputDescription || undefined,
        outputDescription: form.outputDescription || undefined,
        difficulty: form.difficulty as any,
        points: Number(form.points),
        examples: parsedExamples,
      };
      if (isEdit) await olympiadsApi.updateProblem(olympiadId, initial!.id, payload);
      else        await olympiadsApi.addProblem(olympiadId, payload);
      onSaved();
    } catch (e: any) { alert(e.message || 'Ошибка'); }
    finally { setSaving(false); }
  };

  return (
    <Modal title={isEdit ? 'Редактировать задачу' : 'Добавить задачу'} onClose={onClose} maxWidth={640}
      footer={<><ModalCancelBtn onClose={onClose} /><ModalSubmitBtn loading={saving} label={isEdit ? 'Сохранить' : 'Добавить'} form="olympiad-problem-form" /></>}
    >
      <form id="olympiad-problem-form" onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 10, marginBottom: 14 }}>
          <ModalField label="Название задачи" required>
            <input style={modalInputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required autoFocus />
          </ModalField>
          <ModalField label="Сложность">
            <select style={modalInputStyle} value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}>
              <option value="easy">Лёгкая</option>
              <option value="medium">Средняя</option>
              <option value="hard">Сложная</option>
            </select>
          </ModalField>
          <ModalField label="Баллы">
            <input type="number" style={{ ...modalInputStyle, width: 80 }} value={form.points} onChange={e => setForm(f => ({ ...f, points: e.target.value }))} min={1} />
          </ModalField>
        </div>
        <ModalField label="Условие задачи" required>
          <textarea style={{ ...modalInputStyle, resize: 'vertical', fontFamily: 'inherit' }} rows={5} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
        </ModalField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <ModalField label="Описание ввода">
            <textarea style={{ ...modalInputStyle, resize: 'vertical' }} rows={2} value={form.inputDescription} onChange={e => setForm(f => ({ ...f, inputDescription: e.target.value }))} />
          </ModalField>
          <ModalField label="Описание вывода">
            <textarea style={{ ...modalInputStyle, resize: 'vertical' }} rows={2} value={form.outputDescription} onChange={e => setForm(f => ({ ...f, outputDescription: e.target.value }))} />
          </ModalField>
        </div>
        <ModalField label="Примеры (JSON)">
          <textarea style={{ ...modalInputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }} rows={6}
            value={form.examples} onChange={e => setForm(f => ({ ...f, examples: e.target.value }))} />
          {exampleError && <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--color-danger-fg)' }}>{exampleError}</p>}
          <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--color-fg-subtle)' }}>
            Формат: {`[{"input": "...", "output": "...", "explanation": "..."}]`}
          </p>
        </ModalField>
      </form>
    </Modal>
  );
}

// ── Main Page ───────────────────────────────────────────────────────
export default function MentorOlympiadsPage() {
  const [olympiads, setOlympiads]     = useState<Olympiad[]>([]);
  const [loading, setLoading]         = useState(true);
  const [showCreate, setShowCreate]   = useState(false);
  const [editingOlympiad, setEditing] = useState<Olympiad | null>(null);
  const [expandedId, setExpandedId]   = useState<number | null>(null);
  const [showAddProblem, setShowAddProblem] = useState<number | null>(null);
  const [editProblem, setEditProblem] = useState<{ olympiadId: number; problem: OlympiadProblem } | null>(null);

  const load = () => olympiadsApi.getAllAdmin().then(setOlympiads).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const deleteOlympiad = async (id: number) => {
    if (!confirm('Удалить олимпиаду?')) return;
    try { await olympiadsApi.remove(id); setOlympiads(p => p.filter(o => o.id !== id)); }
    catch (e: any) { alert(e.message); }
  };

  const deleteProblem = async (olympiadId: number, pid: number) => {
    if (!confirm('Удалить задачу?')) return;
    try { await olympiadsApi.removeProblem(olympiadId, pid); load(); }
    catch (e: any) { alert(e.message); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Trophy size={20} color="var(--color-attention-fg)" />
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--color-fg-default)' }}>Олимпиады</h1>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--color-fg-muted)' }}>Создание и управление олимпиадами по программированию</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 13, fontWeight: 600, background: 'var(--color-success-emphasis)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          <Plus size={14} /> Новая олимпиада
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-fg-muted)' }}>Загрузка...</div>
      ) : olympiads.length === 0 ? (
        <div style={{ background: 'var(--color-canvas-overlay)', border: '1px dashed var(--color-border-default)', borderRadius: 10, padding: '48px 24px', textAlign: 'center' }}>
          <Trophy size={28} color="var(--color-fg-subtle)" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--color-fg-default)', fontWeight: 600, margin: '0 0 4px' }}>Олимпиад ещё нет</p>
          <p style={{ color: 'var(--color-fg-muted)', fontSize: 13, margin: 0 }}>Создайте первую олимпиаду</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {olympiads.map(o => {
            const status = getStatus(o);
            const cfg    = STATUS_CFG[status];
            const isExp  = expandedId === o.id;
            return (
              <div key={o.id} style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 10, overflow: 'hidden' }}>
                {/* Olympiad row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px' }}>
                  <button onClick={() => setExpandedId(isExp ? null : o.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-fg-muted)', display: 'flex', padding: 0 }}>
                    <ChevronRight size={16} style={{ transform: isExp ? 'rotate(90deg)' : '', transition: 'transform 150ms' }} />
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-fg-default)' }}>{o.title}</span>
                      <span style={{ fontSize: 11, color: cfg.color, background: `${cfg.color}1a`, padding: '1px 8px', borderRadius: 20 }}>{cfg.label}</span>
                      {!o.isActive && <span style={{ fontSize: 11, color: 'var(--color-fg-subtle)', background: 'var(--color-canvas-inset)', padding: '1px 8px', borderRadius: 20 }}>Скрыта</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-fg-muted)', display: 'flex', gap: 12 }}>
                      <span>{fmtDate(o.startDate)} — {fmtDate(o.endDate)}</span>
                      <span>{o.problems.length} задач</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link href={`/olympiads/${o.id}`} target="_blank"
                      style={{ fontSize: 12, color: 'var(--color-accent-fg)', background: 'var(--color-accent-subtle)', padding: '4px 10px', borderRadius: 6, textDecoration: 'none', border: '1px solid var(--color-accent-muted)' }}>
                      Просмотр
                    </Link>
                    <button onClick={() => setEditing(o)}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', fontSize: 12, color: 'var(--color-fg-default)', background: 'var(--color-canvas-inset)', border: '1px solid var(--color-border-default)', borderRadius: 6, cursor: 'pointer' }}>
                      <Edit size={12} /> Изменить
                    </button>
                    <button onClick={() => deleteOlympiad(o.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', fontSize: 12, color: 'var(--color-danger-fg)', background: 'transparent', border: '1px solid var(--color-danger-muted)', borderRadius: 6, cursor: 'pointer' }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Expanded problems */}
                {isExp && (
                  <div style={{ borderTop: '1px solid var(--color-border-muted)', padding: '12px 18px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Задачи ({o.problems.length})</span>
                      <button onClick={() => setShowAddProblem(o.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', fontSize: 12, background: 'var(--color-success-subtle)', color: 'var(--color-success-fg)', border: '1px solid var(--color-success-muted)', borderRadius: 6, cursor: 'pointer' }}>
                        <Plus size={12} /> Добавить задачу
                      </button>
                    </div>
                    {o.problems.length === 0 ? (
                      <p style={{ color: 'var(--color-fg-muted)', fontSize: 13 }}>Нет задач. Добавьте первую.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {o.problems.map(p => (
                          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--color-canvas-default)', borderRadius: 8 }}>
                            <span style={{ fontSize: 13, flex: 1, color: 'var(--color-fg-default)' }}>{p.title}</span>
                            <span style={{ fontSize: 11, color: DIFF_COLOR[p.difficulty] }}>{DIFF_LABEL[p.difficulty]}</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-attention-fg)' }}>{p.points} б.</span>
                            <button onClick={() => setEditProblem({ olympiadId: o.id, problem: p })}
                              style={{ display: 'flex', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-fg-muted)', padding: 4 }}>
                              <Edit size={12} />
                            </button>
                            <button onClick={() => deleteProblem(o.id, p.id)}
                              style={{ display: 'flex', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger-fg)', padding: 4 }}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {(showCreate || editingOlympiad) && (
        <OlympiadModal
          initial={editingOlympiad || undefined}
          onClose={() => { setShowCreate(false); setEditing(null); }}
          onSaved={() => { setShowCreate(false); setEditing(null); load(); }}
        />
      )}
      {showAddProblem && (
        <ProblemModal
          olympiadId={showAddProblem}
          onClose={() => setShowAddProblem(null)}
          onSaved={() => { setShowAddProblem(null); load(); }}
        />
      )}
      {editProblem && (
        <ProblemModal
          olympiadId={editProblem.olympiadId}
          initial={editProblem.problem}
          onClose={() => setEditProblem(null)}
          onSaved={() => { setEditProblem(null); load(); }}
        />
      )}
    </div>
  );
}
