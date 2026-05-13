import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VocabTerm } from './entities/vocab-term.entity';

const SEED_TERMS = [
  { term: 'Algorithm', transcription: '[ˈælɡərɪðəm]', translation: 'Алгоритм', category: 'Программирование', level: 'basic', definition: 'A step-by-step procedure for solving a problem.', example: 'The sorting algorithm runs in O(n log n) time.' },
  { term: 'Compiler', transcription: '[kəmˈpaɪlər]', translation: 'Компилятор', category: 'Программирование', level: 'basic', definition: 'A program that translates source code into machine code.', example: 'The compiler reported three syntax errors.' },
  { term: 'Debugging', transcription: '[diːˈbʌɡɪŋ]', translation: 'Отладка', category: 'Программирование', level: 'basic', definition: 'The process of finding and fixing errors in software.', example: 'She spent hours debugging the authentication module.' },
  { term: 'Refactoring', transcription: '[riːˈfæktərɪŋ]', translation: 'Рефакторинг', category: 'Программирование', level: 'intermediate', definition: 'Restructuring existing code without changing its behavior.', example: 'Refactoring improved code readability significantly.' },
  { term: 'Recursion', transcription: '[rɪˈkɜːʃən]', translation: 'Рекурсия', category: 'Программирование', level: 'intermediate', definition: 'A function that calls itself to solve a smaller problem.', example: 'Factorial is a classic example of recursion.' },
  { term: 'Abstraction', transcription: '[æbˈstrækʃən]', translation: 'Абстракция', category: 'Программирование', level: 'intermediate', definition: 'Hiding complexity by exposing only essential features.', example: 'The API provides abstraction over the database layer.' },
  { term: 'Polymorphism', transcription: '[ˌpɒlɪˈmɔːfɪzəm]', translation: 'Полиморфизм', category: 'Программирование', level: 'advanced', definition: 'Different objects responding to the same interface differently.', example: 'Polymorphism allows draw() to render different shapes.' },
  { term: 'Encapsulation', transcription: '[ɪnˌkæpsʊˈleɪʃən]', translation: 'Инкапсуляция', category: 'Программирование', level: 'advanced', definition: 'Bundling data and methods within a single unit.', example: 'Encapsulation protects internal state from external modification.' },
  { term: 'Dependency', transcription: '[dɪˈpendənsi]', translation: 'Зависимость', category: 'Программирование', level: 'basic', definition: 'A module that another module relies on.', example: 'Install all dependencies by running npm install.' },
  { term: 'Middleware', transcription: '[ˈmɪdəlweər]', translation: 'Промежуточное ПО', category: 'Программирование', level: 'intermediate', definition: 'Software that handles requests before they reach the main handler.', example: 'The auth middleware checks tokens on every request.' },
  { term: 'Interface', transcription: '[ˈɪntəfeɪs]', translation: 'Интерфейс', category: 'Программирование', level: 'basic', definition: 'A contract that defines what methods a class must implement.', example: 'The Serializable interface requires a serialize() method.' },
  { term: 'Inheritance', transcription: '[ɪnˈherɪtəns]', translation: 'Наследование', category: 'Программирование', level: 'intermediate', definition: 'A mechanism where a class acquires properties from another class.', example: 'Dog inherits from Animal and overrides the speak() method.' },
  { term: 'Runtime', transcription: '[ˈrʌntaɪm]', translation: 'Время выполнения', category: 'Программирование', level: 'basic', definition: 'The period when a program is executing.', example: 'A runtime error occurred when dividing by zero.' },
  { term: 'Thread', transcription: '[θred]', translation: 'Поток', category: 'Программирование', level: 'intermediate', definition: 'The smallest unit of execution that can run concurrently.', example: 'Use worker threads to avoid blocking the main thread.' },
  { term: 'Callback', transcription: '[ˈkɔːlbæk]', translation: 'Колбэк / Обратный вызов', category: 'Программирование', level: 'intermediate', definition: 'A function passed as argument to be called later.', example: 'Pass a callback to handle the async response.' },
  { term: 'Promise', transcription: '[ˈprɒmɪs]', translation: 'Промис', category: 'Программирование', level: 'intermediate', definition: 'An object representing a future asynchronous result.', example: 'The fetch() function returns a Promise.' },
  { term: 'Bandwidth', transcription: '[ˈbændwɪdθ]', translation: 'Пропускная способность', category: 'Сети', level: 'basic', definition: 'The maximum rate of data transfer across a network.', example: 'The server upgrade doubled our available bandwidth.' },
  { term: 'Latency', transcription: '[ˈleɪtənsi]', translation: 'Задержка', category: 'Сети', level: 'basic', definition: 'The time delay between sending and receiving data.', example: 'High latency causes lag in real-time applications.' },
  { term: 'Protocol', transcription: '[ˈprəʊtəkɒl]', translation: 'Протокол', category: 'Сети', level: 'basic', definition: 'A set of rules governing communication between devices.', example: 'HTTP is the protocol used for web communication.' },
  { term: 'Packet', transcription: '[ˈpækɪt]', translation: 'Пакет', category: 'Сети', level: 'basic', definition: 'A unit of data transmitted over a network.', example: 'Each packet contains a header with routing information.' },
  { term: 'Handshake', transcription: '[ˈhændʃeɪk]', translation: 'Квитирование', category: 'Сети', level: 'intermediate', definition: 'A process where two systems establish connection parameters.', example: 'TLS uses a three-way handshake for a secure session.' },
  { term: 'Gateway', transcription: '[ˈɡeɪtweɪ]', translation: 'Шлюз', category: 'Сети', level: 'basic', definition: 'A network node that connects two different networks.', example: 'The default gateway routes traffic to the internet.' },
  { term: 'Subnet', transcription: '[ˈsʌbnet]', translation: 'Подсеть', category: 'Сети', level: 'intermediate', definition: 'A logical subdivision of an IP network.', example: 'Devices on the same subnet communicate directly.' },
  { term: 'DNS', transcription: '[ˌdiːenˈes]', translation: 'Система доменных имён', category: 'Сети', level: 'basic', definition: 'Domain Name System — translates domain names to IP addresses.', example: 'DNS resolves example.com to 93.184.216.34.' },
  { term: 'Load balancer', transcription: '[ləʊd ˈbælənsər]', translation: 'Балансировщик нагрузки', category: 'Сети', level: 'intermediate', definition: 'Distributes incoming traffic across multiple servers.', example: 'The load balancer prevents any single server from overloading.' },
  { term: 'Firmware', transcription: '[ˈfɜːmweər]', translation: 'Прошивка', category: 'IoT / Железо', level: 'basic', definition: 'Low-level software permanently programmed into hardware.', example: 'Update the firmware to fix the connectivity bug.' },
  { term: 'Microcontroller', transcription: '[ˌmaɪkrəʊkənˈtrəʊlər]', translation: 'Микроконтроллер', category: 'IoT / Железо', level: 'basic', definition: 'A compact IC with a processor, memory, and I/O peripherals.', example: 'The ESP32 microcontroller includes built-in Wi-Fi.' },
  { term: 'GPIO', transcription: '[ˌdʒiːpiːaɪˈəʊ]', translation: 'Цифровой порт ввода/вывода', category: 'IoT / Железо', level: 'basic', definition: 'General Purpose Input/Output pins on a microcontroller.', example: 'Set GPIO pin 2 as output to control the LED.' },
  { term: 'Interrupt', transcription: '[ˈɪntərʌpt]', translation: 'Прерывание', category: 'IoT / Железо', level: 'intermediate', definition: 'A signal that pauses program execution to handle an event.', example: 'Configure an interrupt to trigger when button is pressed.' },
  { term: 'PWM', transcription: '[ˌpiːdʌbljuːˈem]', translation: 'Широтно-импульсная модуляция', category: 'IoT / Железо', level: 'intermediate', definition: 'Controlling power by varying the duty cycle of a signal.', example: 'Use PWM to control motor speed.' },
  { term: 'I2C', transcription: '[ˌaɪ tuː ˈsiː]', translation: 'Протокол I2C', category: 'IoT / Железо', level: 'intermediate', definition: 'Inter-Integrated Circuit — a two-wire serial communication protocol.', example: 'Connect the OLED display using I2C on SDA and SCL.' },
  { term: 'SPI', transcription: '[ˌespiːˈaɪ]', translation: 'Протокол SPI', category: 'IoT / Железо', level: 'intermediate', definition: 'Serial Peripheral Interface — a four-wire synchronous bus.', example: 'The SD card module communicates via SPI.' },
  { term: 'ADC', transcription: '[ˌeɪdiːˈsiː]', translation: 'АЦП', category: 'IoT / Железо', level: 'basic', definition: 'Analog-to-Digital Converter — converts analog signals to digital.', example: 'The ADC reads sensor voltage as a 12-bit integer.' },
  { term: 'Polling', transcription: '[ˈpəʊlɪŋ]', translation: 'Опрос', category: 'IoT / Железо', level: 'intermediate', definition: 'Repeatedly checking the status of a device.', example: 'Polling the sensor every 100 ms consumes unnecessary power.' },
  { term: 'Authentication', transcription: '[ɔːˌθentɪˈkeɪʃən]', translation: 'Аутентификация', category: 'Безопасность', level: 'basic', definition: 'Verifying the identity of a user or system.', example: 'Two-factor authentication adds an extra security layer.' },
  { term: 'Encryption', transcription: '[ɪnˈkrɪpʃən]', translation: 'Шифрование', category: 'Безопасность', level: 'basic', definition: 'Encoding data so only authorized parties can read it.', example: 'All passwords must be stored with encryption.' },
  { term: 'Vulnerability', transcription: '[ˌvʌlnərəˈbɪlɪti]', translation: 'Уязвимость', category: 'Безопасность', level: 'intermediate', definition: 'A weakness in a system that can be exploited by attackers.', example: 'The audit discovered a SQL injection vulnerability.' },
  { term: 'Token', transcription: '[ˈtəʊkən]', translation: 'Токен', category: 'Безопасность', level: 'basic', definition: 'A digital key used to verify identity or authorize access.', example: 'The JWT token expires after one hour.' },
  { term: 'Payload', transcription: '[ˈpeɪləʊd]', translation: 'Полезная нагрузка', category: 'Безопасность', level: 'intermediate', definition: 'The actual message content, or malicious code in attacks.', example: 'The malware payload activates 24 hours after infection.' },
  { term: 'Firewall', transcription: '[ˈfaɪəwɔːl]', translation: 'Брандмауэр', category: 'Безопасность', level: 'basic', definition: 'A system that monitors and controls network traffic.', example: 'The firewall blocked suspicious incoming connections.' },
  { term: 'Query', transcription: '[ˈkwɪəri]', translation: 'Запрос', category: 'Базы данных', level: 'basic', definition: 'A request for data from a database.', example: 'The SQL query returned 500 records in under a second.' },
  { term: 'Index', transcription: '[ˈɪndeks]', translation: 'Индекс', category: 'Базы данных', level: 'intermediate', definition: 'A data structure that improves the speed of data retrieval.', example: 'Adding an index on email sped up login queries.' },
  { term: 'Transaction', transcription: '[trænˈzækʃən]', translation: 'Транзакция', category: 'Базы данных', level: 'intermediate', definition: 'A sequence of operations that must fully succeed or fail.', example: 'The payment transaction rolled back due to insufficient funds.' },
  { term: 'Migration', transcription: '[maɪˈɡreɪʃən]', translation: 'Миграция', category: 'Базы данных', level: 'intermediate', definition: 'The process of moving or transforming database schema or data.', example: 'The migration added three new columns to the users table.' },
  { term: 'Schema', transcription: '[ˈskiːmə]', translation: 'Схема', category: 'Базы данных', level: 'basic', definition: 'The structure that defines the organization of data.', example: 'The schema was redesigned to support multi-tenancy.' },
  { term: 'Training', transcription: '[ˈtreɪnɪŋ]', translation: 'Обучение (модели)', category: 'ИИ / ML', level: 'basic', definition: 'Feeding data to a model so it can learn patterns.', example: 'Training on larger datasets improved accuracy.' },
  { term: 'Inference', transcription: '[ˈɪnfərəns]', translation: 'Вывод (предсказание)', category: 'ИИ / ML', level: 'intermediate', definition: 'Using a trained model to make predictions on new data.', example: 'Inference on edge devices requires optimized models.' },
  { term: 'Overfitting', transcription: '[ˌəʊvəˈfɪtɪŋ]', translation: 'Переобучение', category: 'ИИ / ML', level: 'intermediate', definition: 'When a model learns training data too well and cannot generalize.', example: 'Dropout layers help prevent overfitting.' },
  { term: 'Epoch', transcription: '[ˈiːpɒk]', translation: 'Эпоха', category: 'ИИ / ML', level: 'basic', definition: 'One complete pass through the entire training dataset.', example: 'After 50 epochs, the loss converged to 0.02.' },
  { term: 'Feature', transcription: '[ˈfiːtʃər]', translation: 'Признак', category: 'ИИ / ML', level: 'basic', definition: 'An individual measurable property used as input to a model.', example: 'Temperature and humidity are features for weather prediction.' },
  { term: 'Deploy', transcription: '[dɪˈplɔɪ]', translation: 'Развёртывать', category: 'Общее', level: 'basic', definition: 'To release software to a production environment.', example: 'We deploy to production every Friday afternoon.' },
  { term: 'Scalability', transcription: '[ˌskeɪləˈbɪlɪti]', translation: 'Масштабируемость', category: 'Общее', level: 'intermediate', definition: 'The ability of a system to handle increased load.', example: 'Microservices improve the scalability of large applications.' },
  { term: 'Bottleneck', transcription: '[ˈbɒtəlnek]', translation: 'Узкое место', category: 'Общее', level: 'basic', definition: 'A point in a system that limits overall performance.', example: 'The database was identified as the main bottleneck.' },
  { term: 'Legacy', transcription: '[ˈleɡəsi]', translation: 'Устаревший код', category: 'Общее', level: 'basic', definition: 'Outdated software or systems that are still in use.', example: 'The legacy codebase made adding new features difficult.' },
  { term: 'Deprecate', transcription: '[ˈdeprɪkeɪt]', translation: 'Объявлять устаревшим', category: 'Общее', level: 'intermediate', definition: 'To mark a feature as outdated and discourage its use.', example: 'This API endpoint will be deprecated in version 3.0.' },
  { term: 'Boilerplate', transcription: '[ˈbɔɪlərpleɪt]', translation: 'Шаблонный код', category: 'Общее', level: 'intermediate', definition: 'Repetitive code that appears in many places with little change.', example: 'The framework reduces boilerplate in API controllers.' },
  { term: 'Benchmark', transcription: '[ˈbentʃmɑːk]', translation: 'Тест производительности', category: 'Общее', level: 'basic', definition: 'A test used to measure the performance of a system.', example: 'Run the benchmark before and after the optimization.' },
  { term: 'Cache', transcription: '[kæʃ]', translation: 'Кэш', category: 'Общее', level: 'basic', definition: 'Temporary storage for frequently accessed data to speed up access.', example: 'Clear the browser cache to see the latest changes.' },
  { term: 'Repository', transcription: '[rɪˈpɒzɪtəri]', translation: 'Репозиторий', category: 'Общее', level: 'basic', definition: 'A storage location for code, managed by version control.', example: 'Clone the repository to get a local copy of the project.' },
  { term: 'API', transcription: '[ˌeɪpiːˈaɪ]', translation: 'Программный интерфейс', category: 'Общее', level: 'basic', definition: 'Application Programming Interface — a way for programs to communicate.', example: 'The mobile app calls the REST API to fetch data.' },
  { term: 'Endpoint', transcription: '[ˈendpɔɪnt]', translation: 'Конечная точка', category: 'Общее', level: 'basic', definition: 'A specific URL where an API can be accessed.', example: 'POST /users is the endpoint for creating a new user.' },
];

@Injectable()
export class VocabularySeeder implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(VocabTerm)
    private repo: Repository<VocabTerm>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.repo.count();
    if (count > 0) return;

    const terms = SEED_TERMS.map(t => this.repo.create(t));
    await this.repo.save(terms);
  }
}
