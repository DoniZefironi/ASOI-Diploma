// eslint.config.mjs
import next from 'eslint-config-next'
import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      'next/core-web-vitals', // Используем core-web-vitals, так как оно строже
      // ... другие расширения, если были
    ],
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y, // Убедитесь, что плагин импортирован
    },
    rules: {
      // Применяем стандартные правила Next.js (core-web-vitals включает recommended)
      // ...next.configs.recommended.rules, // Не нужно деструктурировать, т.к. уже в extends
      // Отключаем или ослабляем конкретные правила
      '@typescript-eslint/no-explicit-any': 'off', // Отключаем ошибку для 'any'
      '@typescript-eslint/no-unused-vars': 'warn', // Меняем на предупреждение вместо ошибки
      'react/no-unescaped-entities': 'off', // Отключаем ошибку для неправильных кавычек
      '@typescript-eslint/ban-ts-comment': 'off', // Отключаем ошибку для @ts-ignore
      'jsx-a11y/alt-text': 'off', // Отключаем ошибку для alt у img
      '@next/next/no-img-element': 'off', // Отключаем ошибку для использования <img> вместо <Image>
    },
  },
  pluginJs.configs.recommended,
  // Если у вас была строка ...next.configs.typescript, её можно убрать, так как 'next/core-web-vitals' уже включает типы
  // ...next.configs.typescript,
)