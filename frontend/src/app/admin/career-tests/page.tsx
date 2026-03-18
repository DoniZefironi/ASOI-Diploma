'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import {
  useAdminTests,
  adminCreateTest,
  adminUpdateTest,
  adminDeleteTest,
  type CareerTestFull,
} from '@/shared/api/admin/professional-orientation';
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, Loader2, Save, X } from 'lucide-react';

export default function AdminCareerTestsPage() {
  const { tests, isLoading, mutate } = useAdminTests();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-gray-400 hover:text-white text-sm mb-2 block">← Панель администратора</Link>
            <h1 className="text-3xl font-bold text-white">Тесты профориентации</h1>
            <p className="text-gray-400 mt-1">Управление тестами и вопросами</p>
          </div>
          <Button variant="primary" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Новый тест
          </Button>
        </div>

        {creating && (
          <TestForm
            onSave={async (data) => {
              await adminCreateTest(data);
              await mutate();
              setCreating(false);
            }}
            onCancel={() => setCreating(false)}
          />
        )}

        <div className="space-y-4">
          {tests.map(test => (
            <TestCard
              key={test.type}
              test={test}
              isEditing={editing === test.type}
              onEdit={() => setEditing(test.type)}
              onCancel={() => setEditing(null)}
              onSave={async (data) => {
                await adminUpdateTest(test.type, data);
                await mutate();
                setEditing(null);
              }}
              onDelete={async () => {
                if (!confirm(`Удалить тест "${test.title}"?`)) return;
                await adminDeleteTest(test.type);
                await mutate();
              }}
            />
          ))}

          {tests.length === 0 && !creating && (
            <Card className="p-12 text-center">
              <p className="text-gray-400">Тестов пока нет.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Test card ──────────────────────────────────────────────────────────────

function TestCard({
  test,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onDelete,
}: {
  test: CareerTestFull;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (data: Partial<CareerTestFull>) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);

  if (isEditing) {
    return (
      <TestForm
        initial={test}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono bg-gray-700 text-gray-300 px-2 py-0.5 rounded">{test.type}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${test.isActive ? 'bg-green-900/40 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                {test.isActive ? 'Активен' : 'Скрыт'}
              </span>
              <span className="text-xs text-gray-500">{test.answerFormat === 'yes_no' ? 'Да/Нет' : 'Выбор A/B'}</span>
            </div>
            <h3 className="text-lg font-semibold text-white">{test.title}</h3>
            {test.description && <p className="text-gray-400 text-sm mt-1">{test.description}</p>}
            <p className="text-gray-500 text-xs mt-2">{test.questions?.length ?? 0} вопросов · {test.duration}</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button onClick={onEdit} className="p-2 text-gray-400 hover:text-white transition-colors">
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
            <button onClick={() => setExpanded(e => !e)} className="p-2 text-gray-400 hover:text-white transition-colors">
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-700 p-5">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-3">Вопросы</p>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {test.questions?.map((q: any, idx: number) => (
              <div key={q.id ?? idx} className="text-sm p-3 bg-gray-800 rounded-lg">
                {test.answerFormat === 'yes_no' ? (
                  <div className="flex gap-2">
                    <span className="text-gray-500">#{idx + 1}</span>
                    <span className="text-gray-300">{q.text}</span>
                    <span className="ml-auto text-xs text-blue-400">[{q.category}]</span>
                  </div>
                ) : (
                  <div>
                    <div className="text-gray-500 text-xs mb-1">#{idx + 1}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-gray-300">A: {q.a?.text} <span className="text-blue-400 text-xs">[{q.a?.category}]</span></div>
                      <div className="text-gray-300">B: {q.b?.text} <span className="text-blue-400 text-xs">[{q.b?.category}]</span></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

// ── Test form ──────────────────────────────────────────────────────────────

function TestForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: CareerTestFull;
  onSave: (data: Partial<CareerTestFull>) => Promise<void>;
  onCancel: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [fields, setFields] = useState({
    type: initial?.type ?? '',
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    duration: initial?.duration ?? '10–15 минут',
    answerFormat: initial?.answerFormat ?? 'yes_no',
    isActive: initial?.isActive ?? true,
  });
  const [questionsJson, setQuestionsJson] = useState(
    JSON.stringify(initial?.questions ?? [], null, 2),
  );
  const [metaJson, setMetaJson] = useState(
    JSON.stringify(initial?.categoryMeta ?? {}, null, 2),
  );
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleSave = async () => {
    setJsonError(null);
    let questions: any[];
    let categoryMeta: any;
    try {
      questions = JSON.parse(questionsJson);
      categoryMeta = JSON.parse(metaJson);
    } catch (e: any) {
      setJsonError('Ошибка в JSON: ' + e.message);
      return;
    }
    setSaving(true);
    try {
      await onSave({ ...fields, questions, categoryMeta });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6 border-blue-600 mb-4">
      <h3 className="text-lg font-semibold text-white mb-5">
        {initial ? `Редактировать: ${initial.title}` : 'Новый тест'}
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Тип (slug, уникальный)</label>
          <input
            value={fields.type}
            onChange={e => setFields(f => ({ ...f, type: e.target.value }))}
            disabled={!!initial}
            placeholder="holland"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm disabled:opacity-50"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Длительность</label>
          <input
            value={fields.duration}
            onChange={e => setFields(f => ({ ...f, duration: e.target.value }))}
            placeholder="10–15 минут"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs text-gray-400 block mb-1">Название</label>
        <input
          value={fields.title}
          onChange={e => setFields(f => ({ ...f, title: e.target.value }))}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
        />
      </div>

      <div className="mb-4">
        <label className="text-xs text-gray-400 block mb-1">Описание</label>
        <textarea
          value={fields.description}
          onChange={e => setFields(f => ({ ...f, description: e.target.value }))}
          rows={2}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm resize-none"
        />
      </div>

      <div className="flex gap-4 mb-4">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Формат ответов</label>
          <select
            value={fields.answerFormat}
            onChange={e => setFields(f => ({ ...f, answerFormat: e.target.value }))}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="yes_no">Да / Нет</option>
            <option value="choice">Выбор A / B</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer mt-5">
          <input
            type="checkbox"
            checked={fields.isActive}
            onChange={e => setFields(f => ({ ...f, isActive: e.target.checked }))}
            className="rounded border-gray-600"
          />
          Активен
        </label>
      </div>

      <div className="mb-4">
        <label className="text-xs text-gray-400 block mb-1">
          Вопросы (JSON)
          {fields.answerFormat === 'yes_no'
            ? ' — формат: [{"id":1,"text":"...","category":"R"}, ...]'
            : ' — формат: [{"id":1,"a":{"text":"...","category":"ЧЧ"},"b":{"text":"...","category":"ЧТ"}}, ...]'}
        </label>
        <textarea
          value={questionsJson}
          onChange={e => setQuestionsJson(e.target.value)}
          rows={10}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-green-300 text-xs font-mono resize-y"
        />
      </div>

      <div className="mb-4">
        <label className="text-xs text-gray-400 block mb-1">
          Метаданные категорий (JSON) — формат: {`{"R":{"label":"...","description":"...","careers":["..."]}}`}
        </label>
        <textarea
          value={metaJson}
          onChange={e => setMetaJson(e.target.value)}
          rows={8}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-green-300 text-xs font-mono resize-y"
        />
      </div>

      {jsonError && <p className="text-red-400 text-sm mb-3">{jsonError}</p>}

      <div className="flex gap-3">
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Сохранить
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Отмена
        </Button>
      </div>
    </Card>
  );
}
