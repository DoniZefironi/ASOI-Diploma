// src/professional-orientation/professional-orientation.service.ts
import { Injectable, BadRequestException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessionalOrientation } from './entities/professional-orientation.entity';
import { CareerTest } from './entities/career-test.entity';
import { SubmitTestDto } from './dto/submit-test.dto';
import { SubmitExpertResultDto } from './dto/submit-expert-result.dto';

export interface ProfessionStat {
  profession: string;
  count: number;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_HOLLAND: Omit<CareerTest, 'id' | 'createdAt' | 'updatedAt'> = {
  type: 'holland',
  title: 'Опросник Дж. Холланда',
  description: 'Определяет ваш тип личности по 6 категориям (RIASEC) и рекомендует подходящие IT-профессии.',
  duration: '10–15 минут',
  answerFormat: 'yes_no',
  isActive: true,
  questions: [
    { id: 1, text: 'Собирать и настраивать компьютерное оборудование', category: 'R' },
    { id: 2, text: 'Устранять технические неисправности в системах', category: 'R' },
    { id: 3, text: 'Работать с электронными схемами и устройствами', category: 'R' },
    { id: 4, text: 'Устанавливать и настраивать операционные системы', category: 'R' },
    { id: 5, text: 'Проектировать физические компоненты устройств', category: 'R' },
    { id: 6, text: 'Исследовать данные и выявлять закономерности', category: 'I' },
    { id: 7, text: 'Разрабатывать и тестировать алгоритмы', category: 'I' },
    { id: 8, text: 'Изучать новые технологии и научные методы', category: 'I' },
    { id: 9, text: 'Решать сложные логические и математические задачи', category: 'I' },
    { id: 10, text: 'Проводить статистический или машинный анализ данных', category: 'I' },
    { id: 11, text: 'Разрабатывать визуальный дизайн интерфейсов', category: 'A' },
    { id: 12, text: 'Создавать пользовательские сценарии и прототипы', category: 'A' },
    { id: 13, text: 'Писать техническую документацию и статьи', category: 'A' },
    { id: 14, text: 'Разрабатывать анимации и графические элементы', category: 'A' },
    { id: 15, text: 'Работать над концепцией и стилем продукта', category: 'A' },
    { id: 16, text: 'Обучать и наставлять коллег или студентов', category: 'S' },
    { id: 17, text: 'Проводить презентации и технические демонстрации', category: 'S' },
    { id: 18, text: 'Помогать пользователям решать технические проблемы', category: 'S' },
    { id: 19, text: 'Координировать работу команды разработчиков', category: 'S' },
    { id: 20, text: 'Проводить код-ревью и давать развёрнутую обратную связь', category: 'S' },
    { id: 21, text: 'Управлять проектами и принимать стратегические решения', category: 'E' },
    { id: 22, text: 'Убеждать команду и стейкхолдеров в правильности решений', category: 'E' },
    { id: 23, text: 'Вести переговоры с клиентами и партнёрами', category: 'E' },
    { id: 24, text: 'Разрабатывать стратегию развития технического продукта', category: 'E' },
    { id: 25, text: 'Запускать новые инициативы и технологические стартапы', category: 'E' },
    { id: 26, text: 'Систематизировать и структурировать данные в БД', category: 'C' },
    { id: 27, text: 'Тестировать программное обеспечение по чек-листам', category: 'C' },
    { id: 28, text: 'Вести техническую документацию и регламенты', category: 'C' },
    { id: 29, text: 'Анализировать требования и составлять спецификации', category: 'C' },
    { id: 30, text: 'Разрабатывать SQL-запросы и работать с реляционными БД', category: 'C' },
  ],
  categoryMeta: {
    R: { label: 'Реалистичный', description: 'Вам нравится работать с техникой и физическими объектами. Вы предпочитаете конкретные, ощутимые результаты.', careers: ['IoT-инженер', 'DevOps-инженер', 'Инженер-электронщик', 'Embedded-разработчик', 'Системный администратор'] },
    I: { label: 'Исследовательский', description: 'Вас привлекают аналитические задачи, исследования и решение сложных интеллектуальных проблем.', careers: ['Data Scientist', 'AI/ML-инженер', 'Backend-разработчик', 'Исследователь кибербезопасности', 'Биоинформатик'] },
    A: { label: 'Артистический', description: 'Вы любите творческую свободу, создание уникальных вещей и самовыражение через работу.', careers: ['UX/UI дизайнер', 'Frontend-разработчик', 'Технический писатель', 'Game Developer', 'Motion Designer'] },
    S: { label: 'Социальный', description: 'Вам важно работать с людьми, помогать им и строить взаимодействие в команде.', careers: ['Технический менеджер', 'Developer Advocate', 'QA-инженер', 'Tech Lead', 'Agile Coach'] },
    E: { label: 'Предпринимательский', description: 'Вы стремитесь к лидерству, влиянию и реализации амбициозных целей.', careers: ['Product Manager', 'CTO', 'Tech Lead', 'Менеджер по продукту', 'Технический предприниматель'] },
    C: { label: 'Конвентциональный', description: 'Вы цените порядок, точность и работу с чёткими правилами и структурами.', careers: ['QA-автоматизатор', 'Системный аналитик', 'DBA', 'Data Engineer', 'Бизнес-аналитик'] },
  },
};

const SEED_KLIMOV: Omit<CareerTest, 'id' | 'createdAt' | 'updatedAt'> = {
  type: 'klimov',
  title: 'Методика ДДО Е.А. Климова',
  description: 'Разделяет профессии на 5 типов по объекту труда: Человек–Техника, Человек–Человек и другие.',
  duration: '5–10 минут',
  answerFormat: 'choice',
  isActive: true,
  questions: [
    { id: 1, a: { text: 'Проводить обучение и тренинги для сотрудников', category: 'ЧЧ' }, b: { text: 'Настраивать сетевую инфраструктуру и серверы', category: 'ЧТ' } },
    { id: 2, a: { text: 'Анализировать данные с помощью SQL и Python', category: 'ЧЗ' }, b: { text: 'Создавать визуальный дизайн продукта', category: 'ЧХ' } },
    { id: 3, a: { text: 'Консультировать пользователей по техническим вопросам', category: 'ЧЧ' }, b: { text: 'Разрабатывать экологические системы мониторинга', category: 'ЧП' } },
    { id: 4, a: { text: 'Разрабатывать встроенные системы и прошивки', category: 'ЧТ' }, b: { text: 'Создавать алгоритмы обработки данных', category: 'ЧЗ' } },
    { id: 5, a: { text: 'Планировать проекты и взаимодействовать с командой', category: 'ЧЧ' }, b: { text: 'Разрабатывать программный код самостоятельно', category: 'ЧЗ' } },
    { id: 6, a: { text: 'Разрабатывать пользовательские интерфейсы', category: 'ЧХ' }, b: { text: 'Проводить технические интервью и менторинг', category: 'ЧЧ' } },
    { id: 7, a: { text: 'Проектировать аппаратное обеспечение и схемы', category: 'ЧТ' }, b: { text: 'Разрабатывать ПО для анализа медицинских данных', category: 'ЧП' } },
    { id: 8, a: { text: 'Моделировать бизнес-процессы и строить архитектуры', category: 'ЧЗ' }, b: { text: 'Управлять командой разработчиков', category: 'ЧЧ' } },
    { id: 9, a: { text: 'Создавать системы мониторинга окружающей среды', category: 'ЧП' }, b: { text: 'Разрабатывать интерактивные медиа-проекты', category: 'ЧХ' } },
    { id: 10, a: { text: 'Программировать микроконтроллеры и IoT-устройства', category: 'ЧТ' }, b: { text: 'Заниматься 3D-моделированием и анимацией', category: 'ЧХ' } },
    { id: 11, a: { text: 'Разрабатывать системы управления и хранения данных', category: 'ЧЗ' }, b: { text: 'Разрабатывать биоинформатические алгоритмы', category: 'ЧП' } },
    { id: 12, a: { text: 'Вести технические переговоры с клиентами', category: 'ЧЧ' }, b: { text: 'Создавать контент и визуальные материалы', category: 'ЧХ' } },
    { id: 13, a: { text: 'Разрабатывать драйверы и системное ПО', category: 'ЧТ' }, b: { text: 'Поддерживать пользователей и решать их проблемы', category: 'ЧЧ' } },
    { id: 14, a: { text: 'Работать над UX-исследованиями и прототипами', category: 'ЧХ' }, b: { text: 'Разрабатывать автотесты и системы QA', category: 'ЧЗ' } },
    { id: 15, a: { text: 'Разрабатывать ПО для анализа экологических данных', category: 'ЧП' }, b: { text: 'Создавать роботизированные и автоматизированные системы', category: 'ЧТ' } },
    { id: 16, a: { text: 'Проектировать архитектуру программных систем', category: 'ЧЗ' }, b: { text: 'Обслуживать и модернизировать серверное оборудование', category: 'ЧТ' } },
    { id: 17, a: { text: 'Исследовать применение технологий в науке и природе', category: 'ЧП' }, b: { text: 'Обучать пользователей работе с системами', category: 'ЧЧ' } },
    { id: 18, a: { text: 'Разрабатывать игры и интерактивные приложения', category: 'ЧХ' }, b: { text: 'Настраивать облачные сервисы и CI/CD', category: 'ЧТ' } },
    { id: 19, a: { text: 'Разрабатывать алгоритмы машинного обучения', category: 'ЧЗ' }, b: { text: 'Руководить командой и проводить планёрки', category: 'ЧЧ' } },
    { id: 20, a: { text: 'Создавать ПО для научных и природных исследований', category: 'ЧП' }, b: { text: 'Строить системы обработки и хранения больших данных', category: 'ЧЗ' } },
  ],
  categoryMeta: {
    ЧЧ: { label: 'Человек — Человек', description: 'Вы ориентированы на взаимодействие с людьми: общение, обучение, помощь и командная работа — ваша стихия.', careers: ['Product Manager', 'Developer Advocate', 'Tech Lead', 'Agile Coach', 'Customer Success Manager'] },
    ЧТ: { label: 'Человек — Техника', description: 'Вас привлекает работа с техническими системами, оборудованием и физической инфраструктурой.', careers: ['DevOps-инженер', 'IoT-инженер', 'Embedded-разработчик', 'SRE', 'Инженер-электронщик'] },
    ЧП: { label: 'Человек — Природа', description: 'Вам близки задачи, связанные с природными процессами, биологией и исследованиями в естественных науках.', careers: ['Биоинформатик', 'Data Scientist в науке', 'Эколог-аналитик', 'Медицинский разработчик ПО'] },
    ЧЗ: { label: 'Человек — Знаковая система', description: 'Вы склонны к работе с абстрактными системами: кодом, данными, формулами и структурированной информацией.', careers: ['Backend-разработчик', 'Data Engineer', 'Системный архитектор', 'QA-автоматизатор', 'Аналитик данных'] },
    ЧХ: { label: 'Человек — Художественный образ', description: 'Вам близко творческое создание продуктов: дизайн, анимация, интерфейсы и визуальные решения.', careers: ['UX/UI дизайнер', 'Frontend-разработчик', 'Game Designer', 'Motion Designer', 'Технический писатель'] },
  },
};

// ─── Career profiles ──────────────────────────────────────────────────────────

export interface CareerProfile {
  emoji: string;
  description: string;
  skills: string[];
  tools: string[];
  salaryRange: string;
  demandLevel: 'Очень высокий' | 'Высокий' | 'Средний';
  growthPath: string[];
}

export const CAREER_PROFILES: Record<string, CareerProfile> = {
  'DevOps Lead': {
    emoji: '⚙️',
    description: 'Руководит командой DevOps-инженеров, выстраивая надёжные CI/CD-конвейеры и облачную инфраструктуру. Обеспечивает высокую доступность и масштабируемость систем.',
    skills: ['CI/CD', 'Контейнеризация', 'Облачные платформы', 'Мониторинг', 'Инфраструктура как код', 'Управление командой'],
    tools: ['Kubernetes', 'Terraform', 'Jenkins', 'Prometheus', 'AWS/GCP'],
    salaryRange: '$80k–$150k / год',
    demandLevel: 'Очень высокий',
    growthPath: ['Junior DevOps', 'DevOps Engineer', 'Senior DevOps', 'DevOps Lead', 'Head of Infrastructure'],
  },
  'SRE': {
    emoji: '🔧',
    description: 'Site Reliability Engineer обеспечивает надёжность и производительность крупных распределённых систем. Разрабатывает инструменты автоматизации и управляет инцидентами.',
    skills: ['SLI/SLO/SLA', 'Автоматизация', 'Производительность систем', 'Мониторинг', 'Linux'],
    tools: ['Prometheus', 'Grafana', 'PagerDuty', 'Kubernetes', 'Python'],
    salaryRange: '$90k–$160k / год',
    demandLevel: 'Очень высокий',
    growthPath: ['Junior SRE', 'SRE', 'Senior SRE', 'Principal SRE', 'Director of Reliability'],
  },
  'IoT-инженер': {
    emoji: '🔌',
    description: 'Разрабатывает программное и аппаратное обеспечение для умных устройств и систем Интернета вещей. Работает на стыке встроенного программирования и облачных технологий.',
    skills: ['Встроенное программирование', 'Протоколы IoT', 'Электроника', 'Облачные IoT-платформы', 'Безопасность устройств'],
    tools: ['Arduino', 'Raspberry Pi', 'MQTT', 'AWS IoT', 'C/C++'],
    salaryRange: '$70k–$130k / год',
    demandLevel: 'Очень высокий',
    growthPath: ['Embedded Developer', 'IoT Engineer', 'Senior IoT Engineer', 'IoT Architect', 'Head of IoT'],
  },
  'Embedded Dev': {
    emoji: '💾',
    description: 'Пишет низкоуровневый код для микроконтроллеров и встроенных систем. Оптимизирует программы под жёсткие ограничения ресурсов.',
    skills: ['C/C++', 'RTOS', 'Отладка', 'Электроника', 'Протоколы связи'],
    tools: ['STM32', 'FreeRTOS', 'GDB', 'Oscilloscope', 'Keil'],
    salaryRange: '$60k–$120k / год',
    demandLevel: 'Высокий',
    growthPath: ['Junior Embedded', 'Embedded Developer', 'Senior Embedded', 'Lead Engineer', 'Embedded Architect'],
  },
  'Hardware Bio': {
    emoji: '🧬',
    description: 'Создаёт специализированное аппаратное обеспечение для биомедицинских исследований и лабораторных приборов. Совмещает электронику с биологическими приложениями.',
    skills: ['Биомедицинская электроника', 'Схемотехника', 'Сигнальная обработка', 'Протоколы биоданных'],
    tools: ['LabVIEW', 'MATLAB', 'Altium Designer', 'FPGA', 'Python'],
    salaryRange: '$75k–$135k / год',
    demandLevel: 'Средний',
    growthPath: ['Электронщик', 'Bio Hardware Engineer', 'Senior Engineer', 'Principal Engineer', 'Research Director'],
  },
  'Eco Hardware': {
    emoji: '🌱',
    description: 'Проектирует энергоэффективные устройства и системы мониторинга окружающей среды. Фокусируется на устойчивом развитии и минимальном экологическом следе.',
    skills: ['Энергосбережение', 'Сенсорные системы', 'Экологический мониторинг', 'Встроенные системы'],
    tools: ['Arduino', 'LoRaWAN', 'Solar Power Systems', 'Python', 'MQTT'],
    salaryRange: '$60k–$110k / год',
    demandLevel: 'Средний',
    growthPath: ['Hardware Engineer', 'Eco Hardware Engineer', 'Senior Engineer', 'Systems Architect', 'CTO'],
  },
  'System Admin': {
    emoji: '🖥️',
    description: 'Администрирует серверную инфраструктуру, сети и операционные системы организации. Обеспечивает безопасность и бесперебойную работу IT-систем.',
    skills: ['Linux/Windows Server', 'Сетевое администрирование', 'Безопасность', 'Резервное копирование', 'Мониторинг'],
    tools: ['Active Directory', 'Nagios', 'Ansible', 'VMware', 'Bash'],
    salaryRange: '$50k–$95k / год',
    demandLevel: 'Высокий',
    growthPath: ['Helpdesk', 'Системный администратор', 'Старший администратор', 'IT-менеджер', 'IT Director'],
  },
  'Infrastructure Eng': {
    emoji: '🏗️',
    description: 'Проектирует и поддерживает масштабируемую IT-инфраструктуру компании. Автоматизирует развёртывание и управление ресурсами.',
    skills: ['Облачные вычисления', 'Сетевые технологии', 'Виртуализация', 'Безопасность', 'Автоматизация'],
    tools: ['Terraform', 'Ansible', 'AWS', 'Cisco', 'Packer'],
    salaryRange: '$75k–$140k / год',
    demandLevel: 'Высокий',
    growthPath: ['IT Engineer', 'Infrastructure Engineer', 'Senior Engineer', 'Architect', 'VP Infrastructure'],
  },
  'Hardware Design': {
    emoji: '🔩',
    description: 'Разрабатывает электронные схемы и печатные платы для различных технических устройств. Занимается прототипированием и тестированием аппаратных решений.',
    skills: ['Схемотехника', 'PCB Design', 'FPGA', 'Электромагнитная совместимость', 'Тестирование'],
    tools: ['Altium Designer', 'KiCad', 'LTspice', 'Oscilloscope', 'FPGA Xilinx'],
    salaryRange: '$65k–$120k / год',
    demandLevel: 'Высокий',
    growthPath: ['Junior Hardware Engineer', 'Hardware Designer', 'Senior Designer', 'Lead Engineer', 'Chief Hardware Engineer'],
  },
  'Creative Tech': {
    emoji: '🎨',
    description: 'Совмещает технические навыки с творческим подходом для создания инновационных технических решений. Работает на стыке дизайна и инженерии.',
    skills: ['Прототипирование', 'Интерактивные инсталляции', 'Физические вычисления', 'Дизайн'],
    tools: ['Processing', 'Arduino', 'Max/MSP', 'Unity', 'Blender'],
    salaryRange: '$55k–$100k / год',
    demandLevel: 'Средний',
    growthPath: ['Creative Technologist', 'Senior Creative Tech', 'Lead Creative', 'Creative Director', 'Innovation Director'],
  },
  'Research Lead': {
    emoji: '🔬',
    description: 'Руководит научно-исследовательскими проектами в области IT и смежных дисциплин. Публикует результаты и внедряет инновации в производство.',
    skills: ['Научные методы', 'Управление исследованиями', 'Анализ данных', 'Публикации', 'Менторство'],
    tools: ['Python', 'R', 'LaTeX', 'Jupyter', 'MATLAB'],
    salaryRange: '$90k–$160k / год',
    demandLevel: 'Высокий',
    growthPath: ['Researcher', 'Senior Researcher', 'Research Lead', 'Principal Researcher', 'Research Director'],
  },
  'Data Science Lead': {
    emoji: '📊',
    description: 'Возглавляет команду дата-сайентистов и формирует стратегию работы с данными. Трансформирует данные в бизнес-решения и управляет моделями ML.',
    skills: ['ML/DL', 'Статистика', 'Лидерство', 'Визуализация данных', 'Стратегия данных', 'A/B тестирование'],
    tools: ['Python', 'TensorFlow', 'Spark', 'Tableau', 'dbt'],
    salaryRange: '$110k–$190k / год',
    demandLevel: 'Очень высокий',
    growthPath: ['Junior DS', 'Data Scientist', 'Senior DS', 'DS Lead', 'Chief Data Officer'],
  },
  'ML Engineer': {
    emoji: '🤖',
    description: 'Разрабатывает и внедряет машинно-обучаемые модели в производственные системы. Оптимизирует пайплайны обработки данных и деплоя моделей.',
    skills: ['Python', 'ML/DL', 'MLOps', 'Feature Engineering', 'Оптимизация моделей', 'Облачные платформы'],
    tools: ['PyTorch', 'TensorFlow', 'MLflow', 'Airflow', 'Kubernetes'],
    salaryRange: '$95k–$175k / год',
    demandLevel: 'Очень высокий',
    growthPath: ['Junior ML Engineer', 'ML Engineer', 'Senior ML Engineer', 'ML Lead', 'Head of ML'],
  },
  'AI Hardware': {
    emoji: '🧠',
    description: 'Разрабатывает специализированные чипы и аппаратные ускорители для задач искусственного интеллекта. Оптимизирует нейросети под конкретные аппаратные платформы.',
    skills: ['FPGA/ASIC', 'Нейросетевые архитектуры', 'Параллельные вычисления', 'Оптимизация памяти'],
    tools: ['CUDA', 'Verilog/VHDL', 'TensorRT', 'Vivado', 'PyTorch'],
    salaryRange: '$110k–$200k / год',
    demandLevel: 'Очень высокий',
    growthPath: ['Hardware Engineer', 'AI Hardware Engineer', 'Senior Engineer', 'Principal Engineer', 'Chief Architect'],
  },
  'Биоинформатик': {
    emoji: '🧬',
    description: 'Применяет методы биоинформатики для анализа геномных данных и биологических последовательностей. Разрабатывает алгоритмы для обработки больших массивов биологических данных.',
    skills: ['Биоинформатика', 'Python/R', 'Геномный анализ', 'Статистика', 'Базы биоданных', 'Машинное обучение'],
    tools: ['BioPython', 'BLAST', 'Galaxy', 'R/Bioconductor', 'GATK'],
    salaryRange: '$75k–$140k / год',
    demandLevel: 'Высокий',
    growthPath: ['Биолог-аналитик', 'Биоинформатик', 'Старший биоинформатик', 'Lead Bioinformatician', 'Research Director'],
  },
  'Research Scientist': {
    emoji: '🔭',
    description: 'Проводит фундаментальные и прикладные исследования на пересечении IT и науки. Разрабатывает новые алгоритмы и методологии для решения сложных задач.',
    skills: ['Научные методы', 'Математика', 'Программирование', 'Написание статей', 'Анализ данных'],
    tools: ['Python', 'MATLAB', 'R', 'LaTeX', 'Jupyter'],
    salaryRange: '$85k–$155k / год',
    demandLevel: 'Высокий',
    growthPath: ['Research Assistant', 'Research Scientist', 'Senior Scientist', 'Principal Scientist', 'Research Director'],
  },
  'Data Scientist': {
    emoji: '📈',
    description: 'Извлекает ценные инсайты из больших данных с помощью статистики и машинного обучения. Строит предиктивные модели и визуализирует результаты для принятия решений.',
    skills: ['Python', 'Машинное обучение', 'Статистика', 'SQL', 'Визуализация данных', 'A/B тесты'],
    tools: ['Python', 'scikit-learn', 'Pandas', 'Tableau', 'SQL'],
    salaryRange: '$80k–$150k / год',
    demandLevel: 'Очень высокий',
    growthPath: ['Аналитик данных', 'Data Scientist', 'Senior Data Scientist', 'Lead DS', 'Chief Data Officer'],
  },
  'Backend Dev': {
    emoji: '⚡',
    description: 'Разрабатывает серверную логику приложений, API и системы управления данными. Обеспечивает производительность, безопасность и масштабируемость бэкенд-систем.',
    skills: ['Backend разработка', 'REST/GraphQL API', 'Базы данных', 'Архитектура', 'Безопасность', 'Тестирование'],
    tools: ['Node.js / Python / Java', 'PostgreSQL', 'Redis', 'Docker', 'Kafka'],
    salaryRange: '$70k–$140k / год',
    demandLevel: 'Очень высокий',
    growthPath: ['Junior Backend', 'Backend Developer', 'Senior Backend', 'Tech Lead', 'Software Architect'],
  },
  'Creative AI': {
    emoji: '🎭',
    description: 'Создаёт AI-системы для генерации контента: изображений, текстов, музыки и видео. Разрабатывает творческие приложения на основе генеративных моделей.',
    skills: ['Генеративные модели', 'Prompt Engineering', 'Python', 'Компьютерное зрение', 'Творческое мышление'],
    tools: ['Stable Diffusion', 'GPT API', 'PyTorch', 'ComfyUI', 'Midjourney API'],
    salaryRange: '$80k–$150k / год',
    demandLevel: 'Очень высокий',
    growthPath: ['AI Artist', 'Creative AI Engineer', 'Senior AI Engineer', 'Lead Creative AI', 'AI Product Director'],
  },
  'Tech Artist': {
    emoji: '🖌️',
    description: 'Объединяет художественный талант с техническими навыками в разработке игр и интерактивных медиа. Создаёт инструменты и пайплайны для арт-команд.',
    skills: ['3D-графика', 'Шейдеры', 'Python/Scripting', 'Game Engine', 'Оптимизация'],
    tools: ['Unity/Unreal', 'Houdini', 'Maya', 'Substance Painter', 'Python'],
    salaryRange: '$65k–$120k / год',
    demandLevel: 'Высокий',
    growthPath: ['3D Artist', 'Tech Artist', 'Senior Tech Artist', 'Lead Tech Artist', 'Art Director'],
  },
  'UX Researcher': {
    emoji: '🔍',
    description: 'Проводит качественные и количественные исследования пользователей для улучшения продуктов. Переводит пользовательские инсайты в требования дизайна.',
    skills: ['UX-исследования', 'Юзабилити-тестирование', 'Анализ данных', 'Интервьюирование', 'Прототипирование'],
    tools: ['Figma', 'Maze', 'Hotjar', 'UserTesting', 'Miro'],
    salaryRange: '$70k–$130k / год',
    demandLevel: 'Высокий',
    growthPath: ['UX Intern', 'UX Researcher', 'Senior UX Researcher', 'Lead Researcher', 'Head of UX Research'],
  },
  'Product Designer': {
    emoji: '✏️',
    description: 'Создаёт полный цикл дизайна продукта от концепции до готового интерфейса. Балансирует эстетику, функциональность и бизнес-цели.',
    skills: ['UI/UX Design', 'Прототипирование', 'Дизайн-системы', 'Пользовательские исследования', 'Анимация'],
    tools: ['Figma', 'Sketch', 'Principle', 'Zeplin', 'InVision'],
    salaryRange: '$75k–$135k / год',
    demandLevel: 'Высокий',
    growthPath: ['Junior Designer', 'Product Designer', 'Senior Designer', 'Lead Designer', 'Head of Design'],
  },
  'Hardware UX': {
    emoji: '🖱️',
    description: 'Проектирует пользовательский опыт для физических устройств и IoT-продуктов. Совмещает промышленный дизайн с принципами UX.',
    skills: ['Промышленный дизайн', 'UX для IoT', 'Прототипирование', 'Тестирование пользователей'],
    tools: ['SolidWorks', 'Figma', 'Arduino', 'Autodesk Fusion', '3D-принтер'],
    salaryRange: '$65k–$120k / год',
    demandLevel: 'Средний',
    growthPath: ['Industrial Designer', 'Hardware UX Designer', 'Senior Designer', 'Lead Designer', 'Design Director'],
  },
  'Industrial Designer': {
    emoji: '🏭',
    description: 'Разрабатывает концепции и внешний вид промышленных изделий и потребительской электроники. Сочетает эстетику с эргономикой и технологичностью.',
    skills: ['Промышленный дизайн', '3D-моделирование', 'Материаловедение', 'Прототипирование', 'Рендеринг'],
    tools: ['SolidWorks', 'Rhino 3D', 'KeyShot', 'Autodesk', 'Adobe CC'],
    salaryRange: '$60k–$110k / год',
    demandLevel: 'Средний',
    growthPath: ['Designer Assistant', 'Industrial Designer', 'Senior Designer', 'Lead Designer', 'Creative Director'],
  },
  'Eco Designer': {
    emoji: '🌿',
    description: 'Создаёт экологически устойчивые дизайн-решения с минимальным воздействием на окружающую среду. Применяет принципы циркулярной экономики в продуктовом дизайне.',
    skills: ['Sustainable Design', 'Lifecycle Assessment', 'Материаловедение', 'Системное мышление'],
    tools: ['SolidWorks', 'SimaPro', 'Illustrator', 'Rhino', 'InDesign'],
    salaryRange: '$55k–$100k / год',
    demandLevel: 'Средний',
    growthPath: ['Designer', 'Eco Designer', 'Senior Eco Designer', 'Sustainability Lead', 'Chief Sustainability Officer'],
  },
  'Science Visualizer': {
    emoji: '🌌',
    description: 'Визуализирует сложные научные данные и концепции для публикаций, образования и медиа. Делает науку понятной и доступной через визуальные образы.',
    skills: ['Научная визуализация', '3D-моделирование', 'Программирование визуализаций', 'Дизайн'],
    tools: ['Blender', 'D3.js', 'MATLAB', 'Cinema 4D', 'Python'],
    salaryRange: '$55k–$100k / год',
    demandLevel: 'Средний',
    growthPath: ['Visualizer', 'Science Visualizer', 'Senior Visualizer', 'Lead Visualizer', 'Creative Director'],
  },
  'Технический писатель': {
    emoji: '📝',
    description: 'Создаёт техническую документацию, руководства и обучающие материалы для разработчиков и пользователей. Переводит сложные технические концепции на понятный язык.',
    skills: ['Техническое письмо', 'Структурирование информации', 'Основы программирования', 'SEO', 'XML/Markdown', 'Редактирование'],
    tools: ['Confluence', 'Swagger', 'Markdown', 'MadCap Flare', 'Git'],
    salaryRange: '$55k–$100k / год',
    demandLevel: 'Высокий',
    growthPath: ['Junior Technical Writer', 'Technical Writer', 'Senior Technical Writer', 'Lead Writer', 'Head of Documentation'],
  },
  'Doc Engineer': {
    emoji: '📋',
    description: 'Разрабатывает системы и инструменты для автоматизации технической документации. Интегрирует документацию в процессы разработки.',
    skills: ['Documentation as Code', 'API Documentation', 'Автоматизация', 'Git', 'Structured Writing'],
    tools: ['MkDocs', 'Sphinx', 'GitBook', 'OpenAPI', 'GitHub Actions'],
    salaryRange: '$65k–$110k / год',
    demandLevel: 'Высокий',
    growthPath: ['Technical Writer', 'Doc Engineer', 'Senior Doc Engineer', 'Documentation Architect', 'Head of Docs'],
  },
  'UX/UI Designer': {
    emoji: '🎨',
    description: 'Проектирует привлекательные и удобные пользовательские интерфейсы для веб и мобильных приложений. Создаёт дизайн-системы и обеспечивает консистентность продукта.',
    skills: ['UI/UX Design', 'Figma', 'Прототипирование', 'Дизайн-системы', 'Пользовательские исследования', 'Accessibility'],
    tools: ['Figma', 'Adobe XD', 'Principle', 'Zeplin', 'Storybook'],
    salaryRange: '$65k–$125k / год',
    demandLevel: 'Очень высокий',
    growthPath: ['Junior Designer', 'UX/UI Designer', 'Senior Designer', 'Lead Designer', 'Head of Design'],
  },
  'Frontend Dev': {
    emoji: '💻',
    description: 'Разрабатывает интерактивные веб-интерфейсы, реализуя дизайн-макеты с помощью современных JavaScript-фреймворков. Оптимизирует производительность и доступность.',
    skills: ['React/Vue/Angular', 'TypeScript', 'CSS/Tailwind', 'Анимации', 'Тестирование', 'Webpack/Vite'],
    tools: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Vite'],
    salaryRange: '$60k–$120k / год',
    demandLevel: 'Очень высокий',
    growthPath: ['Junior Frontend', 'Frontend Developer', 'Senior Frontend', 'Tech Lead', 'Architect'],
  },
  'Product Manager': {
    emoji: '🚀',
    description: 'Управляет жизненным циклом продукта от идеи до запуска, балансируя потребности пользователей и бизнес-цели. Координирует работу кросс-функциональных команд.',
    skills: ['Продуктовое мышление', 'Аналитика', 'Стейкхолдер менеджмент', 'Agile/Scrum', 'Приоритизация', 'A/B тесты'],
    tools: ['Jira', 'Confluence', 'Amplitude', 'Figma', 'Miro'],
    salaryRange: '$85k–$160k / год',
    demandLevel: 'Очень высокий',
    growthPath: ['Associate PM', 'Product Manager', 'Senior PM', 'Principal PM', 'VP of Product'],
  },
  'Tech Lead': {
    emoji: '👨‍💻',
    description: 'Возглавляет техническую команду, принимает архитектурные решения и наставляет разработчиков. Балансирует между написанием кода и координацией команды.',
    skills: ['Архитектура ПО', 'Менторство', 'Код-ревью', 'Планирование', 'Техническая экспертиза', 'Коммуникации'],
    tools: ['Git', 'Jira', 'Любой стек команды', 'Architecture diagrams', 'CI/CD'],
    salaryRange: '$100k–$180k / год',
    demandLevel: 'Очень высокий',
    growthPath: ['Senior Developer', 'Tech Lead', 'Principal Engineer', 'Engineering Manager', 'CTO'],
  },
  'Tech Support Lead': {
    emoji: '🛠️',
    description: 'Руководит командой технической поддержки, выстраивает процессы обработки обращений и повышает качество сервиса. Анализирует тренды инцидентов.',
    skills: ['Управление командой', 'ITSM', 'Технические знания', 'Клиентский сервис', 'Аналитика'],
    tools: ['Zendesk', 'Jira Service Desk', 'Confluence', 'Slack', 'PowerBI'],
    salaryRange: '$60k–$110k / год',
    demandLevel: 'Высокий',
    growthPath: ['Support Engineer', 'Senior Support', 'Team Lead', 'Tech Support Manager', 'Head of Support'],
  },
  'Field Engineer': {
    emoji: '🔨',
    description: 'Выезжает на объекты для установки, настройки и обслуживания оборудования. Решает сложные технические проблемы на месте у клиента.',
    skills: ['Техническое обслуживание', 'Диагностика', 'Сети', 'Оборудование', 'Клиентские коммуникации'],
    tools: ['Диагностическое ПО', 'Сетевые анализаторы', 'ITSM системы', 'Мультиметры'],
    salaryRange: '$50k–$90k / год',
    demandLevel: 'Высокий',
    growthPath: ['Field Technician', 'Field Engineer', 'Senior Field Engineer', 'Regional Manager', 'Director of Field Ops'],
  },
  'Science Educator': {
    emoji: '🎓',
    description: 'Разрабатывает и проводит образовательные программы по IT и техническим дисциплинам. Создаёт учебные материалы и онлайн-курсы.',
    skills: ['Педагогика', 'Технические знания', 'Создание контента', 'Публичные выступления', 'Методология обучения'],
    tools: ['LMS платформы', 'Видеоредакторы', 'Jupyter', 'PowerPoint', 'Moodle'],
    salaryRange: '$50k–$90k / год',
    demandLevel: 'Средний',
    growthPath: ['Instructor', 'Science Educator', 'Senior Educator', 'Course Lead', 'Head of Education'],
  },
  'Bio Tech Lead': {
    emoji: '🧪',
    description: 'Руководит технической командой в биотехнологической компании или исследовательском учреждении. Совмещает биологическую экспертизу с IT-лидерством.',
    skills: ['Биотехнологии', 'Управление командой', 'Разработка ПО', 'Анализ данных', 'Лабораторные технологии'],
    tools: ['Python', 'R', 'LabVIEW', 'Jira', 'Git'],
    salaryRange: '$90k–$160k / год',
    demandLevel: 'Высокий',
    growthPath: ['Bio Developer', 'Senior Bio Engineer', 'Bio Tech Lead', 'Director of Technology', 'CTO'],
  },
  'QA Lead': {
    emoji: '✅',
    description: 'Руководит командой тестировщиков и выстраивает стратегию обеспечения качества продукта. Разрабатывает тест-планы и внедряет автоматизацию.',
    skills: ['Управление тестированием', 'Автоматизация QA', 'Agile/Scrum', 'Метрики качества', 'Код-ревью тестов', 'Наставничество'],
    tools: ['Selenium', 'Cypress', 'Jira', 'TestRail', 'Jenkins'],
    salaryRange: '$70k–$130k / год',
    demandLevel: 'Высокий',
    growthPath: ['QA Engineer', 'Senior QA', 'QA Lead', 'QA Manager', 'VP of Engineering Quality'],
  },
  'Agile Coach': {
    emoji: '🔄',
    description: 'Помогает командам и организациям внедрять Agile-методологии и повышать эффективность работы. Фасилитирует ретроспективы и улучшает командные процессы.',
    skills: ['Agile/Scrum/Kanban', 'Коучинг', 'Фасилитация', 'Организационные изменения', 'Коммуникации'],
    tools: ['Jira', 'Miro', 'Confluence', 'Retro tools', 'Slack'],
    salaryRange: '$70k–$130k / год',
    demandLevel: 'Высокий',
    growthPath: ['Scrum Master', 'Agile Coach', 'Senior Agile Coach', 'Enterprise Agile Coach', 'Transformation Lead'],
  },
  'Game Designer': {
    emoji: '🎮',
    description: 'Разрабатывает игровые механики, нарративы и балансирует геймплей. Создаёт увлекательный пользовательский опыт в игровых продуктах.',
    skills: ['Геймдизайн', 'Нарративный дизайн', 'Балансирование', 'Прототипирование', 'Игровая аналитика'],
    tools: ['Unity', 'Unreal Engine', 'GameMaker', 'Twine', 'Excel/Sheets'],
    salaryRange: '$55k–$110k / год',
    demandLevel: 'Высокий',
    growthPath: ['Junior Game Designer', 'Game Designer', 'Senior Designer', 'Lead Game Designer', 'Creative Director'],
  },
  'Dev Advocate': {
    emoji: '📣',
    description: 'Продвигает технологии и платформы среди разработчиков через контент, выступления и сообщества. Является мостом между компанией и внешними разработчиками.',
    skills: ['Публичные выступления', 'Написание контента', 'Программирование', 'Community Building', 'Социальные сети'],
    tools: ['GitHub', 'YouTube/Podcast', 'Dev.to', 'Twitter/X', 'Postman'],
    salaryRange: '$80k–$145k / год',
    demandLevel: 'Высокий',
    growthPath: ['Developer', 'Developer Advocate', 'Senior Advocate', 'Lead Advocate', 'Head of Developer Relations'],
  },
  'CTO': {
    emoji: '🏆',
    description: 'Возглавляет технологическое направление компании, определяя архитектурные решения и технологическую стратегию. Управляет всеми техническими командами.',
    skills: ['Технологическая стратегия', 'Лидерство', 'Архитектура систем', 'Управление командами', 'Бизнес-мышление', 'Инновации'],
    tools: ['Весь стек компании', 'OKR системы', 'Architecture tools', 'Jira', 'Roadmap tools'],
    salaryRange: '$150k–$350k+ / год',
    demandLevel: 'Очень высокий',
    growthPath: ['Senior Engineer', 'Architect/Tech Lead', 'Engineering Manager', 'VP Engineering', 'CTO'],
  },
  'Startup Founder': {
    emoji: '💡',
    description: 'Основывает и развивает технологический стартап от идеи до масштабирования. Совмещает предпринимательство с глубоким пониманием технологий.',
    skills: ['Предпринимательство', 'Технологии', 'Питчинг', 'Управление командой', 'Финансы', 'Стратегия'],
    tools: ['Pitch Deck', 'Notion', 'Stripe', 'AWS', 'Slack'],
    salaryRange: '$0–$∞ (equity-based)',
    demandLevel: 'Высокий',
    growthPath: ['Developer/PM', 'Co-founder', 'Startup Founder', 'Series A+', 'Unicorn Founder'],
  },
  'Tech Entrepreneur': {
    emoji: '⚡',
    description: 'Создаёт технологические продукты с предпринимательским подходом. Совмещает техническую реализацию с пониманием рынка и бизнес-моделей.',
    skills: ['Предпринимательство', 'Технические навыки', 'Маркетинг', 'Финансовое моделирование', 'Лидерство'],
    tools: ['No-code/Low-code', 'GitHub', 'Notion', 'Stripe', 'Google Analytics'],
    salaryRange: '$70k–$250k+ / год',
    demandLevel: 'Высокий',
    growthPath: ['Developer', 'Tech Lead', 'CTO', 'Founder', 'Serial Entrepreneur'],
  },
  'Hardware Startup': {
    emoji: '🔋',
    description: 'Разрабатывает и выводит на рынок хардварные продукты в рамках стартапа. Управляет всем циклом от проектирования до производства.',
    skills: ['Аппаратная разработка', 'Производство', 'Прототипирование', 'Supply Chain', 'Предпринимательство'],
    tools: ['Altium', 'SolidWorks', 'Kickstarter', 'CAD', 'ERP системы'],
    salaryRange: '$60k–$180k / год',
    demandLevel: 'Средний',
    growthPath: ['Engineer', 'Founder', 'CTO Hardware Startup', 'Series A CTO', 'CEO/CTO'],
  },
  'Eco Startup': {
    emoji: '♻️',
    description: 'Строит технологический бизнес в сфере экологии и устойчивого развития. Разрабатывает решения для климатических проблем с помощью технологий.',
    skills: ['Cleantech', 'Предпринимательство', 'ESG', 'Технологии', 'Фандрайзинг'],
    tools: ['Data Analytics', 'IoT платформы', 'Notion', 'Pitch Deck', 'Green Cloud'],
    salaryRange: '$60k–$150k / год',
    demandLevel: 'Средний',
    growthPath: ['Eco Engineer', 'Eco Tech Lead', 'Founder', 'CEO Cleantech', 'Impact Investor'],
  },
  'Bio Venture': {
    emoji: '🦠',
    description: 'Создаёт биотехнологический стартап, монетизируя научные разработки в области биологии и медицины. Привлекает инвестиции в сфере биотех.',
    skills: ['Биотехнологии', 'Предпринимательство', 'Научная коммерциализация', 'Регуляторные вопросы'],
    tools: ['Биолабораторное оборудование', 'Python/R', 'Pitch Deck', 'Clinical Trial Software'],
    salaryRange: '$80k–$250k+ / год',
    demandLevel: 'Средний',
    growthPath: ['Researcher', 'Bio Lead', 'Founder', 'CEO BioTech', 'Life Sciences Executive'],
  },
  'Data Product Manager': {
    emoji: '📦',
    description: 'Управляет продуктами на основе данных, определяя стратегию сбора, обработки и монетизации данных. Работает на стыке продуктового менеджмента и аналитики.',
    skills: ['Продуктовое мышление', 'Аналитика данных', 'SQL', 'Стратегия данных', 'A/B тесты', 'Agile'],
    tools: ['Amplitude', 'Mixpanel', 'dbt', 'SQL', 'Jira'],
    salaryRange: '$90k–$165k / год',
    demandLevel: 'Очень высокий',
    growthPath: ['Data Analyst', 'Data PM', 'Senior Data PM', 'Principal PM Data', 'VP of Data Products'],
  },
  'Tech Strategist': {
    emoji: '🎯',
    description: 'Разрабатывает технологическую стратегию компании и трансформационные инициативы. Помогает организациям принимать правильные технологические решения.',
    skills: ['Технологическая стратегия', 'Консалтинг', 'Аналитика', 'Коммуникации', 'Управление изменениями'],
    tools: ['PowerPoint', 'Tableau', 'Notion', 'SWOT/PESTEL инструменты', 'Roadmap tools'],
    salaryRange: '$100k–$180k / год',
    demandLevel: 'Высокий',
    growthPath: ['Analyst', 'Senior Analyst', 'Tech Strategist', 'Principal Strategist', 'Chief Strategy Officer'],
  },
  'Creative Director': {
    emoji: '🌟',
    description: 'Возглавляет творческое направление в технологической компании или агентстве. Формирует визуальный язык бренда и управляет командой дизайнеров.',
    skills: ['Творческое лидерство', 'Брендинг', 'UI/UX', 'Управление командой', 'Стратегическое мышление'],
    tools: ['Figma', 'Adobe CC', 'Miro', 'Notion', 'Brand guidelines tools'],
    salaryRange: '$100k–$180k / год',
    demandLevel: 'Высокий',
    growthPath: ['Designer', 'Senior Designer', 'Art Director', 'Creative Director', 'Chief Creative Officer'],
  },
  'Product Lead': {
    emoji: '🛸',
    description: 'Руководит группой продуктовых менеджеров и определяет продуктовую стратегию линейки продуктов. Обеспечивает связь между бизнесом и разработкой.',
    skills: ['Продуктовая стратегия', 'Лидерство', 'Аналитика', 'Коммуникации', 'Roadmap планирование'],
    tools: ['Jira', 'Amplitude', 'Figma', 'Confluence', 'OKR платформы'],
    salaryRange: '$120k–$200k / год',
    demandLevel: 'Очень высокий',
    growthPath: ['PM', 'Senior PM', 'Principal PM', 'Product Lead', 'VP of Product'],
  },
  'Scrum Master': {
    emoji: '🔁',
    description: 'Фасилитирует работу Scrum-команды, устраняет препятствия и обеспечивает соблюдение Agile-практик. Помогает команде достигать максимальной производительности.',
    skills: ['Scrum', 'Фасилитация', 'Коучинг', 'Управление конфликтами', 'Метрики Agile'],
    tools: ['Jira', 'Miro', 'Confluence', 'Retro tools', 'Slack'],
    salaryRange: '$65k–$120k / год',
    demandLevel: 'Высокий',
    growthPath: ['Team Member', 'Scrum Master', 'Senior Scrum Master', 'Agile Coach', 'Transformation Lead'],
  },
  'Team Coordinator': {
    emoji: '👥',
    description: 'Координирует работу технических команд, управляет коммуникациями и обеспечивает выполнение планов. Синхронизирует работу разных подразделений.',
    skills: ['Координация', 'Коммуникации', 'Планирование', 'Документирование', 'ITSM'],
    tools: ['Jira', 'Confluence', 'Slack', 'MS Project', 'Notion'],
    salaryRange: '$50k–$90k / год',
    demandLevel: 'Высокий',
    growthPath: ['Coordinator', 'Team Coordinator', 'Senior Coordinator', 'Operations Manager', 'COO'],
  },
  'IT Auditor': {
    emoji: '🔏',
    description: 'Проводит аудит IT-систем и процессов компании на соответствие стандартам безопасности и регуляторным требованиям. Выявляет риски и рекомендует улучшения.',
    skills: ['IT-аудит', 'Кибербезопасность', 'Нормативные требования', 'Документирование', 'Аналитика рисков'],
    tools: ['ACL/Galvanize', 'Nessus', 'ServiceNow', 'Excel', 'COBIT'],
    salaryRange: '$70k–$130k / год',
    demandLevel: 'Высокий',
    growthPath: ['IT Analyst', 'IT Auditor', 'Senior Auditor', 'Audit Manager', 'Chief Audit Executive'],
  },
  'Systems Engineer': {
    emoji: '⚙️',
    description: 'Проектирует и интегрирует сложные технические системы, обеспечивая их надёжную работу. Применяет системный подход к решению инженерных задач.',
    skills: ['Системная инженерия', 'Интеграция систем', 'Управление требованиями', 'Тестирование систем'],
    tools: ['MATLAB', 'SysML', 'Enterprise Architect', 'Jenkins', 'Camunda'],
    salaryRange: '$75k–$140k / год',
    demandLevel: 'Высокий',
    growthPath: ['Engineer', 'Systems Engineer', 'Senior Systems Engineer', 'Systems Architect', 'Chief Systems Engineer'],
  },
  'Data Analyst Science': {
    emoji: '🔢',
    description: 'Анализирует научные данные с применением статистических методов и инструментов визуализации. Помогает исследователям извлекать смысл из экспериментальных данных.',
    skills: ['Статистический анализ', 'Python/R', 'SQL', 'Визуализация данных', 'Научная методология'],
    tools: ['R', 'Python', 'SPSS', 'Tableau', 'Jupyter'],
    salaryRange: '$60k–$110k / год',
    demandLevel: 'Высокий',
    growthPath: ['Data Analyst', 'Science Analyst', 'Senior Analyst', 'Lead Analyst', 'Head of Analytics'],
  },
  'Bio Data Analyst': {
    emoji: '🧫',
    description: 'Анализирует биологические и медицинские данные для поддержки исследований и разработки лекарств. Применяет биостатистику и биоинформатику.',
    skills: ['Биостатистика', 'R/Python', 'Геномные данные', 'Биоинформатика', 'SQL'],
    tools: ['R/Bioconductor', 'Python', 'SAS', 'SPSS', 'Galaxy'],
    salaryRange: '$65k–$120k / год',
    demandLevel: 'Высокий',
    growthPath: ['Биолог-аналитик', 'Bio Data Analyst', 'Senior Analyst', 'Lead Bio Analyst', 'Research Director'],
  },
  'Database Architect': {
    emoji: '🗄️',
    description: 'Проектирует архитектуру баз данных и систем хранения для высоконагруженных приложений. Оптимизирует производительность и обеспечивает надёжность данных.',
    skills: ['Проектирование БД', 'SQL/NoSQL', 'Оптимизация запросов', 'Репликация и шардинг', 'Безопасность данных', 'Масштабирование'],
    tools: ['PostgreSQL', 'MongoDB', 'Redis', 'Apache Cassandra', 'DBT'],
    salaryRange: '$90k–$170k / год',
    demandLevel: 'Очень высокий',
    growthPath: ['DBA Junior', 'DBA', 'Senior DBA', 'Database Architect', 'Chief Data Architect'],
  },
  'Data Engineer': {
    emoji: '🔧',
    description: 'Строит и поддерживает пайплайны обработки данных и платформы аналитики. Обеспечивает надёжный поток данных от источников до хранилищ.',
    skills: ['ETL/ELT', 'SQL', 'Python', 'Оркестрация данных', 'Облачные хранилища', 'Streaming'],
    tools: ['Apache Spark', 'Airflow', 'dbt', 'Kafka', 'Snowflake'],
    salaryRange: '$80k–$155k / год',
    demandLevel: 'Очень высокий',
    growthPath: ['Data Analyst', 'Data Engineer', 'Senior Data Engineer', 'Lead Data Engineer', 'Head of Data Engineering'],
  },
  'Content Strategist': {
    emoji: '📰',
    description: 'Разрабатывает стратегию контента для технологических компаний и продуктов. Планирует, создаёт и оптимизирует контент для привлечения и удержания аудитории.',
    skills: ['Контент-стратегия', 'SEO', 'Копирайтинг', 'Аналитика', 'UX Writing'],
    tools: ['CMS системы', 'SEMrush', 'Google Analytics', 'Ahrefs', 'Notion'],
    salaryRange: '$55k–$100k / год',
    demandLevel: 'Высокий',
    growthPath: ['Content Writer', 'Content Strategist', 'Senior Strategist', 'Head of Content', 'CMO'],
  },
  'UX Writer': {
    emoji: '✍️',
    description: 'Создаёт тексты интерфейсов, делая продукты понятными и удобными для пользователей. Работает в тесной связке с дизайнерами и разработчиками.',
    skills: ['UX Writing', 'Microcopy', 'Понимание UX', 'Редактирование', 'A/B тестирование текстов'],
    tools: ['Figma', 'Contentful', 'Confluence', 'Hemingway App', 'UserTesting'],
    salaryRange: '$60k–$110k / год',
    demandLevel: 'Высокий',
    growthPath: ['Copywriter', 'UX Writer', 'Senior UX Writer', 'Lead UX Writer', 'Head of UX Writing'],
  },
};

// ─── Rules matrix ─────────────────────────────────────────────────────────────

interface CareerEntry {
  title: string;
  confidence: number;
}

const RULES_MATRIX: Record<string, CareerEntry[]> = {
  'R+ЧЧ': [{ title: 'DevOps Lead', confidence: 82 }, { title: 'SRE', confidence: 80 }],
  'R+ЧТ': [{ title: 'IoT-инженер', confidence: 95 }, { title: 'Embedded Dev', confidence: 92 }],
  'R+ЧП': [{ title: 'Hardware Bio', confidence: 75 }, { title: 'Eco Hardware', confidence: 70 }],
  'R+ЧЗ': [{ title: 'System Admin', confidence: 88 }, { title: 'Infrastructure Eng', confidence: 85 }],
  'R+ЧХ': [{ title: 'Hardware Design', confidence: 78 }, { title: 'Creative Tech', confidence: 72 }],

  'I+ЧЧ': [{ title: 'Research Lead', confidence: 85 }, { title: 'Data Science Lead', confidence: 82 }],
  'I+ЧТ': [{ title: 'ML Engineer', confidence: 92 }, { title: 'AI Hardware', confidence: 88 }],
  'I+ЧП': [{ title: 'Биоинформатик', confidence: 95 }, { title: 'Research Scientist', confidence: 90 }],
  'I+ЧЗ': [{ title: 'Data Scientist', confidence: 97 }, { title: 'Backend Dev', confidence: 88 }],
  'I+ЧХ': [{ title: 'Creative AI', confidence: 80 }, { title: 'Tech Artist', confidence: 75 }],

  'A+ЧЧ': [{ title: 'UX Researcher', confidence: 88 }, { title: 'Product Designer', confidence: 85 }],
  'A+ЧТ': [{ title: 'Hardware UX', confidence: 75 }, { title: 'Industrial Designer', confidence: 72 }],
  'A+ЧП': [{ title: 'Eco Designer', confidence: 78 }, { title: 'Science Visualizer', confidence: 74 }],
  'A+ЧЗ': [{ title: 'Технический писатель', confidence: 90 }, { title: 'Doc Engineer', confidence: 85 }],
  'A+ЧХ': [{ title: 'UX/UI Designer', confidence: 97 }, { title: 'Frontend Dev', confidence: 92 }],

  'S+ЧЧ': [{ title: 'Product Manager', confidence: 95 }, { title: 'Tech Lead', confidence: 92 }],
  'S+ЧТ': [{ title: 'Tech Support Lead', confidence: 85 }, { title: 'Field Engineer', confidence: 80 }],
  'S+ЧП': [{ title: 'Science Educator', confidence: 80 }, { title: 'Bio Tech Lead', confidence: 75 }],
  'S+ЧЗ': [{ title: 'QA Lead', confidence: 88 }, { title: 'Agile Coach', confidence: 85 }],
  'S+ЧХ': [{ title: 'Game Designer', confidence: 88 }, { title: 'Dev Advocate', confidence: 85 }],

  'E+ЧЧ': [{ title: 'CTO', confidence: 90 }, { title: 'Startup Founder', confidence: 88 }],
  'E+ЧТ': [{ title: 'Tech Entrepreneur', confidence: 85 }, { title: 'Hardware Startup', confidence: 80 }],
  'E+ЧП': [{ title: 'Eco Startup', confidence: 78 }, { title: 'Bio Venture', confidence: 74 }],
  'E+ЧЗ': [{ title: 'Data Product Manager', confidence: 88 }, { title: 'Tech Strategist', confidence: 85 }],
  'E+ЧХ': [{ title: 'Creative Director', confidence: 88 }, { title: 'Product Lead', confidence: 85 }],

  'C+ЧЧ': [{ title: 'Scrum Master', confidence: 85 }, { title: 'Team Coordinator', confidence: 82 }],
  'C+ЧТ': [{ title: 'IT Auditor', confidence: 88 }, { title: 'Systems Engineer', confidence: 85 }],
  'C+ЧП': [{ title: 'Data Analyst Science', confidence: 85 }, { title: 'Bio Data Analyst', confidence: 80 }],
  'C+ЧЗ': [{ title: 'Database Architect', confidence: 95 }, { title: 'Data Engineer', confidence: 92 }],
  'C+ЧХ': [{ title: 'Content Strategist', confidence: 82 }, { title: 'UX Writer', confidence: 80 }],
};

// ─── Personality insights ─────────────────────────────────────────────────────

const PERSONALITY_INSIGHTS: Record<string, string> = {
  'R+ЧЧ': 'Вы — практичный командный игрок, который находит удовлетворение в технической работе, выстроенной вокруг людей. Вы умеете объяснять сложные технические концепции простым языком и строить мосты между разными командами. Ваша сила — в надёжности и способности решать реальные проблемы, сохраняя человеческий подход.',
  'R+ЧТ': 'Вы — прирождённый инженер, для которого работа с техникой — это не просто профессия, а призвание. Вы мыслите конкретно и ощутимо: вам нравится когда результат можно потрогать руками. Ваша дотошность в деталях и умение разобраться в самом сложном оборудовании делают вас незаменимым специалистом.',
  'R+ЧП': 'Вы объединяете техническое мышление с глубоким уважением к природным процессам. Вам интересны задачи на пересечении инженерии и наук о жизни. Ваш уникальный взгляд помогает создавать технологии, которые гармонируют с окружающей средой.',
  'R+ЧЗ': 'Вы — систематик и организатор технических систем. Вам нравится наводить порядок в хаосе: структурировать инфраструктуру, документировать процессы и обеспечивать стабильную работу систем. Ваша надёжность и точность делают вас ценным хранителем IT-экосистемы.',
  'R+ЧХ': 'Вы соединяете инженерное мышление с эстетическим чутьём. Вам важно, чтобы технические решения были не только функциональными, но и красивыми. Ваш нестандартный взгляд позволяет создавать технологии, которые восхищают.',
  'I+ЧЧ': 'Вы — аналитик-гуманист, который использует данные для понимания людей. Вам одинаково интересно исследовать закономерности и делиться открытиями с командой. Ваша способность переводить сложные аналитические выводы в понятные инсайты делает вас ценным связующим звеном.',
  'I+ЧТ': 'Вы — исследователь на переднем крае технологий, которому особенно интересны задачи на стыке алгоритмов и аппаратного обеспечения. Вы думаете системно и глубоко погружаетесь в технические детали. Ваше сочетание научного мышления и инженерной экспертизы — редкий и ценный дар.',
  'I+ЧП': 'Вы — исследователь природы вооружённый мощью информационных технологий. Вас влекут фундаментальные вопросы жизни, и вы готовы применять самые передовые методы для их изучения. Ваша работа имеет потенциал изменить наше понимание биологических систем.',
  'I+ЧЗ': 'Вы — чистый аналитик, для которого данные и алгоритмы — родная стихия. Вы обладаете выдающейся способностью находить скрытые паттерны и строить модели реального мира. Ваше аналитическое мышление и любовь к точным системам — основа научного прогресса.',
  'I+ЧХ': 'Вы — творческий исследователь, который видит в технологиях средство художественного и научного самовыражения. Вам интересно использовать ИИ и алгоритмы для создания нового. Ваше уникальное сочетание научного и творческого мышления открывает перед вами совершенно новые горизонты.',
  'A+ЧЧ': 'Вы — эмпатичный дизайнер, для которого главное — понять и решить реальные проблемы людей. Вы слушаете, наблюдаете и превращаете инсайты в элегантные решения. Ваша способность соединять человеческую психологию и дизайн-мышление делает продукты по-настоящему любимыми.',
  'A+ЧТ': 'Вы проектируете мир, где техника служит человеку, а не наоборот. Вам важно, чтобы любое устройство было интуитивно понятным и приятным в использовании. Ваше внимание к эргономике и эстетике технических продуктов — редкая и востребованная компетенция.',
  'A+ЧП': 'Вы — визионер устойчивого будущего, создающий решения на стыке дизайна, науки и природы. Вам важно, чтобы ваша работа не только была красивой, но и несла пользу планете. Ваша способность мыслить системно и эстетически одновременно открывает уникальные возможности.',
  'A+ЧЗ': 'Вы обладаете редким даром — превращать сложное в понятное. Вам нравится структурировать информацию и облекать её в ясную, логичную форму. Ваша точность в деталях и творческий подход к подаче материала делают технические знания доступными для всех.',
  'A+ЧХ': 'Вы — прирождённый цифровой творец. Вам нравится создавать визуальный язык, который говорит сам за себя. Ваша способность соединять эстетику, функциональность и эмоциональный отклик пользователя — это то, что отличает хорошие продукты от великих.',
  'S+ЧЧ': 'Вы — природный лидер и объединитель людей. Вам нравится строить команды, достигать целей вместе и помогать каждому раскрыть свой потенциал. Ваша эмпатия в сочетании со стратегическим мышлением делает вас идеальным менеджером и вдохновителем.',
  'S+ЧТ': 'Вы — надёжный технический эксперт, который всегда готов прийти на помощь. Вам нравится передавать знания и решать технические проблемы вместе с людьми. Ваша способность объяснять сложное простым языком и технический кругозор делают вас незаменимым в команде.',
  'S+ЧП': 'Вы — вдохновляющий наставник в мире науки и технологий. Вам важно не только самому понимать сложные вещи, но и зажигать этим пониманием других. Ваш энтузиазм и способность находить связь между природой, наукой и людьми делают вас уникальным коммуникатором.',
  'S+ЧЗ': 'Вы — системный мыслитель с сильными командными качествами. Вам нравится выстраивать процессы, которые работают как часы, и обеспечивать качество через чёткие стандарты. Ваша методичность и умение работать с людьми — сильное сочетание для любой Agile-команды.',
  'S+ЧХ': 'Вы — творческий коммуникатор, который умеет увлечь людей идеей. Вам нравится создавать опыт, который вдохновляет и запоминается. Ваша способность соединять технологии, геймификацию и человеческий опыт открывает широкие возможности в продуктовых и игровых командах.',
  'E+ЧЧ': 'Вы — прирождённый лидер с предпринимательской жилкой. Вам нравится вдохновлять людей и вести их к большим целям. Ваша способность видеть возможности там, где другие видят проблемы, и строить команды мечты делает вас кандидатом на роль CTO или основателя.',
  'E+ЧТ': 'Вы — технический предприниматель, который умеет превращать идеи в реальные продукты. Вам нравится работать с конкретными решениями и выводить их на рынок. Ваша энергия, техническая экспертиза и предпринимательское мышление — мощная комбинация для стартапа.',
  'E+ЧП': 'Вы — предприниматель с миссией. Вам важно не просто зарабатывать, но и менять мир к лучшему через технологии. Ваша способность видеть бизнес-потенциал в научных открытиях и глобальных проблемах открывает путь в impact-инвестиции и greentech.',
  'E+ЧЗ': 'Вы — стратег данных с предпринимательским духом. Вам нравится использовать аналитику для принятия смелых бизнес-решений. Ваша способность видеть ценность в данных и монетизировать её делает вас идеальным лидером в data-driven компаниях.',
  'E+ЧХ': 'Вы — творческий лидер, который создаёт продукты, меняющие культуру. Вам важна не только функциональность, но и красота, эмоция, история. Ваша харизма, вкус и умение вдохновлять команды делают вас идеальным Creative Director или Product Lead.',
  'C+ЧЧ': 'Вы — организованный командный игрок, который любит порядок и слаженную работу. Вам нравится создавать системы и процессы, которые помогают людям работать эффективнее. Ваша надёжность, внимание к деталям и умение координировать людей делают вас основой любой команды.',
  'C+ЧТ': 'Вы — скрупулёзный технический специалист, который не пропустит ни одной детали. Вам нравится проверять, контролировать и обеспечивать соответствие стандартам. Ваша методичность и глубокое знание систем делают вас незаменимым в аудите и инженерных процессах.',
  'C+ЧП': 'Вы — аналитик с научным складом ума, который любит находить закономерности в данных. Вам нравится работать с точными измерениями и биологическими данными. Ваша точность, методичность и научный подход делают вас ценным специалистом в исследовательских и аналитических командах.',
  'C+ЧЗ': 'Вы — хранитель данных и архитектор информационных систем. Вам нравится создавать надёжные структуры, которые служат годами. Ваше стремление к совершенству в организации данных, глубокие знания SQL и системное мышление делают вас ключевым специалистом в любой data-driven компании.',
  'C+ЧХ': 'Вы — методичный создатель контента, который умеет соединить структуру и творчество. Вам нравится работать с текстами и визуальными образами в рамках чётких стандартов. Ваша аккуратность, внимание к деталям и творческое чутьё делают вас ценным UX Writer или контент-стратегом.',
};

// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class ProfessionalOrientationService implements OnModuleInit {
  constructor(
    @InjectRepository(ProfessionalOrientation)
    private readonly repo: Repository<ProfessionalOrientation>,
    @InjectRepository(CareerTest)
    private readonly testRepo: Repository<CareerTest>,
  ) {}

