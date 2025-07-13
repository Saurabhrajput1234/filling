import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  isHydrated: boolean;
}

const initialState: ThemeState = {
  theme: 'light', // Always start with light to avoid hydration mismatch
  isHydrated: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.theme);
        const root = document.documentElement;
        if (state.theme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.theme);
        const root = document.documentElement;
        if (state.theme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    },
    setHydrated: (state) => {
      state.isHydrated = true;
    },
  },
});

export const { toggleTheme, setTheme, setHydrated } = themeSlice.actions;
export default themeSlice.reducer; 