import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    try {
      // Get stored preference or system preference
      const stored = localStorage.getItem('travy-dark-mode');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const shouldBeDark = stored !== null ? stored === 'true' : systemPrefersDark;
      setIsDarkMode(shouldBeDark);
      setIsLoaded(true);
      
      // Apply to document
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error('Error initializing dark mode:', error);
      setIsLoaded(true);
    }
  }, []);

  const toggleDarkMode = () => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    try {
      const newValue = !isDarkMode;
      setIsDarkMode(newValue);
      localStorage.setItem('travy-dark-mode', newValue.toString());
      
      if (newValue) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error('Error toggling dark mode:', error);
    }
  };

  return { isDarkMode, toggleDarkMode, isLoaded };
}
