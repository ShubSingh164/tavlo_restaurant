'use client';

/**
 * Tavlo - Theme Store (Zustand)
 * 
 * Client-side theme state management with localStorage persistence.
 * Ensures dark/light mode persists across page navigation.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
    isDarkMode: boolean;
    toggleTheme: () => void;
    setDarkMode: (value: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            isDarkMode: false,

            toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

            setDarkMode: (value: boolean) => set({ isDarkMode: value }),
        }),
        {
            name: 'tavlo-theme',
        }
    )
);