  /** Сидируем тесты при запуске, если их ещё нет в БД */
  async onModuleInit() {
    const count = await this.testRepo.count();
    if (count === 0) {
      await this.testRepo.save([
        this.testRepo.create(SEED_HOLLAND),
        this.testRepo.create(SEED_KLIMOV),
      ]);
    }
  }

  // ── Public ────────────────────────────────────────────────────────────────

  async getTests() {
    const tests = await this.testRepo.find({ where: { isActive: true } });
    return tests.map(t => ({
      type: t.type,
      title: t.title,
      description: t.description,
      questionCount: t.questions?.length ?? 0,
      duration: t.duration,
      answerFormat: t.answerFormat,
    }));
  }

  async getTestQuestions(type: string) {
    const test = await this.testRepo.findOne({ where: { type, isActive: true } });
    if (!test) throw new NotFoundException(`Test "${type}" not found`);
    return {
      testType: test.type,
      title: test.title,
      answerFormat: test.answerFormat,
      questions: test.questions,
    };
  }

  async submitTest(userId: number, dto: SubmitTestDto) {
    const test = await this.testRepo.findOne({ where: { type: dto.testType, isActive: true } });
    if (!test) throw new NotFoundException(`Test "${dto.testType}" not found`);

    const result = this.score(test, dto.answers);

    const existing = await this.repo.findOne({ where: { userId } });
    const allResults = (existing?.testResult || {}) as Record<string, any>;
    allResults[dto.testType] = result;

    if (existing) {
      existing.testResult = allResults;
      existing.recommendedProfession = result.topCareers[0];
      return this.repo.save(existing);
    }
    return this.repo.save(this.repo.create({
      userId,
      testResult: allResults,
      recommendedProfession: result.topCareers[0],
    }));
  }

