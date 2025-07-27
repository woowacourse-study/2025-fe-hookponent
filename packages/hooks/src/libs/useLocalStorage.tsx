import { useState } from 'react';

// 초기값은 어떻게 작업하는게 좋지?
// 초기에는 parameter로 초기값이 들어온다?
// 이건 setter랑 getter로 나눠야할듯?
// 초기값 저장할 때는 localStorage -> 저장 후, 상태에 초기값 반영
// setter할 때는 상태 먼저 변경후, 로컬 스토리지도 동기화 시키기
//

/**
 *
 * @returns
 */

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => storage.get(key, initialValue));

  const setValue = (value: T | ((prev: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    storage.set(key, valueToStore);
  };

  return [storedValue, setValue] as const;
}

const storage = {
  get<T>(key: string, defaultValue: T): T {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  },

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  },
};
