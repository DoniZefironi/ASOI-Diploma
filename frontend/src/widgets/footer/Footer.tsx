'use client';

export const Footer = () => {
  return (
    <footer className="bg-gh-canvas text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-center gap-12">
            <ul className="flex justify-center items-center gap-10">
              <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">О нас</a></li>
              <li><a href="/contacts" className="text-gray-400 hover:text-white transition-colors">Контакты</a></li>
              <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">Частые вопросы</a></li>
              <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Условия обслуживания</a></li>
              <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Политика конфиденциальности</a></li>
            </ul>
        </div>
      </div>
    </footer>
  );
};