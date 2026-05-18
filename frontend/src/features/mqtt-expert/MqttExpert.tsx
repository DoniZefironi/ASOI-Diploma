'use client';

import { useState, useMemo, useCallback, useRef, type ReactNode } from 'react';
import { Plus, Trash2, Send, ChevronRight, CheckCircle, AlertTriangle, XCircle, Info, Radio, BookOpen } from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────────
type QoS = 0 | 1 | 2;
type Severity = 'error' | 'warning' | 'tip' | 'good';

interface Topic {
  id: string;
  path: string;
  description: string;
  dataType: string;
}

interface MqttMessage {
  id: string;
  topicPath: string;
  payload: string;
  qos: QoS;
  retain: boolean;
  ts: number;
}

interface ExpertFinding {
  severity: Severity;
  category: string;
  title: string;
  detail: string;
}

// ── Expert Rules Engine ─────────────────────────────────────────────
function analyzeTopics(topics: Topic[], messages: MqttMessage[]): ExpertFinding[] {
  const findings: ExpertFinding[] = [];
  if (topics.length === 0) return findings;

  topics.forEach(t => {
    const parts = t.path.split('/').filter(Boolean);

    // Space in topic
    if (t.path.includes(' '))
      findings.push({ severity: 'error', category: 'Формат', title: `«${t.path}» содержит пробелы`, detail: 'Пробелы в топиках запрещены стандартом MQTT. Используйте / или _ для разделения слов.' });

    // Wildcard misuse
    if (t.path.includes('#') && !t.path.endsWith('/#') && t.path !== '#')
      findings.push({ severity: 'error', category: 'Wildcards', title: `# должен быть только в конце`, detail: `Топик «${t.path}»: многоуровневый wildcard # можно использовать только в конце: home/sensors/#` });

    if (t.path.includes('+') && /\+[^/]/.test(t.path))
      findings.push({ severity: 'error', category: 'Wildcards', title: `+ должен занимать целый уровень`, detail: `Топик «${t.path}»: правильно home/+/temperature, неправильно home/sensor+/temperature` });

    // Leading/trailing slash
    if (t.path.startsWith('/') || t.path.endsWith('/'))
      findings.push({ severity: 'warning', category: 'Формат', title: `Лишний слэш в «${t.path}»`, detail: 'Ведущий или завершающий / создаёт пустой уровень. Пример: /home/temp → home/temp' });

    // Too shallow
    if (parts.length === 1 && !t.path.includes('+') && !t.path.includes('#'))
      findings.push({ severity: 'warning', category: 'Иерархия', title: `«${t.path}» — слишком плоская структура`, detail: 'Топик из одного уровня неудобен при масштабировании. Рекомендуется: device_id/sensor_type/metric' });

    // Too deep
    if (parts.length > 6)
      findings.push({ severity: 'warning', category: 'Иерархия', title: `«${t.path}» — слишком глубокая иерархия (${parts.length} уровней)`, detail: 'Рекомендуется 3–5 уровней. Глубже — сложно обслуживать и больше трафик.' });

    // Good depth
    if (parts.length >= 2 && parts.length <= 5 && !t.path.includes(' '))
      findings.push({ severity: 'good', category: 'Иерархия', title: `«${t.path}» — хорошая глубина`, detail: `${parts.length} уровня — оптимально для MQTT.` });

    // Uppercase in topic
    if (/[A-Z]/.test(t.path))
      findings.push({ severity: 'tip', category: 'Стиль', title: `«${t.path}» содержит заглавные буквы`, detail: 'MQTT топики регистрозависимы. Рекомендуется использовать только строчные буквы для однообразия.' });

    // Generic names
    const generic = ['data', 'info', 'message', 'msg', 'value', 'val', 'test'];
    if (parts.some(p => generic.includes(p.toLowerCase())))
      findings.push({ severity: 'tip', category: 'Стиль', title: `«${t.path}» использует нечёткое имя уровня`, detail: 'Имена вроде «data» или «value» не информативны. Лучше: temperature, humidity, status, state.' });
  });

  // Check for duplicate topics
  const paths = topics.map(t => t.path);
  const dups = paths.filter((p, i) => paths.indexOf(p) !== i);
  if (dups.length > 0)
    findings.push({ severity: 'error', category: 'Дубликаты', title: `Обнаружены дублирующиеся топики`, detail: `Топики ${[...new Set(dups)].map(d => `«${d}»`).join(', ')} встречаются несколько раз.` });

  // Analyze messages
  messages.forEach(m => {
    const topic = topics.find(t => t.path === m.topicPath);
    if (!topic) return;

    // Retain + QoS 0 is unreliable
    if (m.retain && m.qos === 0)
      findings.push({ severity: 'warning', category: 'QoS + Retain', title: `Retain с QoS 0 ненадёжен`, detail: `Топик «${m.topicPath}»: при QoS 0 доставка не гарантирована, retain-сообщение может не сохраниться. Для retain используйте QoS 1 или 2.` });

    // High frequency + QoS 2 is expensive
    const topicMsgs = messages.filter(msg => msg.topicPath === m.topicPath);
    if (topicMsgs.length > 5 && m.qos === 2)
      findings.push({ severity: 'tip', category: 'Производительность', title: `QoS 2 для частой телеметрии избыточен`, detail: `Топик «${m.topicPath}»: QoS 2 требует 4 сообщения на одну доставку. Для телеметрии (температура, влажность) достаточно QoS 0 или 1.` });

    // Command topic without QoS >= 1
    if ((topic.description.toLowerCase().includes('команд') || topic.path.includes('cmd') || topic.path.includes('command') || topic.path.includes('set')) && m.qos === 0)
      findings.push({ severity: 'warning', category: 'QoS', title: `Команда с QoS 0 может потеряться`, detail: `Топик «${m.topicPath}» похож на топик команд. Для управляющих сообщений рекомендуется QoS 1 или 2, чтобы гарантировать доставку.` });
  });

  // Check for LWT recommendation
  const hasStatus = topics.some(t => t.path.includes('status') || t.path.includes('online') || t.path.includes('lwt') || t.path.includes('state'));
  if (topics.length >= 2 && !hasStatus)
    findings.push({ severity: 'tip', category: 'Best Practice', title: 'Рекомендуется топик статуса (LWT)', detail: 'Last Will and Testament: добавьте топик вроде device/status или device/online с retain=true, чтобы отслеживать доступность устройства.' });

  // Check retain usage for status
  const statusTopics = topics.filter(t => t.path.includes('status') || t.path.includes('online') || t.path.includes('state'));
  statusTopics.forEach(t => {
    const statusMsgs = messages.filter(m => m.topicPath === t.path && !m.retain);
    if (statusMsgs.length > 0)
      findings.push({ severity: 'tip', category: 'Retain', title: `Топик статуса «${t.path}» — рекомендуется retain`, detail: 'Топики состояния/присутствия устройства следует публиковать с retain=true, чтобы новые подписчики сразу получали последнее значение.' });
  });

  // Positive: good namespace structure
  const hasDeviceId = topics.some(t => /^[a-z0-9_-]+\/[a-z0-9_-]+/.test(t.path));
  if (hasDeviceId && topics.length >= 2)
    findings.push({ severity: 'good', category: 'Архитектура', title: 'Хорошая namespace-структура', detail: 'Топики начинаются с идентификатора устройства/локации — это best practice для масштабируемых IoT-систем.' });

  return findings;
}

