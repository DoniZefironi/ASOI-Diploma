// src/stores/useCodeStore.ts
import { create } from 'zustand';

interface CodeStore {
  code: string;
  output: string;
  language: string; 
  setCode: (code: string) => void;
  setOutput: (output: string) => void;
  setLanguage: (language: string) => void; 
  reset: () => void;
}

export const useCodeStore = create<CodeStore>((set) => ({
  code: 'console.log("Hello, World!");',
  output: '',
  language: 'js', 
  setCode: (code) => set({ code }),
  setOutput: (output) => set({ output }),
  setLanguage: (language) => set({ language }),
  reset: () => set({ code: '', output: '', language: 'js' }),
}));