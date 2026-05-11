'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

interface AiAssistantProps {
  onClose: () => void;
}

const SYSTEM_PROMPT = `Ты — помощник по цифровой электронике и логическим схемам.
Отвечай на русском языке. Помогай пользователям разбираться с:
- Логическими вентилями (AND, OR, NOT, XOR и др.)
- Триггерами (D, T, JK, SR)
- Сумматорами и вычитателями
- Счётчиками и регистрами сдвига
- Мультиплексорами и демультиплексорами
- Булевой алгеброй и таблицами истинности
- Проектированием цифровых схем
Давай краткие, практичные ответы.`;

export const AiAssistant: React.FC<AiAssistantProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Привет! Я помогу тебе разобраться с логическими схемами. Спрашивай о вентилях, триггерах, сумматорах и любых других элементах.' },
  ]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [apiKey, setApiKey]     = useState(() => localStorage.getItem('yandex_api_key') || '');
  const [folderId, setFolderId] = useState(() => localStorage.getItem('yandex_folder_id') || '');
  const [showSettings, setShowSettings] = useState(!apiKey || !folderId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const saveSettings = () => {
    localStorage.setItem('yandex_api_key', apiKey);
    localStorage.setItem('yandex_folder_id', folderId);
    setShowSettings(false);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    if (!apiKey || !folderId) { setShowSettings(true); return; }

    const userMsg: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2904';
      const res = await fetch(`${apiUrl}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          folderId,
          messages: [
            { role: 'system', text: SYSTEM_PROMPT },
            ...messages.map(m => ({ role: m.role, text: m.text })),
            { role: 'user', text },
          ],
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const data = await res.json();
      const reply = data?.result?.alternatives?.[0]?.message?.text || 'Нет ответа';
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (e: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `Ошибка: ${e.message || 'Не удалось получить ответ'}. Проверьте API-ключ и Folder ID в настройках.`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 text-sm font-semibold">🤖 ИИ-помощник</span>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setShowSettings(s => !s)} className="text-gray-400 hover:text-white px-2 py-1 rounded text-xs hover:bg-gray-700">⚙️</button>
          <button onClick={onClose} className="text-gray-400 hover:text-white px-2 py-1 rounded text-xs hover:bg-gray-700">✕</button>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="bg-gray-800 border-b border-gray-700 p-3 space-y-2">
          <p className="text-xs text-gray-400">Настройки Yandex API</p>
          <input
            type="password"
            placeholder="API-ключ"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            className="w-full bg-gray-700 text-white text-xs rounded px-2 py-1.5 border border-gray-600 placeholder-gray-500"
          />
          <input
            type="text"
            placeholder="Folder ID"
            value={folderId}
            onChange={e => setFolderId(e.target.value)}
            className="w-full bg-gray-700 text-white text-xs rounded px-2 py-1.5 border border-gray-600 placeholder-gray-500"
          />
          <button
            onClick={saveSettings}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs rounded py-1.5"
          >
            Сохранить
          </button>
          <p className="text-xs text-gray-500">
            Ключ хранится только в браузере. Получить в Yandex Cloud Console.
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[90%] rounded-lg px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-200'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-400 rounded-lg px-3 py-2 text-xs">...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-3 pb-2 flex flex-wrap gap-1">
        {['Что такое XOR?', 'Как работает D-триггер?', 'Таблица истинности AND'].map(q => (
          <button
            key={q}
            onClick={() => { setInput(q); }}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded px-2 py-0.5 border border-gray-600"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 p-3 border-t border-gray-700">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Спроси про схемы..."
          rows={2}
          className="flex-1 bg-gray-700 text-white text-xs rounded px-2 py-1.5 border border-gray-600 resize-none placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-xs rounded px-3 self-end py-1.5"
        >
          →
        </button>
      </div>
    </div>
  );
};
