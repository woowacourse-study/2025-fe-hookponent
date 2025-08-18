import { useEffect, useState } from 'react';

/**
 * useDarkMode 훅은 다크 모드 상태를 관리합니다.
 *
 * @param options - 다크모드 설정 옵션
 * @param options.key - localStorage에 저장할 고유 키 (기본값: 'darkMode')
 * @returns 다크모드 상태와 제어 함수들을 포함한 객체
 */
interface UseDarkModeOptions {
  key?: string;
}

interface UseDarkModeReturn {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

const DEFAULT_KEY = 'darkMode';

export function useDarkMode(options: UseDarkModeOptions = {}): UseDarkModeReturn {
  const { key = DEFAULT_KEY } = options;

  // 초기값을 localStorage에서 가져오거나, 시스템 설정에 따라 결정
  const getInitialValue = () => {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      return storedValue === 'true';
    }

    // 시스템 다크모드 값을 확인하고 localStorage에 저장
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    localStorage.setItem(key, systemDarkMode.toString());
    return systemDarkMode;
  };

  const [darkMode, setDarkModeState] = useState(getInitialValue);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      const userPreference = localStorage.getItem(key);
      if (userPreference === null) {
        setDarkModeState(event.matches);
        localStorage.setItem(key, event.matches.toString());
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [key]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkModeState((prev) => {
      const next = !prev;
      localStorage.setItem(key, next.toString());
      return next;
    });
  };

  const setDarkMode = (value: boolean) => {
    setDarkModeState(value);
    localStorage.setItem(key, value.toString());
  };

  return {
    darkMode,
    toggleDarkMode,
    setDarkMode,
  };
}
