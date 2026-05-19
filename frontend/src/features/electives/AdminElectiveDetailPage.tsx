'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/shared/api/client';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Plus, Trash2, ArrowLeft, Calendar, FileText, Users, Clock, Loader2 } from 'lucide-react';

// ── shared form primitives ──────────────────────────────
const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-white mb-2">{children}</label>
);
const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white';
const Input = ({ id, type = 'text', value, onChange, placeholder, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} className={inputCls} {...rest} />
);
const Textarea = ({ id, value, onChange, placeholder, rows = 4 }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea id={id} value={value as string} onChange={onChange} placeholder={placeholder} rows={rows} className={inputCls} />
);
const Select = ({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) => (
  <select value={value} onChange={e => onChange(e.target.value)} className={inputCls}>{children}</select>
);
const ErrMsg = ({ msg }: { msg?: string }) => msg ? <p className="text-sm text-red-500 mt-1">{msg}</p> : null;

const SCHEDULE_TYPES = [
  { value: 'lecture', label: 'Лекция' },
  { value: 'practice', label: 'Практика' },
  { value: 'test', label: 'Тест' },
  { value: 'practice_review', label: 'Проверка практики (Peer Review)' },
];
const ASSIGNMENT_TYPES = [
  { value: 'practice', label: 'Практика (загрузка работы)' },
  { value: 'test', label: 'Тест' },
  { value: 'practice_review', label: 'Проверка практики (Peer Review)' },
];
const SCHEDULE_TYPE_LABEL: Record<string, string> = {
  lecture: 'Лекция', practice: 'Практика', test: 'Тест', practice_review: 'Проверка практики',
};
const ASSIGNMENT_TYPE_LABEL: Record<string, string> = {
  practice: 'Практика', test: 'Тест', practice_review: 'Peer Review',
};

function formatDate(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function AdminElectiveDetailPage({ electiveId }: { electiveId: number }) {
  const [tab, setTab] = useState<'schedule' | 'assignments' | 'participants'>('schedule');
  const [elective, setElective] = useState<any>(null);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [electiveId]);

  const load = async () => {
    setLoading(true);
    const [el, sch, asgn, parts] = await Promise.all([
      apiClient.get(`/electives/${electiveId}`).catch(() => null),
      apiClient.get(`/electives/${electiveId}/schedule`).catch(() => []),
      apiClient.get(`/electives/${electiveId}/assignments`).catch(() => []),
      apiClient.get(`/electives/${electiveId}/participants`).catch(() => []),
    ]);
    setElective(el);
    setSchedule(sch || []);
    setAssignments(asgn || []);
    setParticipants(parts || []);
    setLoading(false);
  };

  if (loading) return <div className="text-white p-8 flex items-center gap-2"><Loader2 className="animate-spin h-5 w-5" /> Загрузка...</div>;
  if (!elective) return <div className="text-white p-8">Факультатив не найден</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/electives">
          <Button variant="secondary" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Назад</Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gh-fg">{elective.title}</h1>
          <p className="text-gray-400 text-sm">
            Группа: {elective.courseGroup?.name}
            {elective.courseGroup?.course ? ` · ${elective.courseGroup.course.name}` : ''}
            {' · '}
            <span className={elective.isActive ? 'text-green-400' : 'text-gray-500'}>
              {elective.isActive ? 'Активен' : 'Неактивен'}
            </span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-700 pb-1">
        {([
          { key: 'schedule', label: 'Занятия', icon: Calendar, count: schedule.length },
          { key: 'assignments', label: 'Задания', icon: FileText, count: assignments.length },
          { key: 'participants', label: 'Участники', icon: Users, count: participants.length },
        ] as const).map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              tab === key ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
            <span className="bg-black/20 text-xs px-1.5 py-0.5 rounded-full">{count}</span>
          </button>
        ))}
      </div>

      {tab === 'schedule' && <ScheduleTab electiveId={electiveId} items={schedule} assignments={assignments} onRefresh={load} />}
      {tab === 'assignments' && <AssignmentsTab electiveId={electiveId} items={assignments} onRefresh={load} />}
      {tab === 'participants' && <ParticipantsTab participants={participants} />}
    </div>
  );
}

// ──────────────────── SCHEDULE TAB ────────────────────

const LOCATIONS = [
  { value: 'online', label: 'Онлайн' },
  { value: 'auditory_1', label: 'Аудитория 1' },
  { value: 'auditory_2', label: 'Аудитория 2' },
  { value: 'auditory_3', label: 'Аудитория 3' },
  { value: 'lab_1', label: 'Лаборатория 1' },
  { value: 'lab_2', label: 'Лаборатория 2' },
];

