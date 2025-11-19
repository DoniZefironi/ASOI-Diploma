// src/features/profile/components/ProfOrientationTestModal.tsx
import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { useSubmitProfessionalOrientation } from '@/shared/api/admin/professional-orientation';
import { Loader2 } from 'lucide-react';

// Компонент Dialog
const Dialog = ({ 
  open, 
  onOpenChange, 
  children 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4" 
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 border-b border-gray-700 pb-4">
    {children}
  </div>
);

const DialogTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold text-white ${className}`}>
    {children}
  </h3>
);

const DialogFooter = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex justify-end gap-2 pt-4 ${className}`}>
    {children}
  </div>
);

// Типы для результатов
interface TestResult {
  type: string;
  title: string;
  description: string;
  professions: string[];
  skills: string[];
}

// Расширенные вопросы для теста
const QUESTIONS = [
  {
    id: 1,
    text: "Какая деятельность вам больше нравится?",
    options: [
      { id: 'a', text: "Работа с числами, анализ данных, статистика", value: 'analytics' },
      { id: 'b', text: "Общение с людьми, помощь, обучение", value: 'social' },
      { id: 'c', text: "Работа с техникой, сборка, ремонт", value: 'technical' },
      { id: 'd', text: "Творчество, дизайн, искусство", value: 'creative' },
      { id: 'e', text: "Управление, организация, планирование", value: 'management' },
    ],
  },
  {
    id: 2,
    text: "Какую рабочую среду вы предпочитаете?",
    options: [
      { id: 'a', text: "Спокойный офис с чёткими задачами", value: 'office_analytics' },
      { id: 'b', text: "Динамичная команда с постоянным общением", value: 'team_social' },
      { id: 'c', text: "Производство, лаборатория или стройка", value: 'field_technical' },
      { id: 'd', text: "Свободная творческая студия", value: 'studio_creative' },
      { id: 'e', text: "Деловой офис с совещаниями", value: 'office_management' },
    ],
  },
  {
    id: 3,
    text: "Что для вас важнее в работе?",
    options: [
      { id: 'a', text: "Точность и логика", value: 'analytics' },
      { id: 'b', text: "Помощь другим и социальная значимость", value: 'social' },
      { id: 'c', text: "Практические результаты и решение задач", value: 'technical' },
      { id: 'd', text: "Самовыражение и креативность", value: 'creative' },
      { id: 'e', text: "Карьерный рост и ответственность", value: 'management' },
    ],
  },
  {
    id: 4,
    text: "Как вы обычно решаете проблемы?",
    options: [
      { id: 'a', text: "Анализирую данные и ищу закономерности", value: 'analytics' },
      { id: 'b', text: "Консультируюсь с коллегами и экспертами", value: 'social' },
      { id: 'c', text: "Экспериментирую и пробую разные подходы", value: 'technical' },
      { id: 'd', text: "Ищу нестандартные творческие решения", value: 'creative' },
      { id: 'e', text: "Составляю план и распределяю задачи", value: 'management' },
    ],
  },
  {
    id: 5,
    text: "Какие школьные предметы вам нравились больше всего?",
    options: [
      { id: 'a', text: "Математика, информатика, физика", value: 'analytics_technical' },
      { id: 'b', text: "Литература, история, языки", value: 'social_creative' },
      { id: 'c', text: "Химия, биология, география", value: 'technical_analytics' },
      { id: 'd', text: "ИЗО, музыка, труд", value: 'creative_technical' },
      { id: 'e', text: "Обществознание, экономика", value: 'management_social' },
    ],
  },
  {
    id: 6,
    text: "Как вы относитесь к рутине?",
    options: [
      { id: 'a', text: "Комфортно, когда есть чёткий порядок", value: 'analytics_management' },
      { id: 'b', text: "Предпочитаю разнообразие и новые знакомства", value: 'social_creative' },
      { id: 'c', text: "Готов к монотонной работе, если вижу результат", value: 'technical' },
      { id: 'd', text: "Плохо переношу рутину, нужна свобода", value: 'creative' },
      { id: 'e', text: "Организую рутину для других", value: 'management' },
    ],
  },
  {
    id: 7,
    text: "Что вас мотивирует в работе?",
    options: [
      { id: 'a', text: "Сложные интеллектуальные задачи", value: 'analytics' },
      { id: 'b', text: "Возможность помогать людям", value: 'social' },
      { id: 'c', text: "Создание чего-то tangible (осязаемого)", value: 'technical' },
      { id: 'd', text: "Возможность творческой реализации", value: 'creative' },
      { id: 'e', text: "Ответственность и лидерство", value: 'management' },
    ],
  },
  {
    id: 8,
    text: "Как вы учитесь новому?",
    options: [
      { id: 'a', text: "Читаю документацию и изучаю теорию", value: 'analytics' },
      { id: 'b', text: "Общаюсь с опытными людьми", value: 'social' },
      { id: 'c', text: "Пробую на практике сразу", value: 'technical' },
      { id: 'd', text: "Экспериментирую и ищу свой подход", value: 'creative' },
      { id: 'e', text: "Прохожу структурированные курсы", value: 'management' },
    ],
  },
  {
    id: 9,
    text: "Какой график работы вам подходит?",
    options: [
      { id: 'a', text: "Стабильный график с чёткими сроками", value: 'analytics_management' },
      { id: 'b', text: "Гибкий график с встречами и общением", value: 'social' },
      { id: 'c', text: "Сменный график или работа по проектам", value: 'technical' },
      { id: 'd', text: "Свободный график для творчества", value: 'creative' },
      { id: 'e', text: "Ненормированный, но с перспективой роста", value: 'management' },
    ],
  },
  {
    id: 10,
    text: "Что для вас значит успех в карьере?",
    options: [
      { id: 'a', text: "Экспертиза и признание в профессиональной среде", value: 'analytics' },
      { id: 'b', text: "Помощь людям и социальное признание", value: 'social' },
      { id: 'c', text: "Создание работающих систем и продуктов", value: 'technical' },
      { id: 'd', text: "Реализация творческих идей и проектов", value: 'creative' },
      { id: 'e', text: "Карьерный рост и управленческая позиция", value: 'management' },
    ],
  },
];