  private score(test: CareerTest, answers: any[]) {
    const meta = test.categoryMeta ?? {};
    const scores: Record<string, number> = {};
    Object.keys(meta).forEach(k => (scores[k] = 0));

    if (test.answerFormat === 'yes_no') {
      test.questions.forEach((q: any, idx: number) => {
        if (answers[idx] === 1) scores[q.category] = (scores[q.category] ?? 0) + 1;
      });
    } else if (test.answerFormat === 'choice') {
      test.questions.forEach((q: any, idx: number) => {
        const ans = answers[idx];
        if (ans === 'a') scores[q.a.category] = (scores[q.a.category] ?? 0) + 1;
        else if (ans === 'b') scores[q.b.category] = (scores[q.b.category] ?? 0) + 1;
      });
    }

    const maxPerCategory = test.answerFormat === 'yes_no'
      ? Math.ceil(test.questions.length / Object.keys(meta).length)
      : Math.round(test.questions.length * 2 / Object.keys(meta).length);

    const sorted = (Object.entries(scores) as [string, number][]).sort((a, b) => b[1] - a[1]);
    const topCategory = sorted[0][0];
    const topMeta = meta[topCategory] ?? { label: topCategory, description: '', careers: [] };

    return {
      scores,
      topType: topCategory,
      topTypeLabel: topMeta.label,
      topTypeDescription: topMeta.description,
      topCareers: topMeta.careers,
      allTypes: sorted.map(([cat, score]) => ({
        type: cat,
        label: meta[cat]?.label ?? cat,
        score,
        maxScore: maxPerCategory,
      })),
    };
  }

