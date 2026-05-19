'use client';

import { useState, useMemo, useCallback, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Send, ChevronRight, CheckCircle, AlertTriangle, XCircle, Info, Radio, BookOpen, Download, ArrowRight } from 'lucide-react';
import { useSchematicStore } from '@/features/Schematic/store/useSchematicStore';
import type { ComponentType } from '@/features/Schematic/types';

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

// ── Simulator component → MQTT topics map ───────────────────────────
const COMP_TO_TOPICS: Partial<Record<ComponentType, { path: string; description: string; dataType: string; qos: QoS; retain: boolean }[]>> = {
  'esp32':        [{ path: 'esp32/status',    description: 'Статус устройства (LWT)',   dataType: 'Статус',     qos: 1, retain: true }],
  'arduino-uno':  [{ path: 'arduino/status',  description: 'Статус устройства (LWT)',   dataType: 'Статус',     qos: 1, retain: true }],
  'dht22':        [
    { path: 'sensors/dht22/temperature', description: 'Температура DHT22 (°C)',      dataType: 'Температура', qos: 0, retain: false },
    { path: 'sensors/dht22/humidity',    description: 'Влажность DHT22 (%)',          dataType: 'Влажность',   qos: 0, retain: false },
  ],
  'mq2':          [
    { path: 'sensors/mq2/gas',           description: 'Газ/дым MQ-2 (ppm)',           dataType: 'CO₂ / Газы', qos: 0, retain: false },
    { path: 'sensors/mq2/lpg',           description: 'LPG MQ-2 (ppm)',               dataType: 'CO₂ / Газы', qos: 0, retain: false },
  ],
  'ldr':          [{ path: 'sensors/ldr/light',   description: 'Освещённость LDR (%)',   dataType: 'Уровень',    qos: 0, retain: false }],
  'hcsr04':       [{ path: 'sensors/hcsr04/distance', description: 'Расстояние HC-SR04 (cm)', dataType: 'Другое', qos: 0, retain: false }],
  'led-red':      [{ path: 'actuators/led/red/set',    description: 'Управление красным LED',  dataType: 'Команда', qos: 1, retain: false }],
  'led-green':    [{ path: 'actuators/led/green/set',  description: 'Управление зелёным LED',  dataType: 'Команда', qos: 1, retain: false }],
  'led-blue':     [{ path: 'actuators/led/blue/set',   description: 'Управление синим LED',    dataType: 'Команда', qos: 1, retain: false }],
  'led-yellow':   [{ path: 'actuators/led/yellow/set', description: 'Управление жёлтым LED',   dataType: 'Команда', qos: 1, retain: false }],
  'buzzer':       [{ path: 'actuators/buzzer/set',     description: 'Управление зуммером',     dataType: 'Команда', qos: 1, retain: false }],
  'relay':        [{ path: 'actuators/relay/set',      description: 'Управление реле',          dataType: 'Команда', qos: 1, retain: false }],
  'servo':        [{ path: 'actuators/servo/angle',    description: 'Угол сервомотора (0–180)', dataType: 'Другое',  qos: 1, retain: false }],
  'potentiometer':[{ path: 'sensors/pot/value',        description: 'Потенциометр (0–1023)',    dataType: 'Уровень', qos: 0, retain: false }],
  'button':       [{ path: 'sensors/button/state',     description: 'Состояние кнопки',        dataType: 'Статус',  qos: 1, retain: false }],
};

