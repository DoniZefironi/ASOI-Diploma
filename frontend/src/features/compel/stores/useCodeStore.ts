// stores/useCodeStore.ts
import { create } from 'zustand';

interface CodeStore {
  code: string;
  output: string;
  setCode: (code: string) => void;
  setOutput: (output: string) => void;
  reset: () => void;
}

export const useCodeStore = create<CodeStore>((set) => ({
  code: 'console.log("Hello, World!");',
  output: '',
  setCode: (code) => set({ code }),
  setOutput: (output) => set({ output }),
  reset: () => set({ code: '', output: '' }),
}));