// ── Score ───────────────────────────────────────────────────────────
function calcScore(findings: ExpertFinding[]): number {
  const errors   = findings.filter(f => f.severity === 'error').length;
  const warnings = findings.filter(f => f.severity === 'warning').length;
  const goods    = findings.filter(f => f.severity === 'good').length;
  const base = Math.max(0, 100 - errors * 25 - warnings * 10 + goods * 5);
  return Math.min(100, base);
}

// ── UI helpers ──────────────────────────────────────────────────────
const SEV_CFG: Record<Severity, { Icon: any; color: string; bg: string; label: string }> = {
  error:   { Icon: XCircle,       color: '#f85149', bg: 'rgba(248,81,73,0.08)',  label: 'Ошибка' },
  warning: { Icon: AlertTriangle, color: '#d29922', bg: 'rgba(210,153,34,0.08)', label: 'Предупреждение' },
  tip:     { Icon: Info,          color: '#58a6ff', bg: 'rgba(88,166,255,0.08)', label: 'Совет' },
  good:    { Icon: CheckCircle,   color: '#3fb950', bg: 'rgba(63,185,80,0.08)',  label: 'Отлично' },
};

const QOS_INFO: Record<QoS, { label: string; desc: string; color: string }> = {
  0: { label: 'QoS 0', desc: 'At most once — быстро, без подтверждения',  color: '#3fb950' },
  1: { label: 'QoS 1', desc: 'At least once — с подтверждением, может быть дубль', color: '#d29922' },
  2: { label: 'QoS 2', desc: 'Exactly once — гарантировано, медленнее',   color: '#f0883e' },
};

