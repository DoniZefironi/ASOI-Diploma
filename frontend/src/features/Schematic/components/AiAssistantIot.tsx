'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

interface AiAssistantIotProps {
  onClose: () => void;
}

const LOCAL_ANSWERS: Record<string, string> = {
  'Что такое ESP32?': `ESP32 — микроконтроллер с Wi-Fi и Bluetooth от Espressif.

Характеристики:
  • Dual-core 240 МГц (Xtensa LX6)
  • Wi-Fi 802.11 b/g/n + Bluetooth 4.2/BLE
  • 38 GPIO пинов
  • 12-бит АЦП (34 канала)
  • SPI, I2C, UART, CAN, PWM
  • 520 КБ SRAM, 4 МБ Flash
  • Питание: 3.3 В

Отличие от Arduino Uno: ESP32 мощнее, имеет Wi-Fi/BT,
работает на 3.3В (не 5В!), АЦП точнее (12 бит vs 10 бит).`,

  'Arduino vs ESP32': `Сравнение:

Параметр     | Arduino Uno  | ESP32
-------------|--------------|-------------------
Ядра         | 1 (8 МГц)    | 2 (240 МГц)
Wi-Fi/BT     | Нет          | Да
АЦП          | 10 бит       | 12 бит
Напряжение   | 5 В          | 3.3 В
GPIO         | 14 цифр.     | 38
Цена         | ~$5          | ~$4
Память RAM   | 2 КБ         | 520 КБ

Выбирай ESP32 для IoT-проектов с беспроводной связью.
Выбирай Arduino Uno для простых задач без Wi-Fi.`,

  'Как читать DHT22?': `DHT22 — датчик температуры и влажности.

Подключение:
  VCC → 3.3В (ESP32) или 5В (Arduino)
  GND → GND
  DATA → любой GPIO (например, GPIO4)

Код:
\`\`\`cpp
#include <DHT.h>
#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
}

void loop() {
  float temp = dht.readTemperature();
  float hum  = dht.readHumidity();
  Serial.print("Температура: ");
  Serial.println(temp);
  Serial.print("Влажность: ");
  Serial.println(hum);
  delay(2000);
}
\`\`\``,

  'Как мигать светодиодом?': `Базовый пример Blink:

\`\`\`cpp
#define LED_PIN 2  // встроенный LED на ESP32

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);  // включить
  delay(1000);                  // ждать 1 сек
  digitalWrite(LED_PIN, LOW);   // выключить
  delay(1000);
}
\`\`\`

Для внешнего LED:
  Длинная ножка (+) → резистор 220–330 Ом → GPIO
  Короткая ножка (-) → GND

Не подключай LED напрямую без резистора — сгорит!`,

  'Что такое analogRead?': `analogRead(pin) — считывает аналоговый сигнал (0–3.3В) и возвращает число.

ESP32: возвращает 0–4095 (12-битный АЦП)
Arduino: возвращает 0–1023 (10-битный АЦП)

\`\`\`cpp
int val = analogRead(34);   // ESP32, GPIO34 — ADC-пин
// val: 0 (0В) .. 4095 (3.3В)

float voltage = val * 3.3 / 4095.0;
\`\`\`

Важно для ESP32:
  • Используй только ADC1 пины (32–39) при включённом Wi-Fi
  • ADC2 пины конфликтуют с Wi-Fi

Пример с потенциометром:
  Средний вывод → ADC-пин
  Крайние → 3.3В и GND`,

  'Как работает delay?': `delay(ms) — останавливает программу на заданное число миллисекунд.

\`\`\`cpp
delay(1000);   // пауза 1 секунда
delay(500);    // пауза 0.5 секунды
delay(100);    // пауза 100 мс
\`\`\`

Проблема: во время delay() контроллер ничего не делает.

Лучшая альтернатива — millis():
\`\`\`cpp
unsigned long prev = 0;
const long interval = 1000;

void loop() {
  unsigned long now = millis();
  if (now - prev >= interval) {
    prev = now;
    // делай что-то каждую секунду
  }
}
\`\`\`
Это не блокирует выполнение остального кода.`,

  'Serial.println — как использовать?': `Serial — вывод данных в монитор порта.

Базовые функции:
\`\`\`cpp
void setup() {
  Serial.begin(115200);  // скорость 115200 бод
}

void loop() {
  Serial.print("Значение: ");    // без перевода строки
  Serial.println(42);            // с переводом строки
  Serial.println("Привет!");

  float t = 23.5;
  Serial.print("Температура: ");
  Serial.print(t);
  Serial.println(" °C");

  delay(1000);
}
\`\`\`

Форматирование:
\`\`\`cpp
Serial.printf("T=%.1f H=%.0f\\n", temp, hum); // как printf
\`\`\``,

  'Что такое I2C?': `I2C (Inter-Integrated Circuit) — протокол связи с двумя проводами.

Провода:
  SDA — данные
  SCL — тактовый сигнал

На ESP32: SDA=GPIO21, SCL=GPIO22 (по умолчанию)
На Arduino: SDA=A4, SCL=A5

Особенности:
  • До 127 устройств на одной шине (у каждого свой адрес)
  • Скорость: 100 кГц (стандарт), 400 кГц (быстрый)
  • Нужны подтягивающие резисторы 4.7 кОм на SDA и SCL

Устройства на I2C: LCD, OLED-дисплеи, датчики (BMP280, MPU6050).

Пример:
\`\`\`cpp
#include <Wire.h>
Wire.begin();       // инициализация I2C
Wire.begin(21, 22); // ESP32: SDA, SCL
\`\`\``,

  'Как работает ШИМ (PWM)?': `ШИМ (PWM) — управление мощностью через быстрое переключение.

Идея: если сигнал 50% времени HIGH и 50% LOW — среднее напряжение = 50%.

Arduino:
\`\`\`cpp
analogWrite(9, 128);  // пин 9, 50% мощности (0–255)
analogWrite(9, 255);  // 100% (максимум)
analogWrite(9, 0);    // 0% (выкл)
\`\`\`

ESP32 (через ledcWrite):
\`\`\`cpp
ledcSetup(0, 5000, 8);   // канал 0, 5 кГц, 8 бит
ledcAttachPin(16, 0);    // GPIO16 на канал 0
ledcWrite(0, 128);       // 50% мощности
\`\`\`

Применение: регулировка яркости LED, скорость мотора, управление сервоприводом.`,
};

