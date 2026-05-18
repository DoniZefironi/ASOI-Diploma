'use client';
import React, { useState } from 'react';
import { useAdminInternships, type Internship } from '@/shared/api/internships';
import { apiClient } from '@/shared/api/client';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Plus, Pencil, Trash2, Building2, MapPin, Clock, Banknote } from 'lucide-react';
import { Modal, ModalCancelBtn, ModalSubmitBtn } from '@/shared/ui/modal';

const FORMAT_OPTIONS = [
  { value: 'office', label: 'Офис' },
  { value: 'remote', label: 'Удалённо' },
  { value: 'hybrid', label: 'Гибрид' },
];

const FORMAT_LABELS: Record<string, string> = {
  remote: 'Удалённо',
  office: 'Офис',
  hybrid: 'Гибрид',
};

const EMPTY_FORM = {
  title: '',
  company: '',
  companyDescription: '',
  description: '',
  requirements: '',
  prospects: '',
  location: '',
  format: 'office',
  duration: '',
  salary: '',
  applicationEmail: '',
  applicationUrl: '',
  imageUrl: '',
  isActive: true,
  deadline: '',
  tags: '',
};

type FormState = typeof EMPTY_FORM;

function InternshipForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: FormState;
  onSave: (data: FormState) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const set = (field: keyof FormState, val: string | boolean) =>
    setForm(f => ({ ...f, [field]: val }));

  const inputCls =
    'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500';
  const labelCls = 'block text-xs text-gray-400 mb-1';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Название стажировки *</label>
          <input className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Junior Frontend Developer" />
        </div>
        <div>
          <label className={labelCls}>Компания *</label>
          <input className={inputCls} value={form.company} onChange={e => set('company', e.target.value)} placeholder="ООО «Ромашка»" />
        </div>
        <div>
          <label className={labelCls}>Формат</label>
          <select className={inputCls} value={form.format} onChange={e => set('format', e.target.value)}>
            {FORMAT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Местоположение</label>
          <input className={inputCls} value={form.location} onChange={e => set('location', e.target.value)} placeholder="Москва / Дистанционно" />
        </div>
        <div>
          <label className={labelCls}>Продолжительность</label>
          <input className={inputCls} value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="3 месяца" />
        </div>
        <div>
          <label className={labelCls}>Компенсация / зарплата</label>
          <input className={inputCls} value={form.salary} onChange={e => set('salary', e.target.value)} placeholder="50 000 ₽ / мес" />
        </div>
        <div>
          <label className={labelCls}>Email для заявок</label>
          <input className={inputCls} type="email" value={form.applicationEmail} onChange={e => set('applicationEmail', e.target.value)} placeholder="hr@company.ru" />
        </div>
        <div>
          <label className={labelCls}>Ссылка для подачи заявки</label>
          <input className={inputCls} value={form.applicationUrl} onChange={e => set('applicationUrl', e.target.value)} placeholder="https://company.ru/jobs/..." />
        </div>
        <div>
          <label className={labelCls}>Дедлайн заявок</label>
          <input className={inputCls} type="datetime-local" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Теги (через запятую)</label>
          <input className={inputCls} value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="React, TypeScript, Junior" />
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Изображение (URL)</label>
          <input className={inputCls} value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..." />
        </div>
      </div>

      <div>
        <label className={labelCls}>О компании</label>
        <textarea className={inputCls} rows={3} value={form.companyDescription} onChange={e => set('companyDescription', e.target.value)} placeholder="Краткое описание компании..." />
      </div>
      <div>
        <label className={labelCls}>Описание стажировки *</label>
        <textarea className={inputCls} rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Чем будет заниматься стажёр..." />
      </div>
      <div>
        <label className={labelCls}>Требования к кандидату</label>
        <textarea className={inputCls} rows={4} value={form.requirements} onChange={e => set('requirements', e.target.value)} placeholder="Знание JS, опыт работы с React..." />
      </div>
      <div>
        <label className={labelCls}>Перспективы</label>
        <textarea className={inputCls} rows={3} value={form.prospects} onChange={e => set('prospects', e.target.value)} placeholder="Возможность трудоустройства по результатам стажировки..." />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={form.isActive}
          onChange={e => set('isActive', e.target.checked)}
          className="rounded border-gray-600 bg-gray-800"
        />
        <label htmlFor="isActive" className="text-sm text-gray-300 cursor-pointer">Активна (видна студентам)</label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="primary" onClick={() => onSave(form)} disabled={saving || !form.title || !form.company || !form.description}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={saving}>Отмена</Button>
      </div>
    </div>
  );
}

