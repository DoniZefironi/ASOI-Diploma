'use client';

export const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gh-canvas py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Политика конфиденциальности
          </h1>
          <p className="text-gray-600">Последнее обновление: 26 октября 2023 г.</p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 animate-fade-in-up">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gh-fg mb-4">1. Введение</h2>
            <p className="text-white leading-relaxed mb-4">
              В EduTech мы стремимся защищать вашу конфиденциальность. Эта Политика конфиденциальности объясняет, 
              как мы собираем, используем, раскрываем и защищаем вашу информацию при использовании нашей Платформы.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gh-fg mb-4">2. Информация, которую мы собираем</h2>
            <p className="text-white leading-relaxed mb-4">
              Мы собираем информацию, которую вы предоставляете нам напрямую, например, когда создаёте аккаунт, 
              записываетесь на курсы или связываетесь с нами. Это может включать:
            </p>
            <ul className="list-disc list-inside text-white space-y-2 ml-4">
              <li>Персональную информацию (имя, адрес электронной почты и т.д.)</li>
              <li>Учётные данные аккаунта</li>
              <li>Платёжную информацию</li>
              <li>Данные о прогрессе и успеваемости на курсах</li>
              <li>Предпочтения по коммуникациям</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gh-fg mb-4">3. Как мы используем вашу информацию</h2>
            <p className="text-white leading-relaxed mb-4">
              Мы используем вашу информацию для:
            </p>
            <ul className="list-disc list-inside text-white space-y-2 ml-4">
              <li>Предоставления и поддержки наших услуг</li>
              <li>Обработки ваших транзакций</li>
              <li>Персонализации вашего учебного опыта</li>
              <li>Коммуникации с вами об обновлениях и предложениях</li>
              <li>Улучшения нашей Платформы и услуг</li>
              <li>Обеспечения безопасности и предотвращения мошенничества</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gh-fg mb-4">4. Обмен данными и раскрытие информации</h2>
            <p className="text-white leading-relaxed mb-4">
              Мы можем делиться вашей информацией с:
            </p>
            <ul className="list-disc list-inside text-white space-y-2 ml-4">
              <li>Поставщиками услуг, которые помогают в нашей работе</li>
              <li>Преподавателями и педагогами для проведения курсов</li>
              <li>Правовыми органами, когда это требуется по закону</li>
              <li>Третьими сторонами с вашего согласия</li>
            </ul>
            <p className="text-white leading-relaxed mt-4">
              Мы не продаём вашу персональную информацию третьим сторонам.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gh-fg mb-4">5. Безопасность данных</h2>
            <p className="text-white leading-relaxed mb-4">
              Мы внедряем соответствующие меры безопасности для защиты вашей информации, включая 
              шифрование, контроль доступа и регулярные проверки безопасности. Однако ни один метод 
              передачи через Интернет не является на 100% безопасным.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gh-fg mb-4">6. Ваши права</h2>
            <p className="text-white leading-relaxed mb-4">
              Вы имеете право:
            </p>
            <ul className="list-disc list-inside text-white space-y-2 ml-4">
              <li>Получать доступ и обновлять свою персональную информацию</li>
              <li>Удалять свой аккаунт и связанные с ним данные</li>
              <li>Отказываться от маркетинговых коммуникаций</li>
              <li>Требовать переносимости данных</li>
              <li>Возражать против определённых видов обработки</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gh-fg mb-4">7. Файлы cookie и отслеживание</h2>
            <p className="text-white leading-relaxed mb-4">
              Мы используем файлы cookie и аналогичные технологии для улучшения вашего опыта, анализа использования 
              и предоставления персонализированного контента. Вы можете управлять файлами cookie через настройки браузера.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gh-fg mb-4">8. Конфиденциальность детей</h2>
            <p className="text-white leading-relaxed mb-4">
              Наша Платформа не предназначена для детей младше 13 лет. Мы сознательно не собираем 
              персональную информацию от детей младше 13 лет.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gh-fg mb-4">9. Изменения в этой политике</h2>
            <p className="text-white leading-relaxed mb-4">
              Мы можем время от времени обновлять эту Политику конфиденциальности. Мы уведомим вас о любых 
              значительных изменениях, разместив новую политику на нашей Платформе.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gh-fg mb-4">10. Свяжитесь с нами</h2>
            <p className="text-white leading-relaxed">
              Если у вас есть вопросы относительно этой Политики конфиденциальности, пожалуйста, свяжитесь с нами по адресу{' '}
              <a href="mailto:support@edutech.com" className="text-blue-600 hover:text-blue-700">
                support@edutech.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};