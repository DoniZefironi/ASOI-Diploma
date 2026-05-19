'use client';

import { useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'app-theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial: Theme = saved ?? 'dark';
    applyTheme(initial);
    setTheme(initial);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  return { theme, toggle };
}

function applyTheme(theme: Theme) {
  const html = document.documentElement;
  if (theme === 'light') {
    html.setAttribute('data-theme', 'light');
  } else {
    html.removeAttribute('data-theme');
  }
}

// Скрипт для предотвращения мигания при загрузке
export const themeInitScript = `
(function(){
  var t = localStorage.getItem('app-theme');
  if (t === 'light') document.documentElement.setAttribute('data-theme','light');
})();
`;