  // ── Admin CRUD ─────────────────────────────────────────────────────────────

  async adminGetAllTests() {
    return this.testRepo.find({ order: { createdAt: 'ASC' } });
  }

  async adminGetTest(type: string) {
    const test = await this.testRepo.findOne({ where: { type } });
    if (!test) throw new NotFoundException(`Test "${type}" not found`);
    return test;
  }

  async adminCreateTest(dto: Partial<CareerTest>) {
    const test = this.testRepo.create(dto);
    return this.testRepo.save(test);
  }

  async adminUpdateTest(type: string, dto: Partial<CareerTest>) {
    const test = await this.adminGetTest(type);
    Object.assign(test, dto);
    return this.testRepo.save(test);
  }

  async adminDeleteTest(type: string) {
    const test = await this.adminGetTest(type);
    await this.testRepo.remove(test);
  }

  // ── User results ──────────────────────────────────────────────────────────

  async findByUserId(userId: number) {
    return this.repo.findOne({ where: { userId } });
  }

  async legacyUpdateOrCreate(userId: number, dto: { recommendedProfession: string; testResult?: any }) {
    const existing = await this.findByUserId(userId);
    if (existing) {
      existing.recommendedProfession = dto.recommendedProfession;
      if (dto.testResult) existing.testResult = dto.testResult;
      return this.repo.save(existing);
    }
    return this.repo.save(this.repo.create({
      userId,
      recommendedProfession: dto.recommendedProfession,
      testResult: dto.testResult ?? {},
    }));
  }