// Расширенные результаты теста с описаниями
const RESULTS: Record<string, TestResult> = {
  analytics: {
    type: 'analytics',
    title: "Аналитик / Data Scientist",
    description: "Вы обладаете аналитическим складом ума, любите работать с данными, находить закономерности и делать выводы на основе статистики. Вам подойдут профессии, связанные с анализом, исследованиями и работой с информацией.",
    professions: ["Data Analyst", "Бизнес-аналитик", "Финансовый аналитик", "Маркетолог-аналитик", "Исследователь"],
    skills: ["Аналитическое мышление", "Работа с данными", "Статистика", "Логика", "Внимание к деталям"]
  },
  social: {
    type: 'social',
    title: "Социальный работник / HR / Педагог",
    description: "Вы - человек-коммуникатор, вам нравится работать с людьми, помогать, обучать и поддерживать. Вы обладаете эмпатией и хорошо понимаете потребности других.",
    professions: ["HR-менеджер", "Психолог", "Социальный работник", "Учитель", "Менеджер по продажам", "Коуч"],
    skills: ["Коммуникабельность", "Эмпатия", "Умение слушать", "Решение конфликтов", "Обучение других"]
  },
  technical: {
    type: 'technical',
    title: "Инженер / Технический специалист",
    description: "Вы имеете технический склад ума, любите работать с оборудованием, механизмами или IT-системами. Вам нравится решать практические задачи и видеть конкретные результаты своей работы.",
    professions: ["Инженер", "Программист", "Системный администратор", "Техник", "Архитектор", "Биотехнолог"],
    skills: ["Техническое мышление", "Решение проблем", "Внимание к деталям", "Практические навыки", "Логика"]
  },
  creative: {
    type: 'creative',
    title: "Креативный специалист / Дизайнер",
    description: "Вы - творческая личность, обладаете развитым воображением и нестандартным мышлением. Вам важно самовыражение и создание чего-то нового и уникального.",
    professions: ["Дизайнер", "Художник", "Копирайтер", "Арт-директор", "Фотограф", "Видео-мейкер", "Маркетолог"],
    skills: ["Креативность", "Визуальное мышление", "Нестандартный подход", "Художественный вкус", "Адаптивность"]
  },
  management: {
    type: 'management',
    title: "Менеджер / Руководитель",
    description: "Вы обладаете лидерскими качествами, умеете организовывать процессы и управлять людьми. Вам нравится брать на себя ответственность и достигать поставленных целей через команду.",
    professions: ["Project Manager", "Team Lead", "Директор", "Предприниматель", "Product Manager", "Организатор"],
    skills: ["Лидерство", "Стратегическое мышление", "Организация", "Принятие решений", "Делегирование"]
  },
  mixed: {
    type: 'mixed',
    title: "Универсальный специалист",
    description: "Вы обладаете разнообразными навыками и интересами, что позволяет вам успешно работать в междисциплинарных областях. Вы легко адаптируетесь и можете совмещать разные виды деятельности.",
    professions: ["Product Manager", "Бизнес-консультант", "Предприниматель", "Маркетолог", "Аналитик-исследователь"],
    skills: ["Адаптивность", "Мультизадачность", "Широкий кругозор", "Быстрое обучение", "Гибкость"]
  }
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfOrientationTestModal = ({ isOpen, onClose }: Props) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const { submit, isSubmitting } = useSubmitProfessionalOrientation();

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  const calculateResult = (answers: Record<number, string>): TestResult => {
    const counts: Record<string, number> = {};
    
    // Подсчитываем баллы для каждого типа
    Object.values(answers).forEach(value => {
      const types = value.split('_');
      types.forEach(type => {
        counts[type] = (counts[type] || 0) + 1;
      });
    });

    // Находим тип с максимальным количеством баллов
    const maxScore = Math.max(...Object.values(counts));
    const mainTypes = Object.keys(counts).filter(type => counts[type] === maxScore);

    if (mainTypes.length === 1) {
      return RESULTS[mainTypes[0]];
    } else {
      // Если несколько типов с одинаковым количеством баллов
      return RESULTS.mixed;
    }
  };

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Все вопросы пройдены - вычисляем результат
      const result = calculateResult(newAnswers);
      setTestResult(result);

      // Отправляем только recommendedProfession, так как хук ожидает только это поле
      submit({ recommendedProfession: result.title });
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTestResult(null);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (testResult) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-green-400 text-xl">Тест завершён!</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Основной результат */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">{testResult.title}</h3>
              <p className="text-gray-300 text-lg">{testResult.description}</p>
            </div>

            {/* Подходящие профессии */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3">Подходящие профессии:</h4>
              <div className="flex flex-wrap gap-2">
                {testResult.professions.map((profession, index) => (
                  <span 
                    key={index}
                    className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {profession}
                  </span>
                ))}
              </div>
            </div>

            {/* Ключевые навыки */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3">Ваши сильные стороны:</h4>
              <div className="flex flex-wrap gap-2">
                {testResult.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-green-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Прогресс прохождения */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">Статистика теста:</h4>
              <div className="text-gray-300 space-y-1">
                <p>Пройдено вопросов: {QUESTIONS.length} из {QUESTIONS.length}</p>
                <p>Тип личности: {testResult.title.split(' / ')[0]}</p>
                <p>Рекомендуемая сфера: {testResult.title.split(' / ')[1]}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={handleRestart}
              className="border-gray-600 text-gray-200 hover:bg-gray-800"
            >
              Пройти заново
            </Button>
            <Button 
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Сохранить и закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (isSubmitting) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Анализируем ваш результат...</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
            <p className="text-gray-400 text-center">
              Сохраняем ваши результаты и подбираем лучшие рекомендации...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Тест профессиональной ориентации</DialogTitle>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-400">
              Вопрос {currentQuestionIndex + 1} из {QUESTIONS.length}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">
                {Math.round(((currentQuestionIndex + 1) / QUESTIONS.length) * 100)}%
              </span>
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="mb-6">
          <p className="text-white font-medium text-lg mb-6">{currentQuestion.text}</p>
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className="w-full justify-start text-left p-4 h-auto border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white hover:border-gray-500 transition-colors duration-200"
                onClick={() => handleAnswer(option.value)}
              >
                <span className="font-medium mr-3 text-blue-400">{option.id}.</span>
                <span className="flex-1">{option.text}</span>
              </Button>
            ))}
          </div>
        </div>

        <DialogFooter>
          <div className="flex justify-between w-full">
            <div>
              {currentQuestionIndex > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="border-gray-600 text-gray-200 hover:bg-gray-800"
                >
                  ← Назад
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleRestart}
                className="border-gray-600 text-gray-200 hover:bg-gray-800"
              >
                Начать заново
              </Button>
              <Button 
                variant="secondary" 
                onClick={onClose}
                className="bg-gray-700 text-gray-200 hover:bg-gray-600"
              >
                Выйти
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};