// ── Expert Rules Engine ─────────────────────────────────────────────
function analyzeTopics(topics: Topic[], messages: MqttMessage[]): ExpertFinding[] {
  const findings: ExpertFinding[] = [];
  if (topics.length === 0) return findings;

  topics.forEach(t => {
    const parts = t.path.split('/').filter(Boolean);

    if (t.path.includes(' '))
      findings.push({ severity: 'error', category: 'Формат', title: `«${t.path}» содержит пробелы`, detail: 'Пробелы в топиках запрещены стандартом MQTT. Используйте / или _ для разделения слов.' });

    if (t.path.includes('#') && !t.path.endsWith('/#') && t.path !== '#')
      findings.push({ severity: 'error', category: 'Wildcards', title: `# должен быть только в конце`, detail: `Топик «${t.path}»: многоуровневый wildcard # можно использовать только в конце: home/sensors/#` });

    if (t.path.startsWith('/') || t.path.endsWith('/'))
      findings.push({ severity: 'warning', category: 'Формат', title: `Лишний слэш в «${t.path}»`, detail: 'Ведущий или завершающий / создаёт пустой уровень. Пример: /home/temp → home/temp' });

    if (parts.length === 1 && !t.path.includes('+') && !t.path.includes('#'))
      findings.push({ severity: 'warning', category: 'Иерархия', title: `«${t.path}» — слишком плоская структура`, detail: 'Топик из одного уровня неудобен при масштабировании. Рекомендуется: device_id/sensor_type/metric' });

    if (parts.length > 6)
      findings.push({ severity: 'warning', category: 'Иерархия', title: `«${t.path}» — слишком глубокая иерархия (${parts.length} уровней)`, detail: 'Рекомендуется 3–5 уровней. Глубже — сложно обслуживать и больше трафик.' });

    if (parts.length >= 2 && parts.length <= 5 && !t.path.includes(' '))
      findings.push({ severity: 'good', category: 'Иерархия', title: `«${t.path}» — хорошая глубина`, detail: `${parts.length} уровня — оптимально для MQTT.` });

    if (/[A-Z]/.test(t.path))
      findings.push({ severity: 'tip', category: 'Стиль', title: `«${t.path}» содержит заглавные буквы`, detail: 'MQTT топики регистрозависимы. Рекомендуется использовать только строчные буквы.' });

    const generic = ['data', 'info', 'message', 'msg', 'value', 'val', 'test'];
    if (parts.some(p => generic.includes(p.toLowerCase())))
      findings.push({ severity: 'tip', category: 'Стиль', title: `«${t.path}» использует нечёткое имя уровня`, detail: 'Имена вроде «data» или «value» не информативны. Лучше: temperature, humidity, status.' });
  });

  const paths = topics.map(t => t.path);
  const dups  = paths.filter((p, i) => paths.indexOf(p) !== i);
  if (dups.length > 0)
    findings.push({ severity: 'error', category: 'Дубликаты', title: `Обнаружены дублирующиеся топики`, detail: `Топики ${[...new Set(dups)].map(d => `«${d}»`).join(', ')} встречаются несколько раз.` });

  messages.forEach(m => {
    const topic = topics.find(t => t.path === m.topicPath);
    if (!topic) return;

    if (m.retain && m.qos === 0)
      findings.push({ severity: 'warning', category: 'QoS + Retain', title: `Retain с QoS 0 ненадёжен`, detail: `Топик «${m.topicPath}»: при QoS 0 доставка не гарантирована. Для retain используйте QoS 1 или 2.` });

    const topicMsgs = messages.filter(msg => msg.topicPath === m.topicPath);
    if (topicMsgs.length > 5 && m.qos === 2)
      findings.push({ severity: 'tip', category: 'Производительность', title: `QoS 2 для частой телеметрии избыточен`, detail: `Топик «${m.topicPath}»: QoS 2 требует 4 сообщения на одну доставку. Для телеметрии достаточно QoS 0 или 1.` });

    if ((topic.description.toLowerCase().includes('команд') || topic.path.includes('cmd') || topic.path.includes('command') || topic.path.includes('set')) && m.qos === 0)
      findings.push({ severity: 'warning', category: 'QoS', title: `Команда с QoS 0 может потеряться`, detail: `Топик «${m.topicPath}» похож на топик команд. Для управляющих сообщений рекомендуется QoS 1 или 2.` });
  });

  const hasStatus = topics.some(t => t.path.includes('status') || t.path.includes('online') || t.path.includes('lwt'));
  if (topics.length >= 2 && !hasStatus)
    findings.push({ severity: 'tip', category: 'Best Practice', title: 'Рекомендуется топик статуса (LWT)', detail: 'Last Will and Testament: добавьте топик device/status с retain=true для отслеживания доступности.' });

  const statusTopics = topics.filter(t => t.path.includes('status') || t.path.includes('online'));
  statusTopics.forEach(t => {
    const statusMsgs = messages.filter(m => m.topicPath === t.path && !m.retain);
    if (statusMsgs.length > 0)
      findings.push({ severity: 'tip', category: 'Retain', title: `Топик статуса «${t.path}» — рекомендуется retain`, detail: 'Статус устройства должен публиковаться с retain=true.' });
  });

  const hasGoodNs = topics.some(t => /^[a-z0-9_-]+\/[a-z0-9_-]+/.test(t.path));
  if (hasGoodNs && topics.length >= 2)
    findings.push({ severity: 'good', category: 'Архитектура', title: 'Хорошая namespace-структура', detail: 'Топики начинаются с идентификатора — это best practice для масштабируемых IoT-систем.' });

  return findings;
}

