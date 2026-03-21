import type { Question, CareerProfile, Rule } from './types';

// ─── Questions (40 total, 5-point Likert) ─────────────────────────────────────
// Measures BEHAVIORS and THINKING STYLES, not obvious interests.

export const QUESTIONS: Question[] = [
  // ── Stage 1: Как ты мыслишь (10 вопросов) ─────────────────────────────────
  {
    id: 1, stage: 1, stageLabel: 'Как ты мыслишь',
    text: 'Когда что-то ломается или работает не так — мне мало просто починить, я хочу понять, почему это произошло',
    traits: [{ key: 'logical', weight: 1.0 }, { key: 'research', weight: 1.0 }, { key: 'technical', weight: 0.5 }],
  },
  {
    id: 2, stage: 1, stageLabel: 'Как ты мыслишь',
    text: 'Я замечаю мелкие несоответствия — опечатки, несогласованность в интерфейсе, логические противоречия — раньше, чем их замечают другие',
    traits: [{ key: 'detail', weight: 2.0 }],
  },
  {
    id: 3, stage: 1, stageLabel: 'Как ты мыслишь',
    text: 'Когда мне показывают набор фактов или данных, я автоматически начинаю искать в них закономерности и скрытые связи',
    traits: [{ key: 'analytical', weight: 2.0 }, { key: 'logical', weight: 0.5 }],
  },
  {
    id: 4, stage: 1, stageLabel: 'Как ты мыслишь',
    text: 'Объяснять что-то сложное другому человеку и видеть, что он понял — это приносит мне настоящее удовольствие',
    traits: [{ key: 'social', weight: 2.0 }],
  },
  {
    id: 5, stage: 1, stageLabel: 'Как ты мыслишь',
    text: 'Мне нравится придумывать что-то с нуля — идею, концепцию, решение — не опираясь на готовые шаблоны',
    traits: [{ key: 'creative', weight: 1.5 }, { key: 'risk', weight: 0.5 }],
  },
  {
    id: 6, stage: 1, stageLabel: 'Как ты мыслишь',
    text: 'Я часто вижу общую картину раньше, чем все детали становятся ясны, и могу объяснить другим, куда мы движемся',
    traits: [{ key: 'managerial', weight: 1.5 }, { key: 'analytical', weight: 0.5 }],
  },
  {
    id: 7, stage: 1, stageLabel: 'Как ты мыслишь',
    text: 'Если есть инструкция — я скорее попробую без неё. Разобраться самостоятельно мне интереснее, чем читать документацию',
    traits: [{ key: 'research', weight: 1.5 }, { key: 'technical', weight: 0.5 }, { key: 'risk', weight: 0.5 }],
  },
  {
    id: 8, stage: 1, stageLabel: 'Как ты мыслишь',
    text: 'Мне трудно остановиться на «достаточно хорошо» — я хочу сделать правильно, даже если это займёт больше времени',
    traits: [{ key: 'detail', weight: 2.0 }],
  },
  {
    id: 9, stage: 1, stageLabel: 'Как ты мыслишь',
    text: 'Когда я принимаю важное решение, я составляю мысленный список за и против — мне важно взвесить всё перед действием',
    traits: [{ key: 'logical', weight: 0.5 }, { key: 'analytical', weight: 0.5 }, { key: 'detail', weight: 0.5 }],
  },
  {
    id: 10, stage: 1, stageLabel: 'Как ты мыслишь',
    text: 'Я легко нахожу слабые места в аргументах, системах или коде — то, что другие упускают',
    traits: [{ key: 'logical', weight: 1.0 }, { key: 'detail', weight: 1.0 }],
  },

  // ── Stage 2: Твои реакции (10 вопросов) ───────────────────────────────────
  {
    id: 11, stage: 2, stageLabel: 'Твои реакции',
    text: 'Получив задачу без чёткого описания, ты скорее начнёшь думать самостоятельно, чем сразу пойдёшь задавать уточняющие вопросы',
    traits: [{ key: 'research', weight: 1.0 }, { key: 'logical', weight: 0.5 }, { key: 'risk', weight: 0.5 }],
  },
  {
    id: 12, stage: 2, stageLabel: 'Твои реакции',
    text: 'Открывая незнакомое приложение, ты первым делом оцениваешь, насколько оно красиво и удобно — а не то, как оно устроено внутри',
    traits: [{ key: 'creative', weight: 1.5 }, { key: 'detail', weight: 0.5 }],
  },
  {
    id: 13, stage: 2, stageLabel: 'Твои реакции',
    text: 'Когда тебе показывают готовый результат работы, твой первый вопрос — «как это сделано?», а не «зачем это нужно?»',
    traits: [{ key: 'technical', weight: 1.5 }, { key: 'logical', weight: 0.5 }],
  },
  {
    id: 14, stage: 2, stageLabel: 'Твои реакции',
    text: 'Когда на тебя смотрит команда и ждёт решения — ты чувствуешь скорее подъём, чем давление',
    traits: [{ key: 'managerial', weight: 1.5 }, { key: 'risk', weight: 0.5 }],
  },
  {
    id: 15, stage: 2, stageLabel: 'Твои реакции',
    text: 'Тебе дают большой массив данных и просят «найти что-нибудь интересное». Для тебя это скорее увлекательная задача, чем нудная работа',
    traits: [{ key: 'analytical', weight: 2.0 }, { key: 'logical', weight: 0.5 }],
  },
  {
    id: 16, stage: 2, stageLabel: 'Твои реакции',
    text: 'Ты готов потратить несколько часов, чтобы автоматизировать задачу, которая занимает 10 минут в день. Это кажется тебе разумным вложением',
    traits: [{ key: 'logical', weight: 1.0 }, { key: 'technical', weight: 1.0 }],
  },
  {
    id: 17, stage: 2, stageLabel: 'Твои реакции',
    text: 'Узнав о какой-то уязвимости или сбое в системе, твоя первая реакция — понять, как именно это работает, а не просто сообщить',
    traits: [{ key: 'technical', weight: 1.0 }, { key: 'research', weight: 0.5 }, { key: 'logical', weight: 0.5 }],
  },
  {
    id: 18, stage: 2, stageLabel: 'Твои реакции',
    text: 'Когда ты видишь неэффективный процесс — тебе трудно молча работать по нему. Хочется предложить, как сделать лучше',
    traits: [{ key: 'analytical', weight: 1.0 }, { key: 'managerial', weight: 0.5 }, { key: 'logical', weight: 0.5 }],
  },
  {
    id: 19, stage: 2, stageLabel: 'Твои реакции',
    text: 'Когда система выдаёт неожиданный результат — меня интереснее понять «почему», чем «как быстро перезапустить»',
    traits: [{ key: 'research', weight: 1.0 }, { key: 'technical', weight: 0.5 }, { key: 'analytical', weight: 0.5 }],
  },
  {
    id: 20, stage: 2, stageLabel: 'Твои реакции',
    text: 'Мне нравится убеждать других людей в правильности решения через аргументы и конкретные данные',
    traits: [{ key: 'social', weight: 1.0 }, { key: 'analytical', weight: 0.5 }, { key: 'managerial', weight: 0.5 }],
  },

  // ── Stage 3: Как ты работаешь (10 вопросов) ───────────────────────────────
  {
    id: 21, stage: 3, stageLabel: 'Как ты работаешь',
    text: 'Мне комфортнее, когда я сам выбираю подход и инструменты — даже если это означает больше неопределённости',
    traits: [{ key: 'creative', weight: 1.0 }, { key: 'risk', weight: 1.0 }],
  },
  {
    id: 22, stage: 3, stageLabel: 'Как ты работаешь',
    text: 'Мне важно, чтобы мои выводы можно было подтвердить данными — интуиция без цифр меня не убеждает',
    traits: [{ key: 'analytical', weight: 1.5 }, { key: 'logical', weight: 0.5 }],
  },
  {
    id: 23, stage: 3, stageLabel: 'Как ты работаешь',
    text: 'Для меня важно видеть, как моя работа влияет на реальных людей — что кому-то стало легче или лучше',
    traits: [{ key: 'social', weight: 1.0 }, { key: 'creative', weight: 0.5 }, { key: 'managerial', weight: 0.5 }],
  },
  {
    id: 24, stage: 3, stageLabel: 'Как ты работаешь',
    text: 'Когда в проекте что-то идёт не по плану — я скорее начну искать решение сам, чем буду ждать, пока кто-то скажет, что делать',
    traits: [{ key: 'managerial', weight: 1.5 }, { key: 'risk', weight: 0.5 }, { key: 'research', weight: 0.5 }],
  },
  {
    id: 25, stage: 3, stageLabel: 'Как ты работаешь',
    text: 'Мне проще начать делать и корректировать по ходу, чем долго планировать всё до мелочей перед стартом',
    traits: [{ key: 'risk', weight: 1.5 }, { key: 'managerial', weight: 0.5 }],
  },
  {
    id: 26, stage: 3, stageLabel: 'Как ты работаешь',
    text: 'Когда работа готова — я ещё раз проверяю перед сдачей, даже если дедлайн уже горит',
    traits: [{ key: 'detail', weight: 2.0 }],
  },
  {
    id: 27, stage: 3, stageLabel: 'Как ты работаешь',
    text: 'Я обычно сначала понимаю «зачем», а потом разбираюсь «как» — это помогает мне принимать более точные решения',
    traits: [{ key: 'logical', weight: 1.0 }, { key: 'analytical', weight: 0.5 }, { key: 'managerial', weight: 0.5 }],
  },
  {
    id: 28, stage: 3, stageLabel: 'Как ты работаешь',
    text: 'Когда я несу ответственность за проект в целом, а не только за свой участок — это меня скорее мобилизует, чем пугает',
    traits: [{ key: 'managerial', weight: 1.5 }, { key: 'risk', weight: 0.5 }],
  },
  {
    id: 29, stage: 3, stageLabel: 'Как ты работаешь',
    text: 'При решении сложных задач я предпочитаю методичный, поэтапный подход, а не интуитивные прыжки',
    traits: [{ key: 'logical', weight: 1.0 }, { key: 'detail', weight: 1.0 }],
  },
  {
    id: 30, stage: 3, stageLabel: 'Как ты работаешь',
    text: 'Мне легко удерживать в голове несколько связанных задач одновременно, не теряя общей нити',
    traits: [{ key: 'logical', weight: 1.5 }, { key: 'managerial', weight: 0.5 }],
  },

  // ── Stage 4: Честно о себе (10 вопросов) ──────────────────────────────────
  {
    id: 31, stage: 4, stageLabel: 'Честно о себе',
    text: 'Математика и задачи на логику всегда давались мне легче, чем большинству людей вокруг меня',
    traits: [{ key: 'logical', weight: 2.0 }],
  },
  {
    id: 32, stage: 4, stageLabel: 'Честно о себе',
    text: 'Я могу взять незнакомый технический инструмент — язык, библиотеку, устройство — и разобраться самостоятельно за несколько часов',
    traits: [{ key: 'technical', weight: 1.5 }, { key: 'research', weight: 0.5 }],
  },
  {
    id: 33, stage: 4, stageLabel: 'Честно о себе',
    text: 'Когда нужно придумать визуальное решение — интерфейс, плакат, оформление — у меня это получается естественно',
    traits: [{ key: 'creative', weight: 2.0 }],
  },
  {
    id: 34, stage: 4, stageLabel: 'Честно о себе',
    text: 'Мне легко считывать настроение другого человека и подобрать нужные слова — даже если разговор непростой',
    traits: [{ key: 'social', weight: 2.0 }],
  },
  {
    id: 35, stage: 4, stageLabel: 'Честно о себе',
    text: 'Когда я делаю что-то важное — я всегда думаю о крайних случаях: «а что если пользователь сделает вот так?»',
    traits: [{ key: 'detail', weight: 1.5 }, { key: 'technical', weight: 0.5 }],
  },
  {
    id: 36, stage: 4, stageLabel: 'Честно о себе',
    text: 'В группе именно я чаще всего распределяю задачи, слежу за дедлайнами и держу команду в курсе',
    traits: [{ key: 'managerial', weight: 2.0 }],
  },
  {
    id: 37, stage: 4, stageLabel: 'Честно о себе',
    text: 'Мне легко учиться самостоятельно — по документации, статьям, видео. Я быстро вычленяю главное без объяснений',
    traits: [{ key: 'research', weight: 2.0 }],
  },
  {
    id: 38, stage: 4, stageLabel: 'Честно о себе',
    text: 'Я способен самостоятельно освоить новую область за несколько недель — через эксперименты и практику',
    traits: [{ key: 'research', weight: 2.0 }],
  },
  {
    id: 39, stage: 4, stageLabel: 'Честно о себе',
    text: 'Мне комфортно делать выводы на основе неполных данных, когда общая картина достаточно ясна',
    traits: [{ key: 'analytical', weight: 1.0 }, { key: 'risk', weight: 1.0 }],
  },
  {
    id: 40, stage: 4, stageLabel: 'Честно о себе',
    text: 'Мне нравится работать с абстракциями — архитектурами, схемами, концепциями — а не только с конкретными деталями',
    traits: [{ key: 'logical', weight: 1.0 }, { key: 'analytical', weight: 0.5 }, { key: 'managerial', weight: 0.5 }],
  },
];