function internshipToForm(i: Internship): FormState {
  return {
    title: i.title,
    company: i.company,
    companyDescription: i.companyDescription ?? '',
    description: i.description,
    requirements: i.requirements ?? '',
    prospects: i.prospects ?? '',
    location: i.location ?? '',
    format: i.format ?? 'office',
    duration: i.duration ?? '',
    salary: i.salary ?? '',
    applicationEmail: i.applicationEmail ?? '',
    applicationUrl: i.applicationUrl ?? '',
    imageUrl: i.imageUrl ?? '',
    isActive: i.isActive,
    deadline: i.deadline ? new Date(i.deadline).toISOString().slice(0, 16) : '',
    tags: i.tags?.join(', ') ?? '',
  };
}

function formToPayload(form: FormState) {
  return {
    title: form.title,
    company: form.company,
    companyDescription: form.companyDescription || undefined,
    description: form.description,
    requirements: form.requirements || undefined,
    prospects: form.prospects || undefined,
    location: form.location || undefined,
    format: form.format,
    duration: form.duration || undefined,
    salary: form.salary || undefined,
    applicationEmail: form.applicationEmail || undefined,
    applicationUrl: form.applicationUrl || undefined,
    imageUrl: form.imageUrl || undefined,
    isActive: form.isActive,
    deadline: form.deadline || undefined,
    tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
  };
}

export default function AdminInternshipsPage() {
  const { internships, isLoading, mutate } = useAdminInternships();
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const handleCreate = async (form: FormState) => {
    setSaving(true);
    try {
      await apiClient.post('/internships', formToPayload(form));
      await mutate();
      setShowCreate(false);
    } catch (e: any) {
      alert(e?.message || 'Ошибка при создании');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: number, form: FormState) => {
    setSaving(true);
    try {
      await apiClient.patch(`/internships/${id}`, formToPayload(form));
      await mutate();
      setEditId(null);
    } catch (e: any) {
      alert(e?.message || 'Ошибка при обновлении');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Удалить стажировку «${title}»?`)) return;
    try {
      await apiClient.delete(`/internships/${id}`);
      await mutate();
    } catch (e: any) {
      alert(e?.message || 'Ошибка при удалении');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">Стажировки</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Управление стажировками для студентов</p>
        </div>
        {!showCreate && (
          <Button variant="primary" onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Добавить стажировку
          </Button>
        )}
      </div>

      {/* Create modal */}
      {showCreate && (
        <Modal title="Добавить стажировку" onClose={() => setShowCreate(false)} maxWidth={700}>
          <InternshipForm
            initial={EMPTY_FORM}
            onSave={handleCreate}
            onCancel={() => setShowCreate(false)}
            saving={saving}
          />
        </Modal>
      )}

      {/* List */}
      {isLoading ? (
        <Card className="p-8 text-center text-muted-foreground">Загрузка...</Card>
      ) : internships.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-card-foreground font-medium mb-1">Стажировок пока нет</p>
          <p className="text-muted-foreground text-sm">Нажмите «Добавить стажировку», чтобы создать первую</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {internships.map(internship => (
            <Card key={internship.id} className="p-5">
              {editId === internship.id && (
                <Modal title={`Редактирование: ${internship.title}`} onClose={() => setEditId(null)} maxWidth={700}>
                  <InternshipForm
                    initial={internshipToForm(internship)}
                    onSave={form => handleUpdate(internship.id, form)}
                    onCancel={() => setEditId(null)}
                    saving={saving}
                  />
                </Modal>
              )}
              {editId !== internship.id && (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-lg font-semibold text-card-foreground">{internship.title}</span>
                      {!internship.isActive && (
                        <span className="px-2 py-0.5 bg-red-900/30 border border-red-700 text-red-400 rounded-full text-xs">Неактивна</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-2">
                      <Building2 className="h-4 w-4" />
                      <span>{internship.company}</span>
                      <span className="mx-1">·</span>
                      <span>{FORMAT_LABELS[internship.format] ?? internship.format}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {internship.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{internship.location}</span>}
                      {internship.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{internship.duration}</span>}
                      {internship.salary && <span className="flex items-center gap-1"><Banknote className="h-3 w-3" />{internship.salary}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="secondary" size="sm" onClick={() => setEditId(internship.id)} className="gap-1">
                      <Pencil className="h-3.5 w-3.5" />
                      Изменить
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDelete(internship.id, internship.title)}
                      className="gap-1 text-red-400 hover:text-red-300 border-red-800 hover:border-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Удалить
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
