'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ColorScheme = 'light' | 'dark';

interface ColorSchemeContextProperties {
  scheme: ColorScheme;
  setScheme: (scheme: ColorScheme) => void;
  toggleScheme: () => void;
}

const ColorSchemeContext = createContext<ColorSchemeContextProperties | undefined>(undefined);

export function ColorSchemeProvider({ children }: { children: ReactNode }) {
  const [scheme, setSchemeState] = useState<ColorScheme>('light');

  useEffect(() => {
    document.documentElement.dataset.theme = scheme;
    document.documentElement.classList.toggle('dark', scheme === 'dark');
  }, [scheme]);

  const setScheme = (s: ColorScheme) => {
    setSchemeState(s);
  };

  const toggleScheme = () => {
    setSchemeState(previous => (previous === 'light' ? 'dark' : 'light'));
  };

  return (
    <ColorSchemeContext.Provider value={{ scheme, setScheme, toggleScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

export function useColorScheme() {
  const context = useContext(ColorSchemeContext);
  if (!context) throw new Error('useColorScheme must be used within ColorSchemeProvider');
  return context;
}