// ─── Production Rules (IF conditions THEN career, CF) ─────────────────────────
// CF (certainty factor): 0.0 – 1.0
// Combined using MYCIN formula: CF_new = CF_old + CF_rule * (1 – CF_old)

export const RULES: Rule[] = [
  // ── Backend Developer ──────────────────────────────────────────────────────
  { id: 'BE-1', career: 'backend-dev', cf: 0.82,
    description: 'Сильное логическое мышление + техническая склонность + внимание к деталям — базовый профиль бэкенд-разработчика',
    conditions: [{ trait: 'logical', op: '>=', value: 7 }, { trait: 'technical', op: '>=', value: 6 }, { trait: 'detail', op: '>=', value: 5 }] },
  { id: 'BE-2', career: 'backend-dev', cf: 0.65,
    description: 'Хорошая логика + техническая склонность выше среднего',
    conditions: [{ trait: 'logical', op: '>=', value: 6 }, { trait: 'technical', op: '>=', value: 6 }] },
  { id: 'BE-3', career: 'backend-dev', cf: 0.60,
    description: 'Аналитическое мышление + логика позволяют работать с алгоритмами и данными',
    conditions: [{ trait: 'logical', op: '>=', value: 7 }, { trait: 'analytical', op: '>=', value: 6 }, { trait: 'technical', op: '>=', value: 4 }] },
  { id: 'BE-4', career: 'backend-dev', cf: 0.55,
    description: 'Высокая самообучаемость компенсирует меньший технический старт',
    conditions: [{ trait: 'logical', op: '>=', value: 6 }, { trait: 'research', op: '>=', value: 7 }, { trait: 'technical', op: '>=', value: 4 }] },

  // ── Frontend Developer ─────────────────────────────────────────────────────
  { id: 'FE-1', career: 'frontend-dev', cf: 0.82,
    description: 'Развитое творческое мышление + техническая база + точность — классический фронтенд профиль',
    conditions: [{ trait: 'creative', op: '>=', value: 7 }, { trait: 'technical', op: '>=', value: 5 }, { trait: 'detail', op: '>=', value: 6 }] },
  { id: 'FE-2', career: 'frontend-dev', cf: 0.65,
    description: 'Баланс между дизайнерским видением и способностью писать код',
    conditions: [{ trait: 'creative', op: '>=', value: 6 }, { trait: 'technical', op: '>=', value: 6 }] },
  { id: 'FE-3', career: 'frontend-dev', cf: 0.60,
    description: 'Ориентация на пользователя и эстетика — product-focused фронтенд',
    conditions: [{ trait: 'creative', op: '>=', value: 7 }, { trait: 'social', op: '>=', value: 5 }, { trait: 'detail', op: '>=', value: 5 }] },

  // ── Fullstack Developer ────────────────────────────────────────────────────
  { id: 'FS-1', career: 'fullstack-dev', cf: 0.75,
    description: 'Техническая склонность + логика + элемент творчества — профиль универсального разработчика',
    conditions: [{ trait: 'technical', op: '>=', value: 6 }, { trait: 'logical', op: '>=', value: 6 }, { trait: 'creative', op: '>=', value: 5 }] },
  { id: 'FS-2', career: 'fullstack-dev', cf: 0.65,
    description: 'Сильная техническая база с достаточными творческими способностями и вниманием к деталям',
    conditions: [{ trait: 'technical', op: '>=', value: 7 }, { trait: 'creative', op: '>=', value: 4 }, { trait: 'detail', op: '>=', value: 5 }] },
  { id: 'FS-3', career: 'fullstack-dev', cf: 0.55,
    description: 'Высокая самообучаемость + готовность к риску позволяют покрывать разные области',
    conditions: [{ trait: 'technical', op: '>=', value: 5 }, { trait: 'research', op: '>=', value: 7 }, { trait: 'risk', op: '>=', value: 5 }] },

  // ── Data Scientist / ML ────────────────────────────────────────────────────
  { id: 'DS-1', career: 'data-scientist', cf: 0.88,
    description: 'Очень сильная аналитика + логическое мышление — ядро профессии Data Scientist',
    conditions: [{ trait: 'logical', op: '>=', value: 7 }, { trait: 'analytical', op: '>=', value: 8 }] },
  { id: 'DS-2', career: 'data-scientist', cf: 0.72,
    description: 'Аналитическое мышление + исследовательский склад — готовность к глубокому Machine Learning',
    conditions: [{ trait: 'analytical', op: '>=', value: 7 }, { trait: 'research', op: '>=', value: 7 }] },
  { id: 'DS-3', career: 'data-scientist', cf: 0.65,
    description: 'Логика + аналитика + технический фундамент — полный стек Data Science',
    conditions: [{ trait: 'logical', op: '>=', value: 6 }, { trait: 'analytical', op: '>=', value: 6 }, { trait: 'technical', op: '>=', value: 5 }] },
  { id: 'DS-4', career: 'data-scientist', cf: 0.55,
    description: 'Аналитическая точность + внимание к деталям — статистический анализ и валидация',
    conditions: [{ trait: 'analytical', op: '>=', value: 7 }, { trait: 'detail', op: '>=', value: 6 }, { trait: 'logical', op: '>=', value: 5 }] },

  // ── DevOps / Cloud ─────────────────────────────────────────────────────────
  { id: 'DO-1', career: 'devops', cf: 0.82,
    description: 'Очень высокая техническая склонность + внимание к деталям — инфраструктурный профиль',
    conditions: [{ trait: 'technical', op: '>=', value: 8 }, { trait: 'detail', op: '>=', value: 6 }] },
  { id: 'DO-2', career: 'devops', cf: 0.70,
    description: 'Сильная техника + самообучаемость — желание разбираться в сложных системах',
    conditions: [{ trait: 'technical', op: '>=', value: 7 }, { trait: 'logical', op: '>=', value: 6 }, { trait: 'research', op: '>=', value: 5 }] },
  { id: 'DO-3', career: 'devops', cf: 0.60,
    description: 'Стремление к точности в технических системах + аналитический подход',
    conditions: [{ trait: 'technical', op: '>=', value: 6 }, { trait: 'detail', op: '>=', value: 7 }, { trait: 'analytical', op: '>=', value: 5 }] },

  // ── Cybersecurity ──────────────────────────────────────────────────────────
  { id: 'CY-1', career: 'cybersecurity', cf: 0.82,
    description: 'Технический интерес + перфекционизм + исследовательский склад — профиль специалиста по безопасности',
    conditions: [{ trait: 'technical', op: '>=', value: 6 }, { trait: 'detail', op: '>=', value: 7 }, { trait: 'research', op: '>=', value: 6 }] },
  { id: 'CY-2', career: 'cybersecurity', cf: 0.65,
    description: 'Сильная техническая база + высокая логика — анализ систем на уязвимости',
    conditions: [{ trait: 'technical', op: '>=', value: 7 }, { trait: 'logical', op: '>=', value: 7 }] },
  { id: 'CY-3', career: 'cybersecurity', cf: 0.60,
    description: 'Стремление к точности + аналитика + техника — работа с инцидентами',
    conditions: [{ trait: 'detail', op: '>=', value: 8 }, { trait: 'analytical', op: '>=', value: 6 }, { trait: 'technical', op: '>=', value: 5 }] },

  // ── UX/UI Designer ─────────────────────────────────────────────────────────
  { id: 'UX-1', career: 'ux-ui', cf: 0.88,
    description: 'Очень развитое творческое мышление + внимание к деталям — классический UX/UI профиль',
    conditions: [{ trait: 'creative', op: '>=', value: 8 }, { trait: 'detail', op: '>=', value: 6 }] },
  { id: 'UX-2', career: 'ux-ui', cf: 0.72,
    description: 'Творческий + социальный профиль — UX-исследования и дизайн ориентированный на пользователя',
    conditions: [{ trait: 'creative', op: '>=', value: 7 }, { trait: 'social', op: '>=', value: 6 }] },
  { id: 'UX-3', career: 'ux-ui', cf: 0.70,
    description: 'Творчество + перфекционизм — дизайн-системы и pixel-perfect интерфейсы',
    conditions: [{ trait: 'creative', op: '>=', value: 7 }, { trait: 'detail', op: '>=', value: 7 }] },
  { id: 'UX-4', career: 'ux-ui', cf: 0.55,
    description: 'Умеренное творчество + социальное мышление + аналитика — UX-исследования',
    conditions: [{ trait: 'creative', op: '>=', value: 6 }, { trait: 'social', op: '>=', value: 6 }, { trait: 'analytical', op: '>=', value: 5 }] },

  // ── Product Manager ────────────────────────────────────────────────────────
  { id: 'PM-1', career: 'product-manager', cf: 0.82,
    description: 'Сильная коммуникация + лидерство + аналитика — product manager',
    conditions: [{ trait: 'social', op: '>=', value: 7 }, { trait: 'managerial', op: '>=', value: 7 }, { trait: 'analytical', op: '>=', value: 5 }] },
  { id: 'PM-2', career: 'product-manager', cf: 0.65,
    description: 'Лидерство + коммуникация + готовность принимать решения в условиях неопределённости',
    conditions: [{ trait: 'managerial', op: '>=', value: 7 }, { trait: 'social', op: '>=', value: 6 }, { trait: 'risk', op: '>=', value: 5 }] },
  { id: 'PM-3', career: 'product-manager', cf: 0.60,
    description: 'Очень высокая коммуникабельность + аналитический склад — customer-centric подход',
    conditions: [{ trait: 'social', op: '>=', value: 8 }, { trait: 'analytical', op: '>=', value: 6 }] },

  // ── Project Manager ────────────────────────────────────────────────────────
  { id: 'PJ-1', career: 'project-manager', cf: 0.82,
    description: 'Очень высокое лидерство + хорошая коммуникация — управление проектами',
    conditions: [{ trait: 'managerial', op: '>=', value: 8 }, { trait: 'social', op: '>=', value: 6 }] },
  { id: 'PJ-2', career: 'project-manager', cf: 0.70,
    description: 'Организационные способности + внимание к деталям + коммуникация — процессный подход',
    conditions: [{ trait: 'managerial', op: '>=', value: 7 }, { trait: 'detail', op: '>=', value: 6 }, { trait: 'social', op: '>=', value: 5 }] },
  { id: 'PJ-3', career: 'project-manager', cf: 0.55,
    description: 'Лидерство + аналитика — управление на основе данных',
    conditions: [{ trait: 'managerial', op: '>=', value: 6 }, { trait: 'analytical', op: '>=', value: 6 }, { trait: 'social', op: '>=', value: 5 }] },

  // ── IoT / Embedded Engineer ────────────────────────────────────────────────
  { id: 'IO-1', career: 'iot-engineer', cf: 0.82,
    description: 'Очень высокая техническая склонность + логика — embedded системы и IoT',
    conditions: [{ trait: 'technical', op: '>=', value: 8 }, { trait: 'logical', op: '>=', value: 6 }] },
  { id: 'IO-2', career: 'iot-engineer', cf: 0.68,
    description: 'Сильный технический интерес + самообучаемость + точность — работа с устройствами',
    conditions: [{ trait: 'technical', op: '>=', value: 7 }, { trait: 'research', op: '>=', value: 6 }, { trait: 'detail', op: '>=', value: 5 }] },
  { id: 'IO-3', career: 'iot-engineer', cf: 0.60,
    description: 'Техника + аналитика + логика — системная интеграция и отладка устройств',
    conditions: [{ trait: 'technical', op: '>=', value: 6 }, { trait: 'analytical', op: '>=', value: 6 }, { trait: 'logical', op: '>=', value: 5 }] },

  // ── QA Engineer ───────────────────────────────────────────────────────────
  { id: 'QA-1', career: 'qa-engineer', cf: 0.85,
    description: 'Очень высокое внимание к деталям + логика — тестирование программного обеспечения',
    conditions: [{ trait: 'detail', op: '>=', value: 8 }, { trait: 'logical', op: '>=', value: 6 }] },
  { id: 'QA-2', career: 'qa-engineer', cf: 0.70,
    description: 'Перфекционизм + аналитика — умение находить нетривиальные баги и граничные случаи',
    conditions: [{ trait: 'detail', op: '>=', value: 7 }, { trait: 'analytical', op: '>=', value: 6 }] },
  { id: 'QA-3', career: 'qa-engineer', cf: 0.62,
    description: 'Внимание к деталям + техническая база — автоматизация тестирования',
    conditions: [{ trait: 'detail', op: '>=', value: 7 }, { trait: 'technical', op: '>=', value: 5 }] },

  // ── Business Analyst ───────────────────────────────────────────────────────
  { id: 'BA-1', career: 'business-analyst', cf: 0.82,
    description: 'Аналитика + коммуникация + логика — системный и бизнес-аналитик',
    conditions: [{ trait: 'analytical', op: '>=', value: 7 }, { trait: 'social', op: '>=', value: 6 }, { trait: 'logical', op: '>=', value: 5 }] },
  { id: 'BA-2', career: 'business-analyst', cf: 0.65,
    description: 'Умение работать с людьми + аналитический склад — сбор требований и интервьюирование',
    conditions: [{ trait: 'social', op: '>=', value: 7 }, { trait: 'analytical', op: '>=', value: 6 }] },
  { id: 'BA-3', career: 'business-analyst', cf: 0.58,
    description: 'Лидерские задатки + аналитика + коммуникация — связь между бизнесом и IT',
    conditions: [{ trait: 'managerial', op: '>=', value: 5 }, { trait: 'analytical', op: '>=', value: 6 }, { trait: 'social', op: '>=', value: 5 }] },
];

