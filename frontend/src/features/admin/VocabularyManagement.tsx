'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { BookOpen, Plus, Edit, Trash2, Loader2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { apiClient } from '@/shared/api/client';
import DataTableFilters from '@/features/common/DataTableFilters';

const CATEGORIES = ['Программирование', 'Сети', 'IoT / Железо', 'Безопасность', 'Базы данных', 'ИИ / ML', 'Общее'];
const LEVEL_LABEL: Record<string, string> = { basic: 'Базовый', intermediate: 'Средний', advanced: 'Продвинутый' };
const LEVEL_COLOR: Record<string, string> = {
  basic:        'bg-green-900/40 text-green-400 border-green-800',
  intermediate: 'bg-yellow-900/40 text-yellow-400 border-yellow-800',
  advanced:     'bg-red-900/40 text-red-400 border-red-800',
};

interface VocabTerm {
  id: number; term: string; transcription: string; translation: string;
  category: string; definition: string; example: string; level: string;
}

const Badge = ({ children, variant = 'default', className = '' }: { children: React.ReactNode; variant?: 'default' | 'secondary' | 'outline'; className?: string }) => {
  const styles = { default: 'bg-blue-900 text-blue-300', secondary: 'bg-gray-800 text-gray-300', outline: 'border border-gray-600 text-gray-300' };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]} ${className}`}>{children}</span>;
};

const Dialog = ({ open, onOpenChange, children }: { open: boolean; onOpenChange: (v: boolean) => void; children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => onOpenChange(false)}>
      <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 12, boxShadow: '0 16px 48px rgba(0,0,0,0.5)', maxWidth: 680, width: '100%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

function TermForm({ initial, onSave, onCancel, saving }: {
  initial?: Partial<VocabTerm>; onSave: (d: any) => void; onCancel: () => void; saving: boolean;
}) {
  const [form, setForm] = useState({
    term: initial?.term || '', transcription: initial?.transcription || '',
    translation: initial?.translation || '', category: initial?.category || 'Программирование',
    definition: initial?.definition || '', example: initial?.example || '', level: initial?.level || 'basic',
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="p-6 space-y-4">
      <div className="mb-4 border-b border-gray-700 pb-4">
        <h3 className="text-lg font-semibold text-gh-fg flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {initial?.id ? 'Редактировать термин' : 'Добавить термин'}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Термин (English) *</label>
          <input value={form.term} onChange={e => set('term', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm" />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Транскрипция</label>
          <input value={form.transcription} onChange={e => set('transcription', e.target.value)} placeholder="[ˈeksæmpl]" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm" />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Перевод (RU) *</label>
          <input value={form.translation} onChange={e => set('translation', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm" />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-400 block mb-1">Категория</label>
            <select value={form.category} onChange={e => set('category', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Уровень</label>
            <select value={form.level} onChange={e => set('level', e.target.value)} className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm">
              <option value="basic">Базовый</option>
              <option value="intermediate">Средний</option>
              <option value="advanced">Продвинутый</option>
            </select>
          </div>
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-400 block mb-1">Определение (English) *</label>
        <textarea value={form.definition} onChange={e => set('definition', e.target.value)} rows={2} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm resize-none" />
      </div>
      <div>
        <label className="text-xs text-gray-400 block mb-1">Пример использования</label>
        <input value={form.example} onChange={e => set('example', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm" />
      </div>
      <div className="flex gap-2 pt-2">
        <Button onClick={() => onSave(form)} disabled={saving || !form.term || !form.translation || !form.definition} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Сохранить
        </Button>
        <Button variant="secondary" onClick={onCancel}>Отмена</Button>
      </div>
    </div>
  );
}

export default function VocabularyManagement() {
  const [terms, setTerms]         = useState<VocabTerm[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [sortBy, setSortBy]       = useState('term');
  const [sortOrder, setSortOrder] = useState<'asc'|'desc'>('asc');
  const [editTerm, setEditTerm]   = useState<VocabTerm | null>(null);
  const [showForm, setShowForm]   = useState(false);
  const [deleteId, setDeleteId]   = useState<number | null>(null);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [expanded, setExpanded]   = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setTerms(await apiClient.get('/vocabulary') || []); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = terms.filter(t =>
      (!q || t.term.toLowerCase().includes(q) || t.translation.toLowerCase().includes(q)) &&
      (!catFilter || t.category === catFilter)
    );
    result = [...result].sort((a: any, b: any) => {
      const av = a[sortBy] || '', bv = b[sortBy] || '';
      return sortOrder === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return result;
  }, [terms, search, catFilter, sortBy, sortOrder]);

  const handleSave = async (data: any) => {
    setSaving(true);
    try {
      if (editTerm) await apiClient.patch(`/vocabulary/${editTerm.id}`, data);
      else await apiClient.post('/vocabulary', data);
      await load();
      setShowForm(false); setEditTerm(null);
    } catch (e: any) { alert(e.message || 'Ошибка'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    setDeleting(true);
    try { await apiClient.delete(`/vocabulary/${deleteId}`); await load(); setDeleteId(null); }
    catch (e: any) { alert(e.message || 'Ошибка удаления'); } finally { setDeleting(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gh-fg">Словарь IT-терминов</h1>
          <p className="text-gray-400">Управление карточками технической лексики для студентов</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{filtered.length} / {terms.length}</Badge>
          <Button onClick={() => { setEditTerm(null); setShowForm(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Добавить термин
          </Button>
        </div>
      </div>

      <DataTableFilters
        searchPlaceholder="Поиск по термину или переводу..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[{ label: 'Все категории', value: catFilter, onChange: setCatFilter,
          options: CATEGORIES.map(c => ({ value: c, label: c })) }]}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOptions={[
          { value: 'term', label: 'По термину' },
          { value: 'translation', label: 'По переводу' },
          { value: 'category', label: 'По категории' },
          { value: 'level', label: 'По уровню' },
        ]}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BookOpen className="h-5 w-5" />
            Список терминов
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{search || catFilter ? 'Ничего не найдено' : 'Термины не добавлены'}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {filtered.map(t => (
                <div key={t.id} className="py-3">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpanded(expanded === t.id ? null : t.id)}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-semibold">{t.term}</span>
                        {t.transcription && <span className="text-gray-500 text-sm font-mono">{t.transcription}</span>}
                        <span className="text-blue-400 text-sm">{t.translation}</span>
                      </div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{t.category}</Badge>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${LEVEL_COLOR[t.level] || LEVEL_COLOR.basic}`}>
                          {LEVEL_LABEL[t.level] || t.level}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm" variant="secondary" onClick={e => { e.stopPropagation(); setEditTerm(t); setShowForm(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="primary" onClick={e => { e.stopPropagation(); setDeleteId(t.id); }} className="bg-red-600 hover:bg-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {expanded === t.id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                    </div>
                  </div>
                  {expanded === t.id && (
                    <div className="mt-3 pl-2 space-y-1 text-sm">
                      <p className="text-gray-300"><span className="text-gray-500">Определение: </span>{t.definition}</p>
                      {t.example && <p className="text-gray-400 italic"><span className="text-gray-500 not-italic">Пример: </span>"{t.example}"</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form modal */}
      <Dialog open={showForm} onOpenChange={v => { setShowForm(v); if (!v) setEditTerm(null); }}>
        <TermForm initial={editTerm || undefined} onSave={handleSave} onCancel={() => { setShowForm(false); setEditTerm(null); }} saving={saving} />
      </Dialog>

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="mb-4 border-b border-gray-700 pb-4">
              <h3 className="text-lg font-semibold text-gh-fg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" /> Удалить термин?
              </h3>
            </div>
            <p className="text-sm text-gray-400 mb-6">Это действие нельзя отменить.</p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setDeleteId(null)} disabled={deleting}>Отмена</Button>
              <Button onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700 gap-2">
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Удалить
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