function calcScore(findings: ExpertFinding[]): number {
  const e = findings.filter(f => f.severity === 'error').length;
  const w = findings.filter(f => f.severity === 'warning').length;
  const g = findings.filter(f => f.severity === 'good').length;
  return Math.min(100, Math.max(0, 100 - e * 25 - w * 10 + g * 5));
}

// ── UI helpers ──────────────────────────────────────────────────────
const SEV_CFG: Record<Severity, { Icon: any; color: string; label: string }> = {
  error:   { Icon: XCircle,       color: 'var(--color-danger-fg)',    label: 'Ошибка' },
  warning: { Icon: AlertTriangle, color: 'var(--color-attention-fg)', label: 'Предупреждение' },
  tip:     { Icon: Info,          color: 'var(--color-accent-fg)',    label: 'Совет' },
  good:    { Icon: CheckCircle,   color: 'var(--color-success-fg)',   label: 'Отлично' },
};

const QOS_INFO: Record<QoS, { label: string; desc: string; color: string }> = {
  0: { label: 'QoS 0', desc: 'At most once — быстро, без подтверждения',            color: 'var(--color-success-fg)' },
  1: { label: 'QoS 1', desc: 'At least once — с подтверждением, может быть дубль',  color: 'var(--color-attention-fg)' },
  2: { label: 'QoS 2', desc: 'Exactly once — гарантировано, медленнее',             color: 'var(--color-danger-fg)' },
};

const DATA_TYPES = ['Температура', 'Влажность', 'Давление', 'CO₂ / Газы', 'Движение', 'Статус', 'Команда', 'Конфигурация', 'Уровень', 'GPS', 'Вольтаж', 'Другое'];

let _id = 0;
const uid = () => String(++_id);

