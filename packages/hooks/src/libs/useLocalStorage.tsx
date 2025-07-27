import { useEffect, useState } from 'react';

type UseLocalStorageOptions<T> = {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  autoInit?: boolean;
};

type useLocalStorageReturn<T> = [storedValue: T, setValue: (storedValue: T | ((prev: T) => T)) => void];

/**
 *
 * @returns [storedValue, setValue]
 */

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: UseLocalStorageOptions<T>
): useLocalStorageReturn<T> {
  const { serializer = JSON.stringify, deserializer = JSON.parse, autoInit = true } = options ?? {};

  const [storedValue, setStoredValue] = useState<T>(() => storage.get(key, initialValue, deserializer));

  const setValue = (value: T | ((prev: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    storage.set(key, valueToStore, serializer);
  };

  useEffect(() => {
    if (!autoInit) return;

    const existing = localStorage.getItem(key);
    if (existing === null) {
      try {
        storage.set(key, initialValue, serializer);
      } catch (error) {
        console.error('autoInit 저장 실패', error);
      }
    }
  }, []);

  return [storedValue, setValue] as const;
}

const storage = {
  get<T>(key: string, defaultValue: T, deserializer?: (value: string) => T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? deserializer(item) : defaultValue;
    } catch (error) {
      console.error('localStorage getItem 오류', error);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T, serializer?: (value: T) => string): void {
    try {
      localStorage.setItem(key, serializer(value));
    } catch (error) {
      console.error('localStorage setItem 오류', error);
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('localStorage removeItem 오류', error);
    }
  },
};
