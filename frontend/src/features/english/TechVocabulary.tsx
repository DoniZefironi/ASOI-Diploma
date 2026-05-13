'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '@/shared/lib/auth-context';
import { apiClient } from '@/shared/api/client';

const CATEGORIES = ['Программирование', 'Сети', 'IoT / Железо', 'Безопасность', 'Базы данных', 'ИИ / ML', 'Общее'];

const LEVEL_LABEL: Record<string, string> = { basic: 'Базовый', intermediate: 'Средний', advanced: 'Продвинутый' };
const LEVEL_COLOR: Record<string, string> = {
  basic:        'bg-green-900/40 text-green-400 border-green-800',
  intermediate: 'bg-yellow-900/40 text-yellow-400 border-yellow-800',
  advanced:     'bg-red-900/40 text-red-400 border-red-800',
};

interface VocabTerm {
  id: number;
  term: string;
  transcription: string;
  translation: string;
  category: string;
  definition: string;
  example: string;
  level: string;
}

function canManageVocab(roles: string[]): boolean {
  return roles.includes('admin') || roles.some(r => r.startsWith('mentor_'));
}

function TermCard({ term, canManage, onDelete, onEdit }: {
  term: VocabTerm;
  canManage: boolean;
  onDelete: (id: number) => void;
  onEdit: (term: VocabTerm) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-blue-600 transition-colors">
      <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-semibold text-base">{term.term}</span>
            {term.transcription && <span className="text-gray-500 text-sm font-mono">{term.transcription}</span>}
          </div>
          <div className="text-blue-400 text-sm mt-0.5">{term.translation}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${LEVEL_COLOR[term.level] || LEVEL_COLOR.basic}`}>
            {LEVEL_LABEL[term.level] || term.level}
          </span>
          <span className="text-gray-500 text-xs">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-700 space-y-2">
          <p className="text-gray-300 text-sm leading-relaxed">
            <span className="text-gray-500 text-xs uppercase tracking-wide mr-1">Определение:</span>
            {term.definition}
          </p>
          {term.example && (
            <p className="text-gray-400 text-sm italic leading-relaxed">
              <span className="text-gray-500 text-xs uppercase tracking-wide not-italic mr-1">Пример:</span>
              "{term.example}"
            </p>
          )}
          {canManage && (
            <div className="flex gap-2 pt-1">
              <button onClick={e => { e.stopPropagation(); onEdit(term); }} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded px-3 py-1 border border-gray-600">✏️ Изменить</button>
              <button onClick={e => { e.stopPropagation(); onDelete(term.id); }} className="text-xs bg-red-900/50 hover:bg-red-800 text-red-300 rounded px-3 py-1 border border-red-800">🗑 Удалить</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TermForm({ initial, onSave, onCancel, saving }: {
  initial?: Partial<VocabTerm>;
  onSave: (data: Omit<VocabTerm, 'id'>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    term: initial?.term || '',
    transcription: initial?.transcription || '',
    translation: initial?.translation || '',
    category: initial?.category || 'Программирование',
    definition: initial?.definition || '',
    example: initial?.example || '',
    level: initial?.level || 'basic',
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="bg-gray-800 border border-blue-700 rounded-xl p-5 space-y-3">
      <h3 className="text-white font-semibold">{initial?.id ? 'Редактировать термин' : 'Добавить термин'}</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Термин (English) *</label>
          <input value={form.term} onChange={e => set('term', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Транскрипция</label>
          <input value={form.transcription} onChange={e => set('transcription', e.target.value)} placeholder="[ˈeksæmpl]" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Перевод (RU) *</label>
          <input value={form.translation} onChange={e => set('translation', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
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
        <textarea value={form.definition} onChange={e => set('definition', e.target.value)} rows={2} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-blue-500" />
      </div>
      <div>
        <label className="text-xs text-gray-400 block mb-1">Пример использования</label>
        <input value={form.example} onChange={e => set('example', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
      </div>
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onSave(form as Omit<VocabTerm, 'id'>)}
          disabled={saving || !form.term || !form.translation || !form.definition}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button onClick={onCancel} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm transition-colors">Отмена</button>
      </div>
    </div>
  );
}

export function TechVocabulary() {
  const { user } = useAuth();
  const userRoles: string[] = user?.roles || [];
  const isManager = canManageVocab(userRoles);

  const [terms, setTerms]           = useState<VocabTerm[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('');
  const [level, setLevel]           = useState('');
  const [quizMode, setQuizMode]     = useState(false);
  const [quizIndex, setQuizIndex]   = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [editTerm, setEditTerm]     = useState<VocabTerm | null>(null);
  const [saving, setSaving]         = useState(false);

  const fetchTerms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/vocabulary');
      setTerms(data || []);
    } catch {
      setTerms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTerms(); }, [fetchTerms]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return terms.filter(t =>
      (!q || t.term.toLowerCase().includes(q) || t.translation.toLowerCase().includes(q) || t.definition?.toLowerCase().includes(q)) &&
      (!category || t.category === category) &&
      (!level || t.level === level)
    );
  }, [terms, search, category, level]);

  const quizList = useMemo(() => [...filtered].sort(() => Math.random() - 0.5), [filtered]);
  const quizTerm = quizList[quizIndex % (quizList.length || 1)];

  const handleSave = async (data: Omit<VocabTerm, 'id'>) => {
    setSaving(true);
    try {
      if (editTerm) {
        await apiClient.patch(`/vocabulary/${editTerm.id}`, data);
      } else {
        await apiClient.post('/vocabulary', data);
      }
      await fetchTerms();
      setShowForm(false);
      setEditTerm(null);
    } catch (e: any) {
      alert(e.message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить термин?')) return;
    try {
      await apiClient.delete(`/vocabulary/${id}`);
      setTerms(t => t.filter(x => x.id !== id));
    } catch (e: any) {
      alert(e.message || 'Ошибка удаления');
    }
  };

  const handleEdit = (term: VocabTerm) => {
    setEditTerm(term);
    setShowForm(true);
    setQuizMode(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gh-fg flex items-center gap-2">
            📖 Technical English Vocabulary
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {loading ? 'Загрузка...' : `${filtered.length} из ${terms.length} терминов`}
            {' · '}нажми на карточку для определения
          </p>
        </div>
        <div className="flex gap-2">
          {isManager && (
            <button
              onClick={() => { setEditTerm(null); setShowForm(s => !s); setQuizMode(false); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showForm && !editTerm ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
            >
              ＋ Добавить
            </button>
          )}
          <button
            onClick={() => { setQuizMode(q => !q); setQuizIndex(0); setShowAnswer(false); setShowForm(false); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${quizMode ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
          >
            {quizMode ? '📚 Список' : '🎮 Тренировка'}
          </button>
        </div>
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <TermForm
          initial={editTerm || undefined}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditTerm(null); }}
          saving={saving}
        />
      )}

      {/* Filters */}
      {!quizMode && (
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Поиск по термину, переводу, описанию..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)} className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 min-w-[160px]">
            <option value="">Все категории</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={level} onChange={e => setLevel(e.target.value)} className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2">
            <option value="">Все уровни</option>
            <option value="basic">Базовый</option>
            <option value="intermediate">Средний</option>
            <option value="advanced">Продвинутый</option>
          </select>
        </div>
      )}

      {/* Quiz mode */}
      {quizMode && quizTerm ? (
        <div className="max-w-lg mx-auto">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center">
            <div className="text-xs text-gray-500 mb-4 uppercase tracking-wide">
              Карточка {(quizIndex % quizList.length) + 1} / {quizList.length}
            </div>
            <div className="text-3xl font-bold text-gh-fg mb-2">{quizTerm.term}</div>
            {quizTerm.transcription && <div className="text-gray-400 font-mono mb-4">{quizTerm.transcription}</div>}
            <div className={`text-sm inline-block px-2 py-0.5 rounded-full border mb-4 ${LEVEL_COLOR[quizTerm.level] || LEVEL_COLOR.basic}`}>
              {quizTerm.category} · {LEVEL_LABEL[quizTerm.level] || quizTerm.level}
            </div>

            {showAnswer ? (
              <div className="mt-4 space-y-3 text-left">
                <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-4">
                  <div className="text-blue-300 font-semibold text-lg">{quizTerm.translation}</div>
                  <div className="text-gray-300 text-sm mt-2">{quizTerm.definition}</div>
                  {quizTerm.example && <div className="text-gray-500 text-sm italic mt-2">"{quizTerm.example}"</div>}
                </div>
                <button
                  onClick={() => { setQuizIndex(i => i + 1); setShowAnswer(false); }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                >
                  Следующий →
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAnswer(true)}
                className="mt-4 w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
              >
                Показать перевод
              </button>
            )}
          </div>
        </div>
      ) : !quizMode && (
        loading ? (
          <div className="text-center text-gray-500 py-12">Загрузка терминов...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p className="text-lg">Ничего не найдено</p>
            <button onClick={() => { setSearch(''); setCategory(''); setLevel(''); }} className="mt-3 text-sm text-blue-400 hover:underline">Сбросить фильтры</button>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map(term => (
              <TermCard key={term.id} term={term} canManage={isManager} onDelete={handleDelete} onEdit={handleEdit} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