const DATA_TYPES = ['Температура', 'Влажность', 'Давление', 'CO₂ / Газы', 'Движение', 'Статус', 'Команда', 'Конфигурация', 'Уровень', 'GPS', 'Вольтаж', 'Другое'];

let _id = 0;
const uid = () => String(++_id);

// ── Main Component ──────────────────────────────────────────────────
export function MqttExpert() {
  const [topics, setTopics]   = useState<Topic[]>([]);
  const [messages, setMessages] = useState<MqttMessage[]>([]);

  // Add topic form
  const [newPath, setNewPath]   = useState('');
  const [newDesc, setNewDesc]   = useState('');
  const [newType, setNewType]   = useState('Температура');

  // Publish form
  const [pubTopic, setPubTopic] = useState('');
  const [pubPayload, setPubPayload] = useState('');
  const [pubQos, setPubQos]     = useState<QoS>(0);
  const [pubRetain, setPubRetain] = useState(false);

  // Panel tab
  const [tab, setTab] = useState<'topics' | 'log' | 'expert'>('topics');
  const [expandedFinding, setExpandedFinding] = useState<string | null>(null);

  const logRef = useRef<HTMLDivElement>(null);

  const findings  = useMemo(() => analyzeTopics(topics, messages), [topics, messages]);
  const score     = useMemo(() => calcScore(findings), [findings]);
  const errors    = findings.filter(f => f.severity === 'error').length;
  const warnings  = findings.filter(f => f.severity === 'warning').length;
  const goods     = findings.filter(f => f.severity === 'good').length;

  const addTopic = () => {
    if (!newPath.trim()) return;
    setTopics(prev => [...prev, { id: uid(), path: newPath.trim(), description: newDesc.trim(), dataType: newType }]);
    setNewPath(''); setNewDesc(''); setNewType('Температура');
    setTab('topics');
  };

  const removeTopic = (id: string) => setTopics(prev => prev.filter(t => t.id !== id));

  const loadPreset = (name: string) => {
    const presets: Record<string, Topic[]> = {
      'smart-home': [
        { id: uid(), path: 'home/livingroom/temperature', description: 'Датчик температуры', dataType: 'Температура' },
        { id: uid(), path: 'home/livingroom/humidity', description: 'Датчик влажности', dataType: 'Влажность' },
        { id: uid(), path: 'home/bedroom/motion', description: 'Датчик движения', dataType: 'Движение' },
        { id: uid(), path: 'home/kitchen/co2', description: 'Датчик CO₂', dataType: 'CO₂ / Газы' },
        { id: uid(), path: 'home/gateway/status', description: 'Статус шлюза (LWT)', dataType: 'Статус' },
        { id: uid(), path: 'home/lights/kitchen/set', description: 'Управление светом', dataType: 'Команда' },
      ],
      'industrial': [
        { id: uid(), path: 'factory/line1/conveyor/speed', description: 'Скорость конвейера', dataType: 'Другое' },
        { id: uid(), path: 'factory/line1/sensor/pressure', description: 'Давление в системе', dataType: 'Давление' },
        { id: uid(), path: 'factory/line1/sensor/temperature', description: 'Температура', dataType: 'Температура' },
        { id: uid(), path: 'factory/plc001/status', description: 'Статус контроллера', dataType: 'Статус' },
        { id: uid(), path: 'factory/plc001/cmd/stop', description: 'Команда остановки', dataType: 'Команда' },
      ],
      'bad-example': [
        { id: uid(), path: 'data', description: 'Плохой пример: нет иерархии', dataType: 'Другое' },
        { id: uid(), path: '/sensor data/temp val/', description: 'Пробелы и лишние слэши', dataType: 'Температура' },
        { id: uid(), path: 'home/#/temperature', description: 'Wildcard # не в конце', dataType: 'Температура' },
        { id: uid(), path: 'a/b/c/d/e/f/g/h', description: 'Слишком глубокая иерархия', dataType: 'Другое' },
      ],
    };
    if (presets[name]) { setTopics(presets[name]); setMessages([]); setTab('topics'); }
  };

  const publish = () => {
    if (!pubTopic) return;
    const msg: MqttMessage = { id: uid(), topicPath: pubTopic, payload: pubPayload || '{}', qos: pubQos, retain: pubRetain, ts: Date.now() };
    setMessages(prev => [...prev, msg]);
    setTab('log');
    setTimeout(() => logRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 50);
  };

  const scoreColor = score >= 80 ? '#3fb950' : score >= 55 ? '#d29922' : '#f85149';
  const scoreLabel = score >= 80 ? 'Хорошо' : score >= 55 ? 'Требует улучшений' : 'Есть проблемы';

  // Build tree from topics
  const buildTree = (topics: Topic[]) => {
    const tree: Record<string, any> = {};
    topics.forEach(t => {
      const parts = t.path.split('/');
      let node = tree;
      parts.forEach((p, i) => {
        if (!node[p]) node[p] = { _children: {} };
        if (i === parts.length - 1) node[p]._topic = t;
        node = node[p]._children;
      });
    });
    return tree;
  };

  const renderTree = (node: Record<string, any>, prefix = '', depth = 0): ReactNode =>
    Object.entries(node).map(([key, val]) => (
      <div key={prefix + key}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: depth * 14 + 8, paddingTop: 4, paddingBottom: 4 }}>
          <ChevronRight size={10} color="#444c56" />
          <span style={{ fontSize: 12, fontFamily: 'monospace', color: val._topic ? '#58a6ff' : '#8b949e' }}>{key}</span>
          {val._topic && (
            <>
              <span style={{ fontSize: 10, color: '#444c56', marginLeft: 2 }}>— {val._topic.dataType}</span>
              <button onClick={() => removeTopic(val._topic.id)}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#444c56', display: 'flex' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#f85149')}
                onMouseLeave={e => (e.currentTarget.style.color = '#444c56')}
              >
                <Trash2 size={11} />
              </button>
            </>
          )}
        </div>
        {Object.keys(val._children || {}).length > 0 && renderTree(val._children, prefix + key + '/', depth + 1)}
      </div>
    ));

  const tree = buildTree(topics);

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e6edf3', fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', background: '#161b22', borderBottom: '1px solid #21262d', flexShrink: 0 }}>
        <Radio size={16} color="#58a6ff" />
        <span style={{ fontSize: 14, fontWeight: 700, color: '#e6edf3' }}>MQTT Expert System</span>
        <span style={{ fontSize: 12, color: '#6e7681' }}>— интерактивный анализатор IoT-архитектуры</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {topics.length > 0 && (
            <>
              <span style={{ fontSize: 12, color: scoreColor, fontWeight: 700 }}>{score}/100 — {scoreLabel}</span>
              {errors > 0   && <span style={{ fontSize: 11, color: '#f85149', background: 'rgba(248,81,73,0.12)', padding: '2px 8px', borderRadius: 20 }}>{errors} ошибок</span>}
              {warnings > 0 && <span style={{ fontSize: 11, color: '#d29922', background: 'rgba(210,153,34,0.12)', padding: '2px 8px', borderRadius: 20 }}>{warnings} предупреждений</span>}
              {goods > 0    && <span style={{ fontSize: 11, color: '#3fb950', background: 'rgba(63,185,80,0.12)', padding: '2px 8px', borderRadius: 20 }}>{goods} хорошо</span>}
            </>
          )}
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '340px 1fr 340px', overflow: 'hidden' }}>

        {/* ── Left: Add topics + Publish ──────────────────────────── */}
        <div style={{ borderRight: '1px solid #21262d', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Add topic */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #21262d' }}>
            <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Добавить топик</p>
            {/* Presets */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
              <span style={{ fontSize: 10, color: '#6e7681', alignSelf: 'center' }}>Пресеты:</span>
              {[
                { key: 'smart-home', label: '🏠 Умный дом' },
                { key: 'industrial', label: '🏭 Промышленность' },
                { key: 'bad-example', label: '⚠ Плохой пример' },
              ].map(p => (
                <button key={p.key} onClick={() => loadPreset(p.key)}
                  style={{ fontSize: 10, padding: '2px 8px', background: 'transparent', border: '1px solid #30363d', borderRadius: 20, color: '#8b949e', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#58a6ff')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#30363d')}
                >
                  {p.label}
                </button>
              ))}
              {topics.length > 0 && (
                <button onClick={() => { setTopics([]); setMessages([]); }}
                  style={{ fontSize: 10, padding: '2px 8px', background: 'transparent', border: '1px solid #30363d', borderRadius: 20, color: '#f85149', cursor: 'pointer', marginLeft: 'auto' }}>
                  Сбросить
                </button>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <label style={{ fontSize: 11, color: '#6e7681', display: 'block', marginBottom: 3 }}>Путь топика</label>
                <input value={newPath} onChange={e => setNewPath(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTopic()}
                  placeholder="home/bedroom/temperature"
                  style={{ width: '100%', padding: '6px 10px', fontSize: 12, background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, color: '#e6edf3', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#58a6ff')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#30363d')}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <div>
                  <label style={{ fontSize: 11, color: '#6e7681', display: 'block', marginBottom: 3 }}>Тип данных</label>
                  <select value={newType} onChange={e => setNewType(e.target.value)}
                    style={{ width: '100%', padding: '5px 8px', fontSize: 12, background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, color: '#e6edf3', outline: 'none' }}>
                    {DATA_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#6e7681', display: 'block', marginBottom: 3 }}>Описание (опц.)</label>
                  <input value={newDesc} onChange={e => setNewDesc(e.target.value)}
                    placeholder="напр. датчик спальни"
                    style={{ width: '100%', padding: '5px 8px', fontSize: 12, background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, color: '#e6edf3', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <button onClick={addTopic} disabled={!newPath.trim()}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '6px', fontSize: 12, fontWeight: 600, background: newPath.trim() ? '#1f6feb' : '#21262d', color: newPath.trim() ? '#fff' : '#6e7681', border: 'none', borderRadius: 6, cursor: newPath.trim() ? 'pointer' : 'not-allowed' }}>
                <Plus size={13} /> Добавить топик
              </button>
            </div>
          </div>

          {/* Publish */}
          <div style={{ padding: '14px 16px', flex: 1 }}>
            <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Симулировать публикацию</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <label style={{ fontSize: 11, color: '#6e7681', display: 'block', marginBottom: 3 }}>Топик</label>
                <select value={pubTopic} onChange={e => setPubTopic(e.target.value)}
                  style={{ width: '100%', padding: '5px 8px', fontSize: 12, background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, color: pubTopic ? '#e6edf3' : '#6e7681', outline: 'none' }}>
                  <option value="">— выберите топик —</option>
                  {topics.filter(t => !t.path.includes('+') && !t.path.includes('#')).map(t => (
                    <option key={t.id} value={t.path}>{t.path}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#6e7681', display: 'block', marginBottom: 3 }}>Payload (JSON)</label>
                <input value={pubPayload} onChange={e => setPubPayload(e.target.value)}
                  placeholder='{"value": 23.5, "unit": "°C"}'
                  style={{ width: '100%', padding: '5px 8px', fontSize: 12, background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, color: '#e6edf3', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#6e7681', display: 'block', marginBottom: 3 }}>QoS</label>
                <div style={{ display: 'flex', gap: 4 }}>
                  {([0, 1, 2] as QoS[]).map(q => (
                    <button key={q} onClick={() => setPubQos(q)}
                      style={{ flex: 1, padding: '5px 4px', fontSize: 11, fontWeight: pubQos === q ? 700 : 400, background: pubQos === q ? '#21262d' : 'transparent', border: `1px solid ${pubQos === q ? QOS_INFO[q].color : '#30363d'}`, borderRadius: 6, color: pubQos === q ? QOS_INFO[q].color : '#6e7681', cursor: 'pointer' }}>
                      {q}
                    </button>
                  ))}
                </div>
                <p style={{ margin: '3px 0 0', fontSize: 10, color: '#6e7681' }}>{QOS_INFO[pubQos].desc}</p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={pubRetain} onChange={e => setPubRetain(e.target.checked)} style={{ accentColor: '#58a6ff' }} />
                <span style={{ fontSize: 12, color: '#8b949e' }}>retain</span>
                <span style={{ fontSize: 10, color: '#6e7681' }}>(хранить последнее значение)</span>
              </label>
              <button onClick={publish} disabled={!pubTopic}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '6px', fontSize: 12, fontWeight: 600, background: pubTopic ? '#238636' : '#21262d', color: pubTopic ? '#fff' : '#6e7681', border: 'none', borderRadius: 6, cursor: pubTopic ? 'pointer' : 'not-allowed' }}>
                <Send size={13} /> Опубликовать
              </button>
            </div>
          </div>
        </div>

        {/* ── Center: Topic Tree ──────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #21262d', overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #21262d' }}>
            {(['topics', 'log', 'expert'] as const).map(t => {
              const labels = { topics: `Топики (${topics.length})`, log: `Лог (${messages.length})`, expert: `Анализ ${errors > 0 ? '⚠' : ''}` };
              return (
                <button key={t} onClick={() => setTab(t)}
                  style={{ flex: 1, padding: '9px 4px', fontSize: 12, fontWeight: tab === t ? 700 : 400, background: 'none', border: 'none', borderBottom: `2px solid ${tab === t ? '#58a6ff' : 'transparent'}`, color: tab === t ? '#e6edf3' : '#6e7681', cursor: 'pointer', transition: 'color 100ms' }}>
                  {labels[t]}
                </button>
              );
            })}
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>

            {/* Topics tree */}
            {tab === 'topics' && (
              topics.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6e7681' }}>
                  <Radio size={28} color="#21262d" style={{ margin: '0 auto 12px' }} />
                  <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 600, color: '#8b949e' }}>Нет топиков</p>
                  <p style={{ margin: 0, fontSize: 12 }}>Добавьте топики слева, чтобы увидеть дерево и анализ</p>
                </div>
              ) : (
                <div style={{ background: '#161b22', borderRadius: 8, border: '1px solid #21262d', padding: '8px 0' }}>
                  <p style={{ margin: '0 0 4px', padding: '0 8px', fontSize: 10, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '0.05em' }}>MQTT Broker</p>
                  {renderTree(tree)}
                </div>
              )
            )}

            {/* Message log */}
            {tab === 'log' && (
              <div ref={logRef} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {messages.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6e7681' }}>
                    <p style={{ margin: 0, fontSize: 12 }}>Лог пуст. Опубликуйте сообщение.</p>
                  </div>
                ) : messages.map(m => (
                  <div key={m.id} style={{ background: '#161b22', border: '1px solid #21262d', borderLeft: `3px solid ${QOS_INFO[m.qos].color}`, borderRadius: 6, padding: '8px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#58a6ff', fontWeight: 600 }}>{m.topicPath}</span>
                      <span style={{ fontSize: 10, color: QOS_INFO[m.qos].color, background: 'rgba(0,0,0,0.3)', padding: '1px 6px', borderRadius: 10 }}>{QOS_INFO[m.qos].label}</span>
                      {m.retain && <span style={{ fontSize: 10, color: '#f0883e', background: 'rgba(0,0,0,0.3)', padding: '1px 6px', borderRadius: 10 }}>retain</span>}
                      <span style={{ marginLeft: 'auto', fontSize: 10, color: '#6e7681' }}>{new Date(m.ts).toLocaleTimeString('ru-RU')}</span>
                    </div>
                    <pre style={{ margin: 0, fontSize: 11, color: '#8b949e', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{m.payload}</pre>
                  </div>
                ))}
              </div>
            )}

            {/* Expert findings */}
            {tab === 'expert' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {findings.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6e7681' }}>
                    <p style={{ margin: 0, fontSize: 12 }}>Добавьте топики для получения анализа</p>
                  </div>
                ) : findings.map((f, i) => {
                  const cfg = SEV_CFG[f.severity];
                  const key = `${i}-${f.title}`;
                  const open = expandedFinding === key;
                  return (
                    <div key={key} style={{ background: cfg.bg, border: `1px solid ${cfg.color}30`, borderLeft: `3px solid ${cfg.color}`, borderRadius: 6, overflow: 'hidden' }}>
                      <button onClick={() => setExpandedFinding(open ? null : key)}
                        style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 10px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                        <cfg.Icon size={13} color={cfg.color} style={{ flexShrink: 0, marginTop: 1 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
                          <span style={{ fontSize: 11, color: '#8b949e', marginLeft: 6 }}>{f.category}</span>
                          <p style={{ margin: '1px 0 0', fontSize: 12, color: '#e6edf3' }}>{f.title}</p>
                        </div>
                        <ChevronRight size={12} color="#6e7681" style={{ transform: open ? 'rotate(90deg)' : '', transition: 'transform 150ms', flexShrink: 0 }} />
                      </button>
                      {open && (
                        <p style={{ margin: 0, padding: '0 10px 10px 31px', fontSize: 11, color: '#8b949e', lineHeight: 1.5 }}>{f.detail}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Reference ────────────────────────────────────── */}
        <div style={{ overflow: 'auto', padding: 16 }}>
          <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
            <BookOpen size={12} /> Справочник MQTT
          </p>

          {/* QoS reference */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: '#58a6ff' }}>Уровни QoS</p>
            {([0, 1, 2] as QoS[]).map(q => (
              <div key={q} style={{ marginBottom: 6, padding: '7px 10px', background: '#161b22', borderRadius: 6, borderLeft: `3px solid ${QOS_INFO[q].color}` }}>
                <p style={{ margin: '0 0 2px', fontSize: 12, fontWeight: 600, color: QOS_INFO[q].color }}>{QOS_INFO[q].label}</p>
                <p style={{ margin: 0, fontSize: 11, color: '#8b949e' }}>{QOS_INFO[q].desc}</p>
              </div>
            ))}
          </div>

          {/* Topic rules */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: '#58a6ff' }}>Правила топиков</p>
            {[
              { ok: true,  text: 'home/bedroom/temperature' },
              { ok: true,  text: 'factory/line1/sensor/+/status' },
              { ok: true,  text: 'devices/#  (подписка)' },
              { ok: false, text: 'home/bed room/temp  (пробел!)' },
              { ok: false, text: '/home/temp  (лишний /)' },
              { ok: false, text: 'home/#/temp  (# не в конце)' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: r.ok ? '#3fb950' : '#f85149' }}>{r.ok ? '✓' : '✗'}</span>
                <code style={{ fontSize: 11, color: r.ok ? '#8b949e' : '#f8514980', fontFamily: 'monospace' }}>{r.text}</code>
              </div>
            ))}
          </div>

          {/* Best practices */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: '#58a6ff' }}>Best Practices</p>
            {[
              'Начинайте с device_id или location',
              'Оптимальная глубина: 3–5 уровней',
              'Используйте только строчные буквы',
              'Статус устройства: retain=true',
              'Телеметрия: QoS 0, команды: QoS 1+',
              'Добавьте LWT топик (will/status)',
              'Не используйте /topic/# без нужды',
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 5 }}>
                <span style={{ color: '#58a6ff', fontSize: 12, flexShrink: 0 }}>→</span>
                <span style={{ fontSize: 11, color: '#8b949e', lineHeight: 1.4 }}>{tip}</span>
              </div>
            ))}
          </div>

          {/* Score legend */}
          {topics.length > 0 && (
            <div style={{ padding: '12px', background: '#161b22', borderRadius: 8, border: '1px solid #21262d' }}>
              <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, color: '#8b949e' }}>Ваш счёт</p>
              <div style={{ height: 8, background: '#21262d', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
                <div style={{ height: '100%', width: `${score}%`, background: scoreColor, borderRadius: 4, transition: 'width 0.4s ease' }} />
              </div>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: scoreColor }}>{score}<span style={{ fontSize: 13, color: '#6e7681' }}>/100</span></p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: '#6e7681' }}>
                {score >= 80 ? 'Отличная архитектура! Готово к деплою.' : score >= 55 ? 'Хороший старт, устраните предупреждения.' : 'Есть критичные ошибки. Проверьте анализ.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
