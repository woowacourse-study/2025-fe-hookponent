import { useState } from 'react';

type UseLocalStorageOptions<T> = {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
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
  const { serializer = JSON.stringify, deserializer = JSON.parse } = options;

  const [storedValue, setStoredValue] = useState<T>(() => storage.get(key, initialValue, deserializer));

  const setValue = (value: T | ((prev: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    storage.set(key, valueToStore, serializer);
  };

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
};
