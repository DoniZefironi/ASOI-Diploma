import { ComponentDef, ComponentType } from '../types';

const PIN_SIZE = 8; // visual reference only

function leftPin(id: string, label: string, role: any, y: number, gpio?: number) {
  return { id, label, role, x: 0, y, gpioNum: gpio };
}
function rightPin(id: string, label: string, role: any, width: number, y: number, gpio?: number) {
  return { id, label, role, x: width, y, gpioNum: gpio };
}
function topPin(id: string, label: string, role: any, x: number, gpio?: number) {
  return { id, label, role, x, y: 0, gpioNum: gpio };
}
function bottomPin(id: string, label: string, role: any, x: number, h: number, gpio?: number) {
  return { id, label, role, x, y: h, gpioNum: gpio };
}

const ESP32_W = 140, ESP32_H = 308;
const UNO_W = 140, UNO_H = 220;

export const COMPONENT_DEFS: Record<ComponentType, ComponentDef> = {
  'esp32': {
    type: 'esp32',
    label: 'ESP32',
    category: 'board',
    width: ESP32_W,
    height: ESP32_H,
    description: 'Espressif ESP32 — dual-core 240 MHz, WiFi+BT, 38 GPIO',
    defaultCode: `// ESP32 Example: Blink LED
#define LED_PIN 2

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  Serial.println("ESP32 started!");
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  Serial.println("LED ON");
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  Serial.println("LED OFF");
  delay(1000);
}`,
    pins: [
      // Left column (top → bottom)
      leftPin('3V3-L', '3V3', 'power-3v3', 20),
      leftPin('GND-L1', 'GND', 'gnd', 44),
      leftPin('D15', 'D15', 'gpio', 68, 15),
      leftPin('D2', 'D2', 'gpio', 92, 2),
      leftPin('D4', 'D4', 'gpio', 116, 4),
      leftPin('RX2', 'RX2', 'gpio', 140, 16),
      leftPin('TX2', 'TX2', 'gpio', 164, 17),
      leftPin('D22', 'D22/SCL', 'scl', 188, 22),
      leftPin('D21', 'D21/SDA', 'sda', 212, 21),
      leftPin('GND-L2', 'GND', 'gnd', 236),
      // Right column (top → bottom)
      rightPin('VIN', 'VIN', 'vin', ESP32_W, 20),
      rightPin('GND-R1', 'GND', 'gnd', ESP32_W, 44),
      rightPin('D13', 'D13', 'gpio', ESP32_W, 68, 13),
      rightPin('D12', 'D12', 'gpio', ESP32_W, 92, 12),
      rightPin('D14', 'D14', 'gpio', ESP32_W, 116, 14),
      rightPin('D27', 'D27', 'gpio', ESP32_W, 140, 27),
      rightPin('D26', 'D26', 'gpio', ESP32_W, 164, 26),
      rightPin('D25', 'D25', 'gpio', ESP32_W, 188, 25),
      rightPin('D33', 'D33/ADC', 'adc', ESP32_W, 212, 33),
      rightPin('D32', 'D32/ADC', 'adc', ESP32_W, 236, 32),
      rightPin('D35', 'D35/ADC', 'adc', ESP32_W, 260, 35),
      rightPin('D34', 'D34/ADC', 'adc', ESP32_W, 284, 34),
    ],
  },

  'arduino-uno': {
    type: 'arduino-uno',
    label: 'Arduino Uno',
    category: 'board',
    width: UNO_W,
    height: UNO_H,
    description: 'Arduino Uno — ATmega328P, 16MHz, 14 digital, 6 analog pins',
    defaultCode: `// Arduino Uno Example: Blink
#define LED_PIN 13

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
  Serial.println("Arduino started!");
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(500);
  digitalWrite(LED_PIN, LOW);
  delay(500);
}`,
    pins: [
      // Digital left
      leftPin('D2', 'D2', 'gpio', 20, 2),
      leftPin('D3', 'D3~', 'gpio', 44, 3),
      leftPin('D4', 'D4', 'gpio', 68, 4),
      leftPin('D5', 'D5~', 'gpio', 92, 5),
      leftPin('D6', 'D6~', 'gpio', 116, 6),
      leftPin('D7', 'D7', 'gpio', 140, 7),
      leftPin('D8', 'D8', 'gpio', 164, 8),
      leftPin('GND-L', 'GND', 'gnd', 188),
      // Right side
      rightPin('D13', 'D13', 'gpio', UNO_W, 20, 13),
      rightPin('D12', 'D12', 'gpio', UNO_W, 44, 12),
      rightPin('D11', 'D11~', 'gpio', UNO_W, 68, 11),
      rightPin('D9', 'D9~', 'gpio', UNO_W, 92, 9),
      rightPin('D10', 'D10~', 'gpio', UNO_W, 116, 10),
      rightPin('5V', '5V', 'power-5v', UNO_W, 140),
      rightPin('3V3', '3V3', 'power-3v3', UNO_W, 164),
      rightPin('GND-R', 'GND', 'gnd', UNO_W, 188),
      rightPin('A0', 'A0', 'adc', UNO_W, 212, 14),
    ],
  },

  'dht22': {
    type: 'dht22',
    label: 'DHT22',
    category: 'sensor',
    width: 60,
    height: 80,
    description: 'Temperature & Humidity sensor. Range: -40..80°C, 0..100% RH',
    sensorKeys: ['temperature', 'humidity'],
    sensorLabels: { temperature: 'Температура (°C)', humidity: 'Влажность (%)' },
    sensorRanges: { temperature: [-40, 80], humidity: [0, 100] },
    sensorDefaults: { temperature: 25, humidity: 55 },
    defaultCode: `#include <DHT.h>
#define DHT_PIN 4
DHT dht(DHT_PIN, DHT22);

void setup() {
  Serial.begin(115200);
  dht.begin();
}

void loop() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  Serial.print("Temp: "); Serial.print(t); Serial.println(" C");
  Serial.print("Hum: ");  Serial.print(h); Serial.println(" %");
  delay(2000);
}`,
    pins: [
      topPin('VCC', 'VCC', 'vcc', 10),
      topPin('DATA', 'DATA', 'data', 30),
      topPin('NC', 'NC', 'nc', 50),
      bottomPin('GND', 'GND', 'gnd', 30, 80),
    ],
  },

  'mq2': {
    type: 'mq2',
    label: 'MQ-2 Gas',
    category: 'sensor',
    width: 60,
    height: 70,
    description: 'Gas/smoke sensor. Detects LPG, propane, smoke. 0-1023 ADC output',
    sensorKeys: ['gas'],
    sensorLabels: { gas: 'Уровень газа (0-1023)' },
    sensorRanges: { gas: [0, 1023] },
    sensorDefaults: { gas: 100 },
    defaultCode: `// ESP32 + MQ-2 Gas Sensor + Buzzer Alarm
// Wiring:
//   MQ-2 AOUT → D34 (GPIO 34)
//   MQ-2 VCC  → 3V3,  MQ-2 GND → GND
//   Buzzer +  → D25 (GPIO 25)
//   Buzzer −  → GND

#define MQ2_PIN    34
#define BUZZER_PIN 25
#define THRESHOLD  500

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.println("Gas monitor started");
}

void loop() {
  int gasLevel = analogRead(MQ2_PIN);
  Serial.print("Gas: ");
  Serial.println(gasLevel);

  if (gasLevel > THRESHOLD) {
    Serial.println("WARNING: Gas detected!");
    tone(BUZZER_PIN, 2000);
  } else {
    noTone(BUZZER_PIN);
  }
  delay(1000);
}`,
    pins: [
      topPin('VCC', 'VCC', 'vcc', 10),
      topPin('GND', 'GND', 'gnd', 30),
      topPin('DOUT', 'DOUT', 'out', 50),
      bottomPin('AOUT', 'AOUT', 'adc', 30, 70),
    ],
  },

  'ldr': {
    type: 'ldr',
    label: 'LDR',
    category: 'sensor',
    width: 50,
    height: 60,
    description: 'Light Dependent Resistor. Low resistance = bright light.',
    sensorKeys: ['light'],
    sensorLabels: { light: 'Освещённость (0-1023)' },
    sensorRanges: { light: [0, 1023] },
    sensorDefaults: { light: 500 },
    defaultCode: `#define LDR_PIN A0

void setup() {
  Serial.begin(9600);
}

void loop() {
  int light = analogRead(LDR_PIN);
  Serial.print("Light: ");
  Serial.println(light);
  delay(500);
}`,
    pins: [
      topPin('P1', 'P1', 'signal', 10),
      bottomPin('P2', 'P2', 'signal', 10, 60),
    ],
  },

  'hcsr04': {
    type: 'hcsr04',
    label: 'HC-SR04',
    category: 'sensor',
    width: 70,
    height: 60,
    description: 'Ultrasonic distance sensor. Range: 2-400 cm.',
    sensorKeys: ['distance'],
    sensorLabels: { distance: 'Расстояние (см)' },
    sensorRanges: { distance: [2, 400] },
    sensorDefaults: { distance: 50 },
    defaultCode: `#define TRIG_PIN 5
#define ECHO_PIN 6

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH);
  float distance = duration * 0.034 / 2;
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  delay(500);
}`,
    pins: [
      topPin('VCC', 'VCC', 'vcc', 10),
      topPin('TRIG', 'TRIG', 'trig', 25),
      topPin('ECHO', 'ECHO', 'echo', 45),
      bottomPin('GND', 'GND', 'gnd', 35, 60),
    ],
  },

  'led-red': {
    type: 'led-red',
    label: 'LED Красный',
    category: 'actuator',
    width: 30,
    height: 50,
    description: 'Красный светодиод',
    pins: [
      topPin('ANODE', '+', 'anode', 15),
      bottomPin('CATHODE', '−', 'cathode', 15, 50),
    ],
  },

  'led-green': {
    type: 'led-green',
    label: 'LED Зелёный',
    category: 'actuator',
    width: 30,
    height: 50,
    description: 'Зелёный светодиод',
    pins: [
      topPin('ANODE', '+', 'anode', 15),
      bottomPin('CATHODE', '−', 'cathode', 15, 50),
    ],
  },

  'led-blue': {
    type: 'led-blue',
    label: 'LED Синий',
    category: 'actuator',
    width: 30,
    height: 50,
    description: 'Синий светодиод',
    pins: [
      topPin('ANODE', '+', 'anode', 15),
      bottomPin('CATHODE', '−', 'cathode', 15, 50),
    ],
  },

  'led-yellow': {
    type: 'led-yellow',
    label: 'LED Жёлтый',
    category: 'actuator',
    width: 30,
    height: 50,
    description: 'Жёлтый светодиод',
    pins: [
      topPin('ANODE', '+', 'anode', 15),
      bottomPin('CATHODE', '−', 'cathode', 15, 50),
    ],
  },

  'buzzer': {
    type: 'buzzer',
    label: 'Buzzer',
    category: 'actuator',
    width: 50,
    height: 50,
    description: 'Пьезозуммер (пищалка)',
    defaultCode: `#define BUZZER_PIN 9

void setup() {
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  tone(BUZZER_PIN, 1000);  // 1kHz
  delay(500);
  noTone(BUZZER_PIN);
  delay(500);
}`,
    pins: [
      topPin('VCC', '+', 'vcc', 15),
      topPin('GND', '−', 'gnd', 35),
    ],
  },

  'relay': {
    type: 'relay',
    label: 'Relay',
    category: 'actuator',
    width: 70,
    height: 70,
    description: '5V Relay module. Controls 220V/10A load.',
    defaultCode: `#define RELAY_PIN 7

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);  // Relay OFF (active LOW)
}

void loop() {
  digitalWrite(RELAY_PIN, LOW);   // Relay ON
  Serial.println("Relay ON");
  delay(2000);
  digitalWrite(RELAY_PIN, HIGH);  // Relay OFF
  Serial.println("Relay OFF");
  delay(2000);
}`,
    pins: [
      topPin('VCC', 'VCC', 'vcc', 10),
      topPin('GND', 'GND', 'gnd', 30),
      topPin('IN', 'IN', 'in', 55),
      bottomPin('COM', 'COM', 'com', 15, 70),
      bottomPin('NO', 'NO', 'no', 35, 70),
      bottomPin('NC', 'NC', 'nc', 55, 70),
    ],
  },

  'servo': {
    type: 'servo',
    label: 'Servo SG90',
    category: 'actuator',
    width: 60,
    height: 60,
    description: 'Micro servo SG90. Angle: 0-180°',
    defaultCode: `#include <Servo.h>
Servo myServo;
#define SERVO_PIN 9

void setup() {
  myServo.attach(SERVO_PIN);
}

void loop() {
  for (int angle = 0; angle <= 180; angle += 10) {
    myServo.write(angle);
    delay(100);
  }
  for (int angle = 180; angle >= 0; angle -= 10) {
    myServo.write(angle);
    delay(100);
  }
}`,
    pins: [
      bottomPin('GND', 'GND', 'gnd', 10, 60),
      bottomPin('VCC', 'VCC', 'vcc', 30, 60),
      bottomPin('SIG', 'SIG', 'pwm', 50, 60),
    ],
  },

  'lcd-16x2': {
    type: 'lcd-16x2',
    label: 'LCD 16x2',
    category: 'display',
    width: 100,
    height: 60,
    description: '16×2 Character LCD (I2C)',
    defaultCode: `#include <Wire.h>
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Hello World!");
  lcd.setCursor(0, 1);
  lcd.print("IoT Simulator");
}

void loop() {
  // nothing
}`,
    pins: [
      topPin('VCC', 'VCC', 'vcc', 20),
      topPin('GND', 'GND', 'gnd', 45),
      topPin('SDA', 'SDA', 'sda', 65),
      topPin('SCL', 'SCL', 'scl', 85),
    ],
  },

  'button': {
    type: 'button',
    label: 'Кнопка',
    category: 'input',
    width: 40,
    height: 40,
    description: 'Тактовая кнопка (push button)',
    sensorKeys: ['pressed'],
    sensorLabels: { pressed: 'Нажата (0/1)' },
    sensorRanges: { pressed: [0, 1] },
    sensorDefaults: { pressed: 0 },
    pins: [
      leftPin('P1', 'P1', 'signal', 20),
      rightPin('P2', 'P2', 'signal', 40, 20),
    ],
  },

  'potentiometer': {
    type: 'potentiometer',
    label: 'Потенциометр',
    category: 'input',
    width: 50,
    height: 50,
    description: 'Переменный резистор. 0-1023 ADC output',
    sensorKeys: ['value'],
    sensorLabels: { value: 'Положение (0-1023)' },
    sensorRanges: { value: [0, 1023] },
    sensorDefaults: { value: 512 },
    pins: [
      bottomPin('GND', 'GND', 'gnd', 5, 50),
      bottomPin('WIPER', 'OUT', 'out', 25, 50),
      bottomPin('VCC', 'VCC', 'vcc', 45, 50),
    ],
  },

  'resistor': {
    type: 'resistor',
    label: 'Резистор',
    category: 'passive',
    width: 50,
    height: 20,
    description: 'Резистор',
    pins: [
      leftPin('P1', 'P1', 'signal', 10),
      rightPin('P2', 'P2', 'signal', 50, 10),
    ],
  },
};

export function getComponentDef(type: ComponentType): ComponentDef {
  return COMPONENT_DEFS[type];
}

export const PALETTE_CATEGORIES = [
  {
    label: 'Платы',
    icon: '🖥️',
    types: ['esp32', 'arduino-uno'] as ComponentType[],
  },
  {
    label: 'Датчики',
    icon: '📡',
    types: ['dht22', 'mq2', 'ldr', 'hcsr04'] as ComponentType[],
  },
  {
    label: 'Исполнители',
    icon: '⚡',
    types: ['led-red', 'led-green', 'led-blue', 'led-yellow', 'buzzer', 'relay', 'servo'] as ComponentType[],
  },
  {
    label: 'Дисплеи',
    icon: '📺',
    types: ['lcd-16x2'] as ComponentType[],
  },
  {
    label: 'Ввод',
    icon: '🎮',
    types: ['button', 'potentiometer'] as ComponentType[],
  },
  {
    label: 'Прочее',
    icon: '🔧',
    types: ['resistor'] as ComponentType[],
  },
];