  async getStats(): Promise<ProfessionStat[]> {
    const stats = await this.repo
      .createQueryBuilder('po')
      .select('po.recommendedProfession', 'profession')
      .addSelect('COUNT(po.id)', 'count')
      .groupBy('po.recommendedProfession')
      .orderBy('count', 'DESC')
      .getRawMany();
    return stats.map(row => ({ profession: row.profession, count: parseInt(row.count, 10) }));
  }

  async submitExpertResult(userId: number, dto: SubmitExpertResultDto) {
    const existing = await this.repo.findOne({ where: { userId } });
    
    if (existing) {
      existing.expertResult = dto as any;
      existing.recommendedProfession = dto.topMatches[0]?.careerTitle ?? existing.recommendedProfession;
      return this.repo.save(existing);
    }
    
    return this.repo.save(this.repo.create({
      userId,
      recommendedProfession: dto.topMatches[0]?.careerTitle ?? 'Не определено',
      expertResult: dto,
    }));
  }

  // ── Expert Analysis ───────────────────────────────────────────────────────

  async getExpertAnalysis(userId: number) {
    const record = await this.repo.findOne({ where: { userId } });
    if (!record?.testResult) {
      throw new NotFoundException('Результаты тестов не найдены. Пройдите тесты Холланда и Климова.');
    }

    const hollandResult = record.testResult['holland'];
    const klimovResult = record.testResult['klimov'];

    if (!hollandResult || !klimovResult) {
      throw new BadRequestException('Необходимо пройти оба теста: Холланда и Климова.');
    }

    const hollandType = hollandResult.topType as string;
    const klimovType = klimovResult.topType as string;
    const hollandLabel = hollandResult.topTypeLabel as string;
    const klimovLabel = klimovResult.topTypeLabel as string;
    const hollandScores = hollandResult.scores as Record<string, number>;
    const klimovScores = klimovResult.scores as Record<string, number>;

    const matrixKey = `${hollandType}+${klimovType}`;
    const careerEntries = RULES_MATRIX[matrixKey] ?? [];

    const topCareers = careerEntries.map(entry => {
      const profile = CAREER_PROFILES[entry.title];
      if (!profile) {
        return {
          title: entry.title,
          emoji: '💼',
          confidence: entry.confidence,
          description: 'Описание профессии скоро будет добавлено.',
          skills: [],
          tools: [],
          salaryRange: 'Уточняется',
          demandLevel: 'Высокий' as const,
          growthPath: [],
        };
      }
      return {
        title: entry.title,
        emoji: profile.emoji,
        confidence: entry.confidence,
        description: profile.description,
        skills: profile.skills,
        tools: profile.tools,
        salaryRange: profile.salaryRange,
        demandLevel: profile.demandLevel,
        growthPath: profile.growthPath,
      };
    });

    const insightKey = `${hollandType}+${klimovType}`;
    const personalityInsight = PERSONALITY_INSIGHTS[insightKey]
      ?? `Ваше сочетание типов Холланда (${hollandLabel}) и Климова (${klimovLabel}) формирует уникальный профессиональный профиль. Вы обладаете редким набором качеств, который позволяет успешно работать в нескольких направлениях одновременно. Изучите рекомендованные профессии, чтобы найти свой идеальный карьерный путь.`;

    return {
      hollandType,
      klimovType,
      hollandLabel,
      klimovLabel,
      hollandScores,
      klimovScores,
      topCareers,
      personalityInsight,
    };
  }

