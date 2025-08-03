import { useEffect, useState } from 'react';

/**
 * useDarkMode 훅은 다크 모드 상태를 관리합니다.
 *
 * @returns [darkMode, toggleDarkMode]
 * - darkMode: 현재 다크 모드 상태 (boolean)
 * - toggleDarkMode: 다크 모드 상태를 토글하는 함수
 */
type UseDarkModeReturn = [darkMode: boolean, toggleDarkMode: () => void];

const LOCAL_STORAGE_KEY = 'darkMode';

export function useDarkMode(): UseDarkModeReturn {
  // 초기값을 localStorage에서 가져오거나, 시스템 설정에 따라 결정
  const getInitialValue = () => {
    const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedValue !== null) {
      return storedValue === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [darkMode, setDarkMode] = useState(getInitialValue);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      const userPreference = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (userPreference === null) {
        setDarkMode(event.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem(LOCAL_STORAGE_KEY, next.toString());
      return next;
    });
  };

  return [darkMode, toggleDarkMode];
}
