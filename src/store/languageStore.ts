import { create } from 'zustand';

type Lang = 'pl' | 'en';

interface LanguageState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  lang: 'pl',
  setLang: (lang) => set({ lang }),
  toggleLang: () => set((state) => ({ lang: state.lang === 'pl' ? 'en' : 'pl' })),
}));