// ─── Career Profiles ──────────────────────────────────────────────────────────
export const CAREER_PROFILES: CareerProfile[] = [
  {
    id: 'backend-dev', title: 'Backend-разработчик', icon: '⚙️',
    description: 'Создаёт серверную логику, API и работает с базами данных',
    longDescription: 'Backend-разработчики строят «мозг» приложений: серверы, API, базы данных, бизнес-логику. Ты будешь создавать системы, которые обрабатывают миллионы запросов и хранят данные надёжно и быстро.',
    salaryRange: '90 000 – 350 000 ₽', demand: 'high',
    skills: ['Алгоритмы и структуры данных', 'Проектирование баз данных', 'REST / gRPC API', 'Архитектура ПО', 'Тестирование'],
    tools: ['Python / Java / Go / Node.js', 'PostgreSQL / MongoDB', 'Docker / Kubernetes', 'Git', 'Redis'],
    growthPath: ['Junior Dev', 'Middle Dev', 'Senior Dev', 'Tech Lead', 'CTO'],
  },
  {
    id: 'frontend-dev', title: 'Frontend-разработчик', icon: '🖥️',
    description: 'Создаёт интерфейсы и визуальную часть веб-приложений',
    longDescription: 'Frontend-разработчик работает на стыке дизайна и кода. Ты будешь создавать то, что видит пользователь: красивые, быстрые и удобные интерфейсы.',
    salaryRange: '80 000 – 300 000 ₽', demand: 'high',
    skills: ['HTML / CSS', 'JavaScript / TypeScript', 'Компонентный подход', 'Работа с API', 'Производительность UI'],
    tools: ['React / Vue / Angular', 'TypeScript', 'Vite / Webpack', 'Figma', 'Git'],
    growthPath: ['Junior Frontend', 'Middle Frontend', 'Senior Frontend', 'Lead Frontend', 'Engineering Manager'],
  },
  {
    id: 'fullstack-dev', title: 'Fullstack-разработчик', icon: '🔧',
    description: 'Работает как с серверной, так и с клиентской частью',
    longDescription: 'Fullstack-разработчик — универсальный специалист. Ты можешь построить весь продукт самостоятельно: от базы данных до красивого интерфейса.',
    salaryRange: '100 000 – 380 000 ₽', demand: 'high',
    skills: ['Frontend + Backend', 'Базы данных', 'Деплой', 'Оптимизация', 'Архитектура'],
    tools: ['Node.js + React', 'PostgreSQL', 'Docker', 'TypeScript', 'Git'],
    growthPath: ['Junior Fullstack', 'Middle Fullstack', 'Senior Fullstack', 'Tech Lead', 'CTO'],
  },
  {
    id: 'data-scientist', title: 'Data Scientist / ML-инженер', icon: '🧠',
    description: 'Анализирует данные и строит модели машинного обучения',
    longDescription: 'Data Scientist превращает сырые данные в ценные инсайты и прогнозы. Ты будешь строить ML-модели, визуализировать тренды и помогать принимать решения на основе данных.',
    salaryRange: '120 000 – 450 000 ₽', demand: 'high',
    skills: ['Статистика и математика', 'Machine Learning', 'Анализ данных', 'Визуализация', 'SQL'],
    tools: ['Python (Pandas, sklearn)', 'Jupyter', 'TensorFlow / PyTorch', 'SQL', 'Tableau'],
    growthPath: ['Data Analyst', 'Data Scientist', 'Senior DS', 'ML Lead', 'Head of Data'],
  },
  {
    id: 'devops', title: 'DevOps / Cloud-инженер', icon: '☁️',
    description: 'Строит инфраструктуру, автоматизирует деплой и обеспечивает надёжность',
    longDescription: 'DevOps-инженер — связующее звено между разработкой и эксплуатацией. Ты будешь строить CI/CD пайплайны, управлять облаками и делать так, чтобы сервисы работали 24/7.',
    salaryRange: '100 000 – 400 000 ₽', demand: 'high',
    skills: ['Linux / Shell', 'Контейнеризация', 'CI/CD', 'Облачные платформы', 'Мониторинг'],
    tools: ['Docker / Kubernetes', 'Terraform', 'GitHub Actions', 'AWS / GCP / Azure', 'Prometheus'],
    growthPath: ['Junior DevOps', 'DevOps Engineer', 'Senior DevOps', 'Platform Lead', 'Head of Infrastructure'],
  },
  {
    id: 'cybersecurity', title: 'Специалист по кибербезопасности', icon: '🔐',
    description: 'Защищает системы от взломов, анализирует уязвимости',
    longDescription: 'Специалисты по кибербезопасности — хранители цифровых крепостей. Ты будешь искать уязвимости, проводить пентесты, строить защиту и расследовать инциденты.',
    salaryRange: '100 000 – 420 000 ₽', demand: 'high',
    skills: ['Сети и протоколы', 'Анализ уязвимостей', 'Пентестинг', 'Криптография', 'SIEM'],
    tools: ['Kali Linux', 'Wireshark', 'Metasploit', 'Burp Suite', 'SIEM-системы'],
    growthPath: ['Security Analyst', 'Pentester', 'Security Engineer', 'CISO', 'Head of Security'],
  },
  {
    id: 'ux-ui', title: 'UX/UI-дизайнер', icon: '🎨',
    description: 'Создаёт красивые и удобные интерфейсы, заботится об опыте пользователей',
    longDescription: 'UX/UI-дизайнер — мост между пользователем и продуктом. Ты будешь исследовать потребности людей, прототипировать и создавать визуально привлекательные интерфейсы.',
    salaryRange: '70 000 – 280 000 ₽', demand: 'high',
    skills: ['Прототипирование', 'UX-исследования', 'Дизайн-системы', 'Типографика', 'Accessibility'],
    tools: ['Figma', 'Adobe XD', 'Maze / Hotjar', 'Principle', 'Miro'],
    growthPath: ['Junior Designer', 'UX/UI Designer', 'Senior Designer', 'Lead Designer', 'Design Director'],
  },
  {
    id: 'product-manager', title: 'Product Manager', icon: '🎯',
    description: 'Управляет продуктом: от идеи до запуска и развития',
    longDescription: 'Product Manager — «CEO продукта». Ты будешь определять стратегию, приоритизировать задачи, работать с командами разработки и дизайна, исследовать рынок.',
    salaryRange: '100 000 – 400 000 ₽', demand: 'high',
    skills: ['Product Strategy', 'UX-исследования', 'Data-driven', 'Управление командой', 'Roadmap'],
    tools: ['Jira / Linear', 'Figma', 'Amplitude / Mixpanel', 'Notion', 'SQL'],
    growthPath: ['Junior PM', 'Product Manager', 'Senior PM', 'Group PM', 'CPO'],
  },
  {
    id: 'project-manager', title: 'Project Manager / Scrum Master', icon: '📋',
    description: 'Управляет проектами, координирует команды и следит за процессами',
    longDescription: 'Project Manager обеспечивает выполнение проектов в срок и в рамках бюджета. Ты будешь координировать команды, управлять рисками и выстраивать процессы.',
    salaryRange: '80 000 – 300 000 ₽', demand: 'medium',
    skills: ['Agile / Scrum', 'Управление рисками', 'Коммуникация', 'Планирование', 'Бюджетирование'],
    tools: ['Jira', 'Confluence', 'MS Project', 'Miro', 'Slack'],
    growthPath: ['Junior PM', 'Project Manager', 'Senior PM', 'Program Manager', 'PMO Director'],
  },
  {
    id: 'iot-engineer', title: 'IoT / Embedded-инженер', icon: '🤖',
    description: 'Разрабатывает умные устройства, прошивки для микроконтроллеров',
    longDescription: 'IoT-инженер создаёт устройства, которые «думают» и взаимодействуют с реальным миром. Датчики, роботы, умный дом — твоя область.',
    salaryRange: '80 000 – 320 000 ₽', demand: 'medium',
    skills: ['C / C++ для МК', 'Электроника', 'Протоколы IoT', 'Embedded Linux', 'Сенсоры'],
    tools: ['Arduino / ESP32', 'STM32', 'Raspberry Pi', 'MQTT', 'KiCad'],
    growthPath: ['Junior Embedded', 'Embedded Engineer', 'Senior Embedded', 'IoT Architect', 'CTO'],
  },
  {
    id: 'qa-engineer', title: 'QA-инженер', icon: '🔍',
    description: 'Обеспечивает качество ПО: тестирование, автоматизация',
    longDescription: 'QA-инженер — страж качества. Ты будешь находить баги раньше пользователей, писать тест-кейсы, автоматизировать проверки и делать продукты надёжнее.',
    salaryRange: '70 000 – 250 000 ₽', demand: 'medium',
    skills: ['Тест-дизайн', 'Автотестирование', 'Нагрузочное тестирование', 'API тесты', 'Баг-трекинг'],
    tools: ['Selenium / Playwright', 'Postman', 'JMeter', 'Jira', 'TestRail'],
    growthPath: ['Junior QA', 'QA Engineer', 'Senior QA', 'QA Lead', 'Head of QA'],
  },
  {
    id: 'business-analyst', title: 'Бизнес-аналитик / System Analyst', icon: '📊',
    description: 'Анализирует бизнес-процессы, собирает требования, связывает бизнес и IT',
    longDescription: 'Бизнес-аналитик — переводчик между миром бизнеса и IT. Ты будешь выявлять потребности, описывать требования к системам и помогать строить продукты, решающие реальные задачи.',
    salaryRange: '80 000 – 280 000 ₽', demand: 'medium',
    skills: ['Сбор требований', 'UML / BPMN', 'SQL', 'Интервьюирование', 'Написание ТЗ'],
    tools: ['Confluence', 'Jira', 'Draw.io', 'SQL', 'Miro'],
    growthPath: ['Junior BA', 'Business Analyst', 'Senior BA', 'Lead BA', 'Solution Architect'],
  },
];