interface ScheduleFormState {
  title: string; description: string; type: string;
  startTime: string; endTime: string; location: string;
  meetingUrl: string; videoUrl: string; materialsUrl: string;
  assignmentDescription: string; content: string;
  linkedAssignmentId: string;
}

const emptySchedule = (): ScheduleFormState => ({
  title: '', description: '', type: 'lecture',
  startTime: '', endTime: '', location: 'online',
  meetingUrl: '', videoUrl: '', materialsUrl: '',
  assignmentDescription: '', content: '', linkedAssignmentId: '',
});

function ScheduleTab({ electiveId, items, assignments, onRefresh }: { electiveId: number; items: any[]; assignments: any[]; onRefresh: () => void }) {
  const practiceItems = items.filter(a => String(a.type).toLowerCase() === 'practice');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ScheduleFormState>(emptySchedule());
  const [errors, setErrors] = useState<Partial<ScheduleFormState>>({});
  const [saving, setSaving] = useState(false);

  const set = (field: keyof ScheduleFormState, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const e: Partial<ScheduleFormState> = {};
    if (!form.title.trim()) e.title = 'Название обязательно';
    if (!form.description.trim()) e.description = 'Описание обязательно';
    if (!form.startTime) e.startTime = 'Время начала обязательно';
    if (!form.endTime) e.endTime = 'Время окончания обязательно';
    else if (form.startTime && new Date(form.endTime) <= new Date(form.startTime)) e.endTime = 'Конец должен быть позже начала';
    if (form.type === 'practice_review' && !form.linkedAssignmentId) e.linkedAssignmentId = 'Выберите занятие практики';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await apiClient.post(`/electives/${electiveId}/schedule`, {
        title: form.title, description: form.description, type: form.type,
        startTime: form.startTime, endTime: form.endTime, location: form.location,
        meetingUrl: form.meetingUrl || undefined, videoUrl: form.videoUrl || undefined,
        materialsUrl: form.materialsUrl || undefined,
        assignmentDescription: form.assignmentDescription || undefined,
        content: form.content || undefined,
        linkedScheduleItemId: form.linkedAssignmentId ? Number(form.linkedAssignmentId) : undefined,
      });
      setForm(emptySchedule());
      setShowForm(false);
      onRefresh();
    } catch (err: any) { alert(err?.message || 'Ошибка'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить занятие?')) return;
    try { await apiClient.delete(`/electives/${electiveId}/schedule/${id}`); onRefresh(); }
    catch (err: any) { alert(err?.message || 'Ошибка'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gh-fg">Занятия ({items.length})</h2>
        <Button variant="primary" size="sm" onClick={() => setShowForm(v => !v)}>
          <Plus className="h-4 w-4 mr-1" /> Добавить занятие
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Новое занятие</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="s-title">Название занятия *</Label>
              <Input id="s-title" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Введите название занятия" />
              <ErrMsg msg={errors.title} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-desc">Описание занятия *</Label>
              <Textarea id="s-desc" value={form.description} onChange={e => set('description', (e.target as HTMLTextAreaElement).value)} placeholder="Опишите содержание занятия..." rows={3} />
              <ErrMsg msg={errors.description} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Тип занятия</Label>
                <Select value={form.type} onChange={v => set('type', v)}>
                  {SCHEDULE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Место проведения</Label>
                <Select value={form.location} onChange={v => set('location', v)}>
                  {LOCATIONS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </Select>
              </div>
            </div>

            {form.type === 'practice_review' && (
              <div className="space-y-2">
                <Label>Занятие практики *</Label>
                {practiceItems.length === 0 ? (
                  <p className="text-sm text-yellow-400 p-3 bg-yellow-900/20 border border-yellow-700 rounded-md">
                    Сначала добавьте занятие типа «Практика» в этом же списке занятий
                  </p>
                ) : (
                  <Select value={form.linkedAssignmentId} onChange={v => set('linkedAssignmentId', v)}>
                    <option value="">Выберите занятие практики</option>
                    {practiceItems.map((a: any) => (
                      <option key={a.id} value={a.id}>{a.title}</option>
                    ))}
                  </Select>
                )}
                <ErrMsg msg={errors.linkedAssignmentId} />
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="s-start">Время начала *</Label>
                <Input id="s-start" type="datetime-local" value={form.startTime} onChange={e => set('startTime', e.target.value)} />
                <ErrMsg msg={errors.startTime} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-end">Время окончания *</Label>
                <Input id="s-end" type="datetime-local" value={form.endTime} onChange={e => set('endTime', e.target.value)} />
                <ErrMsg msg={errors.endTime} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-meet">Ссылка на онлайн-встречу</Label>
              <Input id="s-meet" type="url" value={form.meetingUrl} onChange={e => set('meetingUrl', e.target.value)} placeholder="https://meet.google.com/xxx-xxxx-xxx" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-video">Ссылка на YouTube видео</Label>
              <Input id="s-video" type="url" value={form.videoUrl} onChange={e => set('videoUrl', e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
              <p className="text-xs text-gray-400">Видео с YouTube будет автоматически встроено в страницу занятия</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-mat">Ссылка на материалы</Label>
              <Input id="s-mat" type="url" value={form.materialsUrl} onChange={e => set('materialsUrl', e.target.value)} placeholder="https://drive.google.com/..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-asgn">Описание задания</Label>
              <Textarea id="s-asgn" value={form.assignmentDescription} onChange={e => set('assignmentDescription', (e.target as HTMLTextAreaElement).value)} placeholder="Опишите задание для студентов..." rows={4} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-content">Дополнительный контент</Label>
              <Textarea id="s-content" value={form.content} onChange={e => set('content', (e.target as HTMLTextAreaElement).value)} placeholder="Дополнительная информация, заметки, ссылки..." rows={4} />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)} disabled={saving}>Отмена</Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Создать занятие
              </Button>
            </div>
          </form>
        </Card>
      )}

      {items.length === 0 ? (
        <Card className="p-8 text-center text-gray-400">Занятий пока нет</Card>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <Card key={item.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium border ${
                      item.type === 'lecture' ? 'bg-blue-600/20 text-blue-400 border-blue-600' :
                      item.type === 'practice' ? 'bg-green-600/20 text-green-400 border-green-600' :
                      item.type === 'test' ? 'bg-red-600/20 text-red-400 border-red-600' :
                      'bg-yellow-600/20 text-yellow-400 border-yellow-600'
                    }`}>
                      {SCHEDULE_TYPE_LABEL[item.type] ?? item.type}
                    </span>
                  </div>
                  <p className="text-white font-medium">{item.title}</p>
                  {item.description && <p className="text-gray-400 text-sm mt-1">{item.description}</p>}
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(item.startTime)} — {formatDate(item.endTime)}</span>
                    {item.location && <span>📍 {LOCATIONS.find(l => l.value === item.location)?.label ?? item.location}</span>}
                    {item.meetingUrl && <a href={item.meetingUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Ссылка на встречу</a>}
                    {item.videoUrl && <a href={item.videoUrl} target="_blank" rel="noreferrer" className="text-red-400 hover:underline">Видео</a>}
                  </div>
                </div>
                <button onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-red-400 ml-4 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────────────────── ASSIGNMENTS TAB ────────────────────

interface AssignmentFormState {
  title: string; description: string; type: string;
  maxScore: string; startDate: string; deadline: string;
  requirements: string; practiceAssignmentId: string;
}

const emptyAssignment = (): AssignmentFormState => ({
  title: '', description: '', type: 'practice',
  maxScore: '100', startDate: new Date().toISOString().slice(0, 16), deadline: '',
  requirements: '', practiceAssignmentId: '',
});

function AssignmentsTab({ electiveId, items, onRefresh }: { electiveId: number; items: any[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AssignmentFormState>(emptyAssignment());
  const [errors, setErrors] = useState<Partial<AssignmentFormState>>({});
  const [saving, setSaving] = useState(false);

  // Practice assignments in this elective (for practice_review type)
  const practiceItems = items.filter(a => a.type === 'practice');

  const set = (field: keyof AssignmentFormState, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const e: Partial<AssignmentFormState> = {};
    if (!form.title.trim()) e.title = 'Название задания обязательно';
    if (!form.description.trim()) e.description = 'Описание задания обязательно';
    if (!form.maxScore || Number(form.maxScore) < 1) e.maxScore = 'Максимальный балл должен быть положительным числом';
    if (!form.startDate) e.startDate = 'Дата начала обязательна';
    if (!form.deadline) e.deadline = 'Срок выполнения обязателен';
    else if (form.startDate && new Date(form.deadline) <= new Date(form.startDate)) e.deadline = 'Дата окончания должна быть позже даты начала';
    if (form.type === 'practice_review' && !form.practiceAssignmentId) e.practiceAssignmentId = 'Выберите задание практики для проверки';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await apiClient.post(`/electives/${electiveId}/assignments`, {
        title: form.title, description: form.description, type: form.type,
        maxScore: Number(form.maxScore), startDate: form.startDate, deadline: form.deadline,
        requirements: form.requirements || undefined,
        practiceAssignmentId: form.practiceAssignmentId ? Number(form.practiceAssignmentId) : undefined,
      });
      setForm(emptyAssignment());
      setShowForm(false);
      onRefresh();
    } catch (err: any) { alert(err?.message || 'Ошибка'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить задание?')) return;
    try { await apiClient.delete(`/electives/${electiveId}/assignments/${id}`); onRefresh(); }
    catch (err: any) { alert(err?.message || 'Ошибка'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gh-fg">Задания ({items.length})</h2>
        <Button variant="primary" size="sm" onClick={() => setShowForm(v => !v)}>
          <Plus className="h-4 w-4 mr-1" /> Добавить задание
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Новое задание</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="a-title">Название задания *</Label>
              <Input id="a-title" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Введите название задания" />
              <ErrMsg msg={errors.title} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="a-desc">Описание задания *</Label>
              <Textarea id="a-desc" value={form.description} onChange={e => set('description', (e.target as HTMLTextAreaElement).value)} placeholder="Опишите задание..." rows={4} />
              <ErrMsg msg={errors.description} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Тип задания</Label>
                <Select value={form.type} onChange={v => set('type', v)}>
                  {ASSIGNMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="a-score">Максимальный балл</Label>
                <Input id="a-score" type="number" value={form.maxScore} onChange={e => set('maxScore', e.target.value)} min={1} />
                <ErrMsg msg={errors.maxScore} />
              </div>
            </div>

            {form.type === 'practice_review' && (
              <div className="space-y-2">
                <Label>Задание практики для проверки *</Label>
                {practiceItems.length === 0 ? (
                  <p className="text-sm text-yellow-400">Сначала создайте задание типа «Практика»</p>
                ) : (
                  <Select value={form.practiceAssignmentId} onChange={v => set('practiceAssignmentId', v)}>
                    <option value="">Выберите задание практики</option>
                    {practiceItems.map((a: any) => (
                      <option key={a.id} value={a.id}>{a.title}</option>
                    ))}
                  </Select>
                )}
                <ErrMsg msg={errors.practiceAssignmentId} />
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="a-start">Дата начала *</Label>
                <Input id="a-start" type="datetime-local" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
                <ErrMsg msg={errors.startDate} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="a-dead">Дедлайн *</Label>
                <Input id="a-dead" type="datetime-local" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
                <ErrMsg msg={errors.deadline} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="a-req">Требования / критерии оценки</Label>
              <Textarea id="a-req" value={form.requirements} onChange={e => set('requirements', (e.target as HTMLTextAreaElement).value)} placeholder="Критерии оценивания, требования к оформлению..." rows={4} />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)} disabled={saving}>Отмена</Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Создать задание
              </Button>
            </div>
          </form>
        </Card>
      )}

      {items.length === 0 ? (
        <Card className="p-8 text-center text-gray-400">Заданий пока нет</Card>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <Card key={item.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium border ${
                      item.type === 'practice' ? 'bg-green-600/20 text-green-400 border-green-600' :
                      item.type === 'test' ? 'bg-red-600/20 text-red-400 border-red-600' :
                      'bg-yellow-600/20 text-yellow-400 border-yellow-600'
                    }`}>
                      {ASSIGNMENT_TYPE_LABEL[item.type] ?? item.type}
                    </span>
                    <span className="text-xs text-gray-400">max {item.maxScore} баллов</span>
                  </div>
                  <p className="text-white font-medium">{item.title}</p>
                  {item.description && <p className="text-gray-400 text-sm mt-1 line-clamp-2">{item.description}</p>}
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Дедлайн: {formatDate(item.deadline)}
                  </p>
                </div>
                <button onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-red-400 ml-4 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────────────────── PARTICIPANTS TAB ────────────────────

function ParticipantsTab({ participants }: { participants: any[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gh-fg">Участники ({participants.length})</h2>
      {participants.length === 0 ? (
        <Card className="p-8 text-center text-gray-400">Никто ещё не записался</Card>
      ) : (
        <div className="space-y-2">
          {participants.map(p => (
            <Card key={p.id} className="p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                {p.user?.firstName?.[0]}{p.user?.lastName?.[0]}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{p.user?.firstName} {p.user?.lastName}</p>
                <p className="text-gray-400 text-xs">{p.user?.email}</p>
              </div>
              <span className="ml-auto text-xs text-gray-500">
                {new Date(p.enrolledAt).toLocaleDateString('ru-RU')}
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