const QUICK_PROMPTS = Object.keys(LOCAL_ANSWERS);

const SYSTEM_PROMPT = `Ты — помощник по IoT, Arduino и ESP32.
Отвечай на русском языке кратко и с примерами кода.
Помогай с: подключением датчиков, написанием Arduino-скетчей, протоколами (I2C, SPI, UART),
GPIO, АЦП, ШИМ, Wi-Fi ESP32, управлением светодиодами, реле, сервоприводами.`;

export const AiAssistantIot: React.FC<AiAssistantIotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Привет! Задай вопрос про Arduino, ESP32, датчики или схемы IoT — отвечу с примером кода.' },
  ]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [apiKey, setApiKey]     = useState(() => typeof window !== 'undefined' ? localStorage.getItem('yandex_api_key') || '' : '');
  const [folderId, setFolderId] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('yandex_folder_id') || '' : '');
  const [showSettings, setShowSettings] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const saveSettings = () => {
    localStorage.setItem('yandex_api_key', apiKey);
    localStorage.setItem('yandex_folder_id', folderId);
    setShowSettings(false);
  };

  const sendLocal = (question: string): boolean => {
    const answer = LOCAL_ANSWERS[question];
    if (!answer) return false;
    setMessages(prev => [
      ...prev,
      { role: 'user', text: question },
      { role: 'assistant', text: answer },
    ]);
    return true;
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    if (sendLocal(text)) { setInput(''); return; }

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

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const reply = data?.result?.alternatives?.[0]?.message?.text || 'Нет ответа';
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (e: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `Ошибка: ${e.message || 'Не удалось получить ответ'}.\nПроверьте API-ключ в настройках ⚙️`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-800 shrink-0">
        <span className="text-blue-400 text-xs font-semibold">🤖 IoT-помощник</span>
        <div className="flex gap-1">
          <button
            onClick={() => setShowSettings(s => !s)}
            className="text-gray-400 hover:text-white px-1.5 py-1 rounded text-xs hover:bg-gray-700"
            title="Настройки API"
          >⚙️</button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white px-1.5 py-1 rounded text-xs hover:bg-gray-700"
          >✕</button>
        </div>
      </div>

      {/* Settings */}
      {showSettings && (
        <div className="bg-gray-800 border-b border-gray-700 p-3 space-y-2 shrink-0">
          <p className="text-xs text-gray-400">Yandex API (необязательно)</p>
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
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[95%] rounded-lg px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap font-mono ${
              m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-400 rounded-lg px-3 py-2 text-xs animate-pulse">···</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-2 pb-2 flex flex-col gap-1 shrink-0">
        <p className="text-xs text-gray-600 px-1">Быстрые вопросы:</p>
        <div className="flex flex-wrap gap-1">
          {QUICK_PROMPTS.map(q => (
            <button
              key={q}
              onClick={() => sendLocal(q)}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 rounded px-2 py-0.5 border border-gray-700 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2 p-2 border-t border-gray-800 shrink-0">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Спроси про ESP32, датчики..."
          rows={2}
          className="flex-1 bg-gray-800 text-white text-xs rounded px-2 py-1.5 border border-gray-700 resize-none placeholder-gray-600 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white text-xs rounded px-3 self-end py-1.5 transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
};