  // ─── AI Roadmap Generation ────────────────────────────────────────────────

  async generateRoadmap(dto: {
    careerId: string;
    careerTitle: string;
    traitScores: Record<string, number>;
    firedRuleDescriptions: string[];
    confidence: number;
  }): Promise<any> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        return await this.generateRoadmapViaGemini(apiKey, dto);
      } catch (e: any) {
        // fallback to local generation on quota/network errors
        console.warn('Gemini unavailable, using local roadmap generator:', e.message?.slice(0, 80));
      }
    }

    return this.generateRoadmapLocally(dto);
  }

  private async generateRoadmapViaGemini(apiKey: string, dto: {
    careerId: string; careerTitle: string;
    traitScores: Record<string, number>;
    firedRuleDescriptions: string[]; confidence: number;
  }): Promise<any> {
    const traitLabels: Record<string, string> = {
      logical: 'Логическое мышление', analytical: 'Аналитика', technical: 'Техническая склонность',
      creative: 'Творческое мышление', social: 'Коммуникабельность', managerial: 'Лидерство',
      research: 'Самообучаемость', detail: 'Внимание к деталям', risk: 'Готовность к риску',
    };
    const traitEntries = Object.entries(dto.traitScores).sort(([, a], [, b]) => b - a);
    const topTraits = traitEntries.slice(0, 3).map(([k, v]) => `${traitLabels[k] ?? k}: ${v}/10`).join(', ');
    const weakTraits = traitEntries.filter(([, v]) => v < 5).map(([k, v]) => `${traitLabels[k] ?? k}: ${v}/10`).join(', ');
    const rulesBlock = dto.firedRuleDescriptions.length > 0
      ? dto.firedRuleDescriptions.map((d, i) => `  ${i + 1}. ${d}`).join('\n')
      : '  Нет специфических правил.';

    const prompt = `Ты — опытный IT-карьерный консультант. Составь персонализированную дорожную карту для студента.

Целевая профессия: ${dto.careerTitle}
Степень совпадения профиля: ${dto.confidence}%
Сильные стороны: ${topTraits}
Области для развития: ${weakTraits || 'нет явных пробелов'}
Ключевые выводы из анализа:
${rulesBlock}

Верни ТОЛЬКО валидный JSON без markdown блоков:
{"phases":[{"title":"","duration":"","focus":"","goals":[],"resources":[],"milestone":""}],"totalDuration":"","firstStep":"","advice":""}

Требования: 4-5 фаз, реалистичные сроки, конкретные ресурсы, всё на русском языке.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 2048, temperature: 0.7 },
        }),
      },
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini API error: ${err}`);
    }

    const data = await response.json() as any;
    const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('AI returned invalid JSON');
    return JSON.parse(jsonMatch[0]);
  }

  private generateRoadmapLocally(dto: {
    careerId: string; careerTitle: string;
    traitScores: Record<string, number>;
    firedRuleDescriptions: string[]; confidence: number;
  }): any {
    type PhaseTemplate = { title: string; duration: string; focus: string; goals: string[]; resources: string[]; milestone: string };
    const templates: Record<string, PhaseTemplate[]> = {
      'frontend-developer': [
        { title: 'Основы веб-разработки', duration: '1–2 месяца', focus: 'HTML, CSS, базовый JavaScript',
          goals: ['Освоить семантический HTML5', 'Изучить CSS Flexbox и Grid', 'Написать первые JS-скрипты'],
          resources: ['MDN Web Docs (документация)', 'freeCodeCamp (интерактивный курс)', 'CSS Tricks (статьи)'],
          milestone: 'Сверстать адаптивную веб-страницу с нуля' },
        { title: 'React и современный JS', duration: '2–3 месяца', focus: 'React, ES6+, TypeScript',
          goals: ['Изучить React hooks и компонентный подход', 'Освоить TypeScript основы', 'Работать с API через fetch/axios'],
          resources: ['Официальная документация React (docs.react.dev)', 'Курс «React — полный курс» на Udemy', 'TypeScript Handbook'],
          milestone: 'Создать SPA-приложение на React+TypeScript' },
        { title: 'Инструменты и экосистема', duration: '1–2 месяца', focus: 'Git, сборка, тестирование',
          goals: ['Уверенно работать с Git', 'Настроить Vite/Webpack проект', 'Написать базовые тесты (Jest)'],
          resources: ['Pro Git Book (книга, бесплатно)', 'Vitejs.dev (документация)', 'Testing Library docs'],
          milestone: 'Опубликовать проект на GitHub Pages с CI' },
        { title: 'Портфолио и трудоустройство', duration: '2–3 месяца', focus: 'Реальные проекты, собеседования',
          goals: ['Создать 2–3 проекта для портфолио', 'Пройти код-ревью от опытных разработчиков', 'Подготовиться к техническому интервью'],
          resources: ['LeetCode / Codewars (алгоритмы)', 'Frontend Mentor (дизайн-макеты)', 'Хабр Карьера (вакансии)'],
          milestone: 'Получить первый оффер или стажировку' },
      ],
      'backend-developer': [
        { title: 'Основы программирования', duration: '1–2 месяца', focus: 'Выбранный язык (Node.js / Python / Java)',
          goals: ['Освоить синтаксис и типы данных', 'Понять ООП и функциональные паттерны', 'Работать с файлами и модулями'],
          resources: ['Node.js official docs', 'Python.org tutorial', 'Курс на Stepik / Coursera'],
          milestone: 'Написать консольное приложение с CRUD-операциями' },
        { title: 'Базы данных и REST API', duration: '2–3 месяца', focus: 'SQL, NoSQL, HTTP-протокол',
          goals: ['Освоить SQL (PostgreSQL)', 'Спроектировать схему базы данных', 'Создать REST API с авторизацией'],
          resources: ['PostgreSQL Tutorial (postgresqltutorial.com)', 'Документация Express.js / NestJS / FastAPI', 'Insomnia / Postman (инструменты)'],
          milestone: 'REST API с JWT-авторизацией и базой данных' },
        { title: 'Архитектура и DevOps-основы', duration: '2 месяца', focus: 'Docker, CI/CD, паттерны проектирования',
          goals: ['Контейнеризировать приложение в Docker', 'Настроить базовый CI/CD (GitHub Actions)', 'Применить паттерны Repository и Service'],
          resources: ['Docker docs (docs.docker.com)', 'GitHub Actions документация', 'Книга «Clean Architecture» Мартина'],
          milestone: 'Задеплоить API на сервер с автодеплоем' },
        { title: 'Портфолио и рост', duration: '2–3 месяца', focus: 'Реальные проекты, оптимизация',
          goals: ['Разработать 2 полноценных API-сервиса', 'Изучить кэширование (Redis)', 'Подготовиться к System Design вопросам'],
          resources: ['Redis.io docs', 'System Design Primer (GitHub)', 'LeetCode (алгоритмы)'],
          milestone: 'Открытый pet-проект с 10+ звёздами на GitHub' },
      ],
      'data-scientist': [
        { title: 'Python и математика', duration: '2 месяца', focus: 'Python, линейная алгебра, статистика',
          goals: ['Уверенно работать с Python', 'Освоить NumPy и Pandas', 'Понять базовую статистику и вероятность'],
          resources: ['Python for Data Analysis (книга, Уэс МакКинни)', 'Khan Academy Statistics (бесплатно)', 'Kaggle Learn (интерактивно)'],
          milestone: 'Провести полный EDA-анализ реального датасета' },
        { title: 'Машинное обучение', duration: '3 месяца', focus: 'Scikit-learn, классические алгоритмы ML',
          goals: ['Освоить supervised/unsupervised learning', 'Применить кросс-валидацию и метрики', 'Участвовать в соревновании на Kaggle'],
          resources: ['Hands-On Machine Learning (Жерон, книга)', 'Scikit-learn documentation', 'Kaggle Competitions'],
          milestone: 'Топ-25% в Kaggle Titanic или аналогичном' },
        { title: 'Глубокое обучение', duration: '2–3 месяца', focus: 'PyTorch / TensorFlow, нейронные сети',
          goals: ['Понять архитектуры CNN, RNN, Transformer', 'Дообучить предобученную модель', 'Реализовать задачу классификации/регрессии'],
          resources: ['fast.ai (практичный курс)', 'Документация PyTorch', 'Papers With Code (актуальные исследования)'],
          milestone: 'Модель с метрикой выше baseline на реальной задаче' },
        { title: 'MLOps и портфолио', duration: '2 месяца', focus: 'Деплой моделей, воспроизводимость',
          goals: ['Задеплоить модель через FastAPI', 'Использовать MLflow для экспериментов', 'Оформить 2–3 проекта на GitHub'],
          resources: ['MLflow documentation', 'Made With ML (madewithml.com)', 'Towards Data Science (статьи)'],
          milestone: 'Демо-приложение с задеплоенной ML-моделью' },
      ],
    };

    // Generic template for careers without specific templates
    const genericPhases = (title: string): PhaseTemplate[] => [
      { title: 'Изучение основ', duration: '1–2 месяца', focus: `Фундаментальные знания для ${title}`,
        goals: ['Изучить ключевые концепции профессии', 'Пройти вводный онлайн-курс', 'Прочитать 1–2 книги по специальности'],
        resources: ['Coursera / Stepik (онлайн-курсы)', 'Хабр / Medium (статьи)', 'YouTube-каналы по специальности'],
        milestone: 'Сдать итоговый тест вводного курса' },
      { title: 'Практика и инструменты', duration: '2–3 месяца', focus: 'Рабочие инструменты и первые проекты',
        goals: ['Освоить 2–3 ключевых инструмента профессии', 'Выполнить 3–5 учебных проектов', 'Получить обратную связь от ментора'],
        resources: ['GitHub (открытые проекты)', 'Stack Overflow (решение проблем)', 'Профессиональные сообщества в Telegram'],
        milestone: 'Собственный проект, демонстрирующий базовые навыки' },
      { title: 'Углублённое изучение', duration: '2–3 месяца', focus: 'Продвинутые темы и паттерны',
        goals: ['Изучить продвинутые концепции', 'Поучаствовать в open-source проекте', 'Пройти сложный курс или специализацию'],
        resources: ['Udemy / Pluralsight (продвинутые курсы)', 'Книги по архитектуре и паттернам', 'Конференции и вебинары'],
        milestone: 'Завершить сложный проект с применением продвинутых техник' },
      { title: 'Портфолио и карьера', duration: '2–3 месяца', focus: 'Трудоустройство и профессиональная сеть',
        goals: ['Оформить профессиональное резюме', 'Собрать портфолио из 3+ проектов', 'Пройти 5+ собеседований'],
        resources: ['LinkedIn (нетворкинг)', 'Хабр Карьера / HeadHunter (вакансии)', 'Pramp (практика интервью)'],
        milestone: 'Получить первый оффер по специальности' },
    ];

    const phases = templates[dto.careerId] ?? genericPhases(dto.careerTitle);

    // Personalize advice based on trait scores
    const traitEntries = Object.entries(dto.traitScores).sort(([, a], [, b]) => b - a);
    const topTrait = traitEntries[0]?.[0] ?? '';
    const weakTraitEntry = traitEntries.find(([, v]) => v < 5);

    const adviceByTrait: Record<string, string> = {
      logical: 'Твоё логическое мышление — большое преимущество. Используй его при изучении алгоритмов и архитектурных паттернов.',
      analytical: 'Твои аналитические способности помогут быстро разобраться в новых технологиях. Применяй их при разборе чужого кода.',
      technical: 'Техническая склонность ускорит изучение инструментов. Не бойся углубляться в детали реализации.',
      creative: 'Твоё творческое мышление поможет в дизайне решений. Ищи нестандартные подходы к типовым задачам.',
      social: 'Коммуникабельность — ценный навык в IT. Активно участвуй в сообществах и Code Review.',
      managerial: 'Лидерские качества пригодятся с первого дня. Бери инициативу в командных проектах.',
      research: 'Самообучаемость — твой главный актив. IT меняется быстро, и ты к этому готов.',
      detail: 'Внимание к деталям сделает твой код надёжным. Особое внимание уделяй тестированию.',
      risk: 'Готовность к риску поможет пробовать новые технологии раньше других. Это ценится в стартапах.',
    };

    const advice = adviceByTrait[topTrait] ?? 'Развивай практические навыки ежедневно — регулярность важнее интенсивности.'
      + (weakTraitEntry ? ` Уделяй особое внимание развитию ${weakTraitEntry[0] === 'social' ? 'коммуникации' : 'технических навыков'}.` : '');

    return {
      phases,
      totalDuration: `${phases.length * 2}–${phases.length * 3} месяцев`,
      firstStep: `Зарегистрироваться на платформе ${phases[0]?.resources[0]?.split(' ')[0] ?? 'Coursera'} и пройти вводный модуль`,
      advice,
      source: 'local',
    };
  }
}