// ── Main Component ──────────────────────────────────────────────────
export function MqttExpert() {
  const schematicComponents = useSchematicStore(s => s.components);

  const [topics, setTopics]   = useState<Topic[]>([]);
  const [messages, setMessages] = useState<MqttMessage[]>([]);
  const [newPath, setNewPath]   = useState('');
  const [newDesc, setNewDesc]   = useState('');
  const [newType, setNewType]   = useState('Температура');
  const [pubTopic, setPubTopic] = useState('');
  const [pubPayload, setPubPayload] = useState('');
  const [pubQos, setPubQos]     = useState<QoS>(0);
  const [pubRetain, setPubRetain] = useState(false);
  const [tab, setTab]           = useState<'topics' | 'log' | 'expert'>('topics');
  const [expandedFinding, setExpandedFinding] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const findings  = useMemo(() => analyzeTopics(topics, messages), [topics, messages]);
  const score     = useMemo(() => calcScore(findings), [findings]);
  const errors    = findings.filter(f => f.severity === 'error').length;
  const warnings  = findings.filter(f => f.severity === 'warning').length;

  const addTopic = () => {
    if (!newPath.trim()) return;
    setTopics(prev => [...prev, { id: uid(), path: newPath.trim(), description: newDesc.trim(), dataType: newType }]);
    setNewPath(''); setNewDesc(''); setNewType('Температура');
    setTab('topics');
  };

  const removeTopic = (id: string) => setTopics(prev => prev.filter(t => t.id !== id));

  // Load topics from IoT Simulator
  const loadFromSimulator = useCallback(() => {
    if (schematicComponents.length === 0) {
      alert('В симуляторе нет компонентов. Откройте IoT Симулятор и добавьте компоненты на схему.');
      return;
    }
    const newTopics: Topic[] = [];
    const seen = new Set<string>();
    schematicComponents.forEach(comp => {
      const defs = COMP_TO_TOPICS[comp.type as ComponentType];
      if (!defs) return;
      defs.forEach(def => {
        if (seen.has(def.path)) return;
        seen.add(def.path);
        newTopics.push({ id: uid(), path: def.path, description: def.description, dataType: def.dataType });
      });
    });
    if (newTopics.length === 0) {
      alert('Компоненты в симуляторе не имеют стандартного MQTT-маппинга. Добавьте датчики или исполнительные устройства.');
      return;
    }
    setTopics(prev => {
      const existing = new Set(prev.map(t => t.path));
      return [...prev, ...newTopics.filter(t => !existing.has(t.path))];
    });
    setTab('topics');
  }, [schematicComponents]);

  const loadPreset = (name: string) => {
    const presets: Record<string, Topic[]> = {
      'smart-home': [
        { id: uid(), path: 'home/livingroom/temperature', description: 'Датчик температуры', dataType: 'Температура' },
        { id: uid(), path: 'home/livingroom/humidity',    description: 'Датчик влажности',   dataType: 'Влажность' },
        { id: uid(), path: 'home/bedroom/motion',         description: 'Датчик движения',    dataType: 'Движение' },
        { id: uid(), path: 'home/gateway/status',         description: 'Статус шлюза (LWT)', dataType: 'Статус' },
        { id: uid(), path: 'home/lights/kitchen/set',     description: 'Управление светом',  dataType: 'Команда' },
      ],
      'industrial': [
        { id: uid(), path: 'factory/line1/sensor/pressure',    description: 'Давление',           dataType: 'Давление' },
        { id: uid(), path: 'factory/line1/sensor/temperature', description: 'Температура',        dataType: 'Температура' },
        { id: uid(), path: 'factory/plc001/status',            description: 'Статус контроллера', dataType: 'Статус' },
        { id: uid(), path: 'factory/plc001/cmd/stop',          description: 'Команда остановки',  dataType: 'Команда' },
      ],
      'bad-example': [
        { id: uid(), path: 'data',                        description: 'Нет иерархии',                dataType: 'Другое' },
        { id: uid(), path: '/sensor data/temp val/',      description: 'Пробелы и лишние слэши',      dataType: 'Температура' },
        { id: uid(), path: 'home/#/temperature',          description: 'Wildcard # не в конце',       dataType: 'Температура' },
        { id: uid(), path: 'a/b/c/d/e/f/g/h',            description: 'Слишком глубокая иерархия',  dataType: 'Другое' },
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

  const scoreColor = score >= 80 ? 'var(--color-success-fg)' : score >= 55 ? 'var(--color-attention-fg)' : 'var(--color-danger-fg)';

  // Tree building
  const buildTree = (ts: Topic[]) => {
    const tree: Record<string, any> = {};
    ts.forEach(t => {
      let node = tree;
      t.path.split('/').forEach((p, i, arr) => {
        if (!node[p]) node[p] = { _children: {} };
        if (i === arr.length - 1) node[p]._topic = t;
        node = node[p]._children;
      });
    });
    return tree;
  };

  const renderTree = (node: Record<string, any>, prefix = '', depth = 0): ReactNode =>
    Object.entries(node).map(([key, val]) => (
      <div key={prefix + key}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: depth * 14 + 8, paddingTop: 4, paddingBottom: 4 }}>
          <ChevronRight size={10} color="var(--color-fg-subtle)" />
          <span style={{ fontSize: 12, fontFamily: 'monospace', color: val._topic ? 'var(--color-accent-fg)' : 'var(--color-fg-muted)' }}>{key}</span>
          {val._topic && (
            <>
              <span style={{ fontSize: 10, color: 'var(--color-fg-subtle)', marginLeft: 2 }}>— {val._topic.dataType}</span>
              <button onClick={() => removeTopic(val._topic.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-fg-subtle)', display: 'flex' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-danger-fg)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-fg-subtle)')}
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

  const simHasComponents = schematicComponents.length > 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', color: 'var(--color-fg-default)' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', background: 'var(--color-canvas-overlay)', borderBottom: '1px solid var(--color-border-default)', flexShrink: 0, flexWrap: 'wrap', gap: 10 }}>
        <Radio size={16} color="var(--color-done-fg)" />
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-fg-default)' }}>MQTT Expert System</span>
        <span style={{ fontSize: 12, color: 'var(--color-fg-muted)' }}>интерактивный анализатор IoT-архитектуры</span>

        {/* Link to simulator */}
        <Link href="/shematic"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-done-fg)', background: 'var(--color-done-subtle)', border: '1px solid var(--color-done-muted)', padding: '3px 10px', borderRadius: 20, textDecoration: 'none' }}>
          📡 IoT Симулятор <ArrowRight size={11} />
        </Link>

        {topics.length > 0 && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: scoreColor, fontWeight: 700 }}>{score}/100</span>
            {errors > 0   && <span style={{ fontSize: 11, color: 'var(--color-danger-fg)',    background: 'var(--color-danger-subtle)',    padding: '2px 8px', borderRadius: 20 }}>{errors} ошибок</span>}
            {warnings > 0 && <span style={{ fontSize: 11, color: 'var(--color-attention-fg)', background: 'var(--color-attention-subtle)', padding: '2px 8px', borderRadius: 20 }}>{warnings} предупреждений</span>}
          </div>
        )}
      </div>

      {/* Onboarding banner — shown when no topics */}
      {topics.length === 0 && (
        <div style={{ margin: '20px 20px 0', padding: '20px 24px', background: 'var(--color-accent-subtle)', border: '1px solid var(--color-accent-muted)', borderRadius: 12 }}>
          <h3 style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 700, color: 'var(--color-fg-default)' }}>Как использовать MQTT Expert</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {[
              { n: '1', title: 'Загрузите компоненты', desc: 'Нажмите «Загрузить из симулятора» — MQTT топики создадутся автоматически из вашей схемы', icon: '📡' },
              { n: '2', title: 'Симулируйте публикацию', desc: 'Выберите топик, задайте QoS и retain-флаг, нажмите «Опубликовать»', icon: '📤' },
              { n: '3', title: 'Читайте экспертный анализ', desc: 'Система проверяет топики по ~15 правилам и даёт рекомендации', icon: '🔍' },
            ].map(s => (
              <div key={s.n} style={{ display: 'flex', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-accent-emphasis)', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.n}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)', marginBottom: 2 }}>{s.icon} {s.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-fg-muted)', lineHeight: 1.4 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 300px', minHeight: topics.length === 0 ? 'calc(100vh - 200px)' : 'calc(100vh - 57px)', overflow: 'hidden' }}>

        {/* ── Left: Add topics + Publish ──────────────────────────── */}
        <div style={{ borderRight: '1px solid var(--color-border-default)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

          {/* Import from simulator */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--color-border-muted)', background: simHasComponents ? 'var(--color-done-subtle)' : 'var(--color-canvas-subtle)' }}>
            <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: 'var(--color-fg-default)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Radio size={12} color="var(--color-done-fg)" /> Из симулятора
            </p>
            {simHasComponents ? (
              <>
                <p style={{ margin: '0 0 8px', fontSize: 12, color: 'var(--color-fg-muted)' }}>
                  В симуляторе {schematicComponents.length} компонентов — можно автоматически создать топики
                </p>
                <button onClick={loadFromSimulator}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', fontSize: 13, fontWeight: 600, background: 'var(--color-done-emphasis)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', width: '100%', justifyContent: 'center' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-done-fg)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-done-emphasis)')}
                >
                  <Download size={13} /> Загрузить из симулятора
                </button>
              </>
            ) : (
              <>
                <p style={{ margin: '0 0 8px', fontSize: 12, color: 'var(--color-fg-muted)' }}>
                  Симулятор пуст. Откройте его и добавьте датчики — они появятся здесь.
                </p>
                <Link href="/shematic"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', fontSize: 13, fontWeight: 600, background: 'var(--color-canvas-overlay)', color: 'var(--color-done-fg)', border: '1px solid var(--color-done-muted)', borderRadius: 8, textDecoration: 'none', justifyContent: 'center' }}>
                  Открыть IoT Симулятор <ArrowRight size={13} />
                </Link>
              </>
            )}
          </div>

          {/* Add topic manually */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--color-border-muted)' }}>
            <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: 'var(--color-fg-default)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Добавить топик вручную</p>
            {/* Presets */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
              <span style={{ fontSize: 10, color: 'var(--color-fg-subtle)', alignSelf: 'center' }}>Пресеты:</span>
              {[
                { key: 'smart-home',  label: '🏠 Умный дом' },
                { key: 'industrial',  label: '🏭 Промышленность' },
                { key: 'bad-example', label: '⚠ Ошибки' },
              ].map(p => (
                <button key={p.key} onClick={() => loadPreset(p.key)}
                  style={{ fontSize: 10, padding: '2px 8px', background: 'transparent', border: '1px solid var(--color-border-default)', borderRadius: 20, color: 'var(--color-fg-muted)', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent-fg)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border-default)')}
                >
                  {p.label}
                </button>
              ))}
              {topics.length > 0 && (
                <button onClick={() => { setTopics([]); setMessages([]); }}
                  style={{ fontSize: 10, padding: '2px 8px', background: 'transparent', border: '1px solid var(--color-border-default)', borderRadius: 20, color: 'var(--color-danger-fg)', cursor: 'pointer', marginLeft: 'auto' }}>
                  Сбросить
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <label style={{ fontSize: 11, color: 'var(--color-fg-muted)', display: 'block', marginBottom: 3 }}>Путь топика</label>
                <input value={newPath} onChange={e => setNewPath(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTopic()}
                  placeholder="home/bedroom/temperature"
                  style={{ width: '100%', padding: '6px 10px', fontSize: 12, background: 'var(--color-canvas-default)', border: '1px solid var(--color-border-default)', borderRadius: 6, color: 'var(--color-fg-default)', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent-fg)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border-default)')}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <div>
                  <label style={{ fontSize: 11, color: 'var(--color-fg-muted)', display: 'block', marginBottom: 3 }}>Тип данных</label>
                  <select value={newType} onChange={e => setNewType(e.target.value)}
                    style={{ width: '100%', padding: '5px 8px', fontSize: 12, background: 'var(--color-canvas-default)', border: '1px solid var(--color-border-default)', borderRadius: 6, color: 'var(--color-fg-default)', outline: 'none' }}>
                    {DATA_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'var(--color-fg-muted)', display: 'block', marginBottom: 3 }}>Описание</label>
                  <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="необязательно"
                    style={{ width: '100%', padding: '5px 8px', fontSize: 12, background: 'var(--color-canvas-default)', border: '1px solid var(--color-border-default)', borderRadius: 6, color: 'var(--color-fg-default)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <button onClick={addTopic} disabled={!newPath.trim()}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '6px', fontSize: 12, fontWeight: 600, background: newPath.trim() ? 'var(--color-accent-emphasis)' : 'var(--color-canvas-inset)', color: newPath.trim() ? '#fff' : 'var(--color-fg-subtle)', border: 'none', borderRadius: 6, cursor: newPath.trim() ? 'pointer' : 'not-allowed' }}>
                <Plus size={13} /> Добавить
              </button>
            </div>
          </div>

          {/* Publish */}
          <div style={{ padding: '14px 16px', flex: 1 }}>
            <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: 'var(--color-fg-default)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Симулировать публикацию</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <label style={{ fontSize: 11, color: 'var(--color-fg-muted)', display: 'block', marginBottom: 3 }}>Топик</label>
                <select value={pubTopic} onChange={e => setPubTopic(e.target.value)}
                  style={{ width: '100%', padding: '5px 8px', fontSize: 12, background: 'var(--color-canvas-default)', border: '1px solid var(--color-border-default)', borderRadius: 6, color: pubTopic ? 'var(--color-fg-default)' : 'var(--color-fg-muted)', outline: 'none' }}>
                  <option value="">— выберите топик —</option>
                  {topics.filter(t => !t.path.includes('+') && !t.path.includes('#')).map(t => (
                    <option key={t.id} value={t.path}>{t.path}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--color-fg-muted)', display: 'block', marginBottom: 3 }}>Payload (JSON)</label>
                <input value={pubPayload} onChange={e => setPubPayload(e.target.value)} placeholder='{"value": 23.5}'
                  style={{ width: '100%', padding: '5px 8px', fontSize: 12, background: 'var(--color-canvas-default)', border: '1px solid var(--color-border-default)', borderRadius: 6, color: 'var(--color-fg-default)', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--color-fg-muted)', display: 'block', marginBottom: 3 }}>QoS</label>
                <div style={{ display: 'flex', gap: 4 }}>
                  {([0, 1, 2] as QoS[]).map(q => (
                    <button key={q} onClick={() => setPubQos(q)}
                      style={{ flex: 1, padding: '5px 4px', fontSize: 11, fontWeight: pubQos === q ? 700 : 400, background: pubQos === q ? 'var(--color-canvas-inset)' : 'transparent', border: `1px solid ${pubQos === q ? QOS_INFO[q].color : 'var(--color-border-default)'}`, borderRadius: 6, color: pubQos === q ? QOS_INFO[q].color : 'var(--color-fg-muted)', cursor: 'pointer' }}>
                      {q}
                    </button>
                  ))}
                </div>
                <p style={{ margin: '3px 0 0', fontSize: 10, color: 'var(--color-fg-subtle)' }}>{QOS_INFO[pubQos].desc}</p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: 'var(--color-fg-muted)' }}>
                <input type="checkbox" checked={pubRetain} onChange={e => setPubRetain(e.target.checked)} style={{ accentColor: 'var(--color-accent-fg)' }} />
                retain
                <span style={{ fontSize: 10, color: 'var(--color-fg-subtle)' }}>(хранить последнее значение)</span>
              </label>
              <button onClick={publish} disabled={!pubTopic}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '6px', fontSize: 12, fontWeight: 600, background: pubTopic ? 'var(--color-success-emphasis)' : 'var(--color-canvas-inset)', color: pubTopic ? '#fff' : 'var(--color-fg-subtle)', border: 'none', borderRadius: 6, cursor: pubTopic ? 'pointer' : 'not-allowed' }}>
                <Send size={13} /> Опубликовать
              </button>
            </div>
          </div>
        </div>

        {/* ── Center: Tabs ────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--color-border-default)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border-muted)' }}>
            {(['topics', 'log', 'expert'] as const).map(t => {
              const labels = { topics: `Дерево топиков (${topics.length})`, log: `Лог (${messages.length})`, expert: `Анализ${errors > 0 ? ' ⚠' : ''}` };
              return (
                <button key={t} onClick={() => setTab(t)}
                  style={{ flex: 1, padding: '9px 4px', fontSize: 12, fontWeight: tab === t ? 700 : 400, background: 'none', border: 'none', borderBottom: `2px solid ${tab === t ? 'var(--color-accent-fg)' : 'transparent'}`, color: tab === t ? 'var(--color-fg-default)' : 'var(--color-fg-muted)', cursor: 'pointer' }}>
                  {labels[t]}
                </button>
              );
            })}
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>

            {/* Topics tree */}
            {tab === 'topics' && (
              topics.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-fg-muted)' }}>
                  <Radio size={28} color="var(--color-fg-subtle)" style={{ margin: '0 auto 12px' }} />
                  <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)' }}>Нет топиков</p>
                  <p style={{ margin: 0, fontSize: 12 }}>Загрузите из симулятора или добавьте вручную</p>
                </div>
              ) : (
                <div style={{ background: 'var(--color-canvas-overlay)', borderRadius: 8, border: '1px solid var(--color-border-default)', padding: '8px 0' }}>
                  <p style={{ margin: '0 0 4px', padding: '0 8px', fontSize: 10, color: 'var(--color-fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Virtual MQTT Broker</p>
                  {renderTree(tree)}
                </div>
              )
            )}

            {/* Message log */}
            {tab === 'log' && (
              <div ref={logRef} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {messages.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-fg-muted)' }}>
                    <p style={{ margin: 0, fontSize: 12 }}>Лог пуст. Опубликуйте сообщение.</p>
                  </div>
                ) : messages.map(m => (
                  <div key={m.id} style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderLeft: `3px solid ${QOS_INFO[m.qos].color}`, borderRadius: 6, padding: '8px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-accent-fg)', fontWeight: 600 }}>{m.topicPath}</span>
                      <span style={{ fontSize: 10, color: QOS_INFO[m.qos].color, background: 'var(--color-canvas-inset)', padding: '1px 6px', borderRadius: 10 }}>{QOS_INFO[m.qos].label}</span>
                      {m.retain && <span style={{ fontSize: 10, color: 'var(--color-attention-fg)', background: 'var(--color-canvas-inset)', padding: '1px 6px', borderRadius: 10 }}>retain</span>}
                      <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--color-fg-subtle)' }}>{new Date(m.ts).toLocaleTimeString('ru-RU')}</span>
                    </div>
                    <pre style={{ margin: 0, fontSize: 11, color: 'var(--color-fg-muted)', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'monospace' }}>{m.payload}</pre>
                  </div>
                ))}
              </div>
            )}

            {/* Expert findings */}
            {tab === 'expert' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {findings.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-fg-muted)' }}>
                    <p style={{ margin: 0, fontSize: 12 }}>Добавьте топики для получения анализа</p>
                  </div>
                ) : findings.map((f, i) => {
                  const cfg = SEV_CFG[f.severity];
                  const key = `${i}-${f.title}`;
                  const open = expandedFinding === key;
                  return (
                    <div key={key} style={{ background: 'var(--color-canvas-overlay)', border: `1px solid var(--color-border-default)`, borderLeft: `3px solid ${cfg.color}`, borderRadius: 6, overflow: 'hidden' }}>
                      <button onClick={() => setExpandedFinding(open ? null : key)}
                        style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 10px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                        <cfg.Icon size={13} color={cfg.color} style={{ flexShrink: 0, marginTop: 1 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
                          <span style={{ fontSize: 11, color: 'var(--color-fg-muted)', marginLeft: 6 }}>{f.category}</span>
                          <p style={{ margin: '1px 0 0', fontSize: 12, color: 'var(--color-fg-default)' }}>{f.title}</p>
                        </div>
                        <ChevronRight size={12} color="var(--color-fg-subtle)" style={{ transform: open ? 'rotate(90deg)' : '', transition: 'transform 150ms', flexShrink: 0 }} />
                      </button>
                      {open && <p style={{ margin: 0, padding: '0 10px 10px 31px', fontSize: 11, color: 'var(--color-fg-muted)', lineHeight: 1.5 }}>{f.detail}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Reference ────────────────────────────────────── */}
        <div style={{ overflow: 'auto', padding: 16 }}>
          <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: 'var(--color-fg-default)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
            <BookOpen size={12} /> Справочник MQTT
          </p>

          {/* Score */}
          {topics.length > 0 && (
            <div style={{ marginBottom: 16, padding: '12px 14px', background: 'var(--color-canvas-overlay)', borderRadius: 8, border: '1px solid var(--color-border-default)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--color-fg-muted)' }}>Оценка архитектуры</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: scoreColor }}>{score}/100</span>
              </div>
              <div style={{ height: 6, background: 'var(--color-canvas-inset)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${score}%`, background: scoreColor, borderRadius: 3, transition: 'width 0.4s ease' }} />
              </div>
              <p style={{ margin: '5px 0 0', fontSize: 11, color: 'var(--color-fg-subtle)' }}>
                {score >= 80 ? 'Отличная архитектура!' : score >= 55 ? 'Устраните предупреждения.' : 'Есть критичные ошибки.'}
              </p>
            </div>
          )}

          {/* QoS */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: 'var(--color-accent-fg)' }}>Уровни QoS</p>
            {([0, 1, 2] as QoS[]).map(q => (
              <div key={q} style={{ marginBottom: 6, padding: '7px 10px', background: 'var(--color-canvas-overlay)', borderRadius: 6, borderLeft: `3px solid ${QOS_INFO[q].color}` }}>
                <p style={{ margin: '0 0 2px', fontSize: 12, fontWeight: 600, color: QOS_INFO[q].color }}>{QOS_INFO[q].label}</p>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--color-fg-muted)' }}>{QOS_INFO[q].desc}</p>
              </div>
            ))}
          </div>

          {/* Topic rules */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: 'var(--color-accent-fg)' }}>Правила топиков</p>
            {[
              { ok: true,  text: 'home/bedroom/temperature' },
              { ok: true,  text: 'device/sensor/+/status' },
              { ok: true,  text: 'devices/#  (подписка)' },
              { ok: false, text: 'home/bed room/temp  (пробел!)' },
              { ok: false, text: '/home/temp  (лишний /)' },
              { ok: false, text: 'home/#/temp  (# не в конце)' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: r.ok ? 'var(--color-success-fg)' : 'var(--color-danger-fg)' }}>{r.ok ? '✓' : '✗'}</span>
                <code style={{ fontSize: 11, color: r.ok ? 'var(--color-fg-muted)' : 'var(--color-danger-fg)', fontFamily: 'monospace' }}>{r.text}</code>
              </div>
            ))}
          </div>

          {/* Best practices */}
          <div>
            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: 'var(--color-accent-fg)' }}>Best Practices</p>
            {[
              'Начинайте с device_id или location',
              'Оптимальная глубина: 3–5 уровней',
              'Только строчные буквы',
              'Статус устройства: retain=true',
              'Телеметрия: QoS 0, команды: QoS 1+',
              'Добавьте LWT топик (will/status)',
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 5 }}>
                <span style={{ color: 'var(--color-accent-fg)', fontSize: 12, flexShrink: 0 }}>→</span>
                <span style={{ fontSize: 11, color: 'var(--color-fg-muted)', lineHeight: 1.4 }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
