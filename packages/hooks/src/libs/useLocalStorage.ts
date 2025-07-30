import { useCallback, useEffect, useState } from 'react';

type UseLocalStorageOptions<T> = {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  autoInit?: boolean;
};

type useLocalStorageReturn<T> = [
  storedValue: T,
  setValue: (storedValue: T | ((prev: T) => T)) => void,
  refresh: () => void,
];

/**
 * useLocalStorage 훅은 localStorage에 상태를 저장하고 동기화하는 상태 관리 훅입니다.
 *
 * - 상태를 저장하면 localStorage에 자동으로 반영됩니다.
 * - 새로고침 후에도 저장된 값을 유지하며, 기본값은 값이 없을 경우에만 사용됩니다.
 * - 상태를 외부에서 변경한 경우, `refresh()`를 통해 강제로 동기화할 수 있습니다.
 *
 * @param {string} key localStorage에 저장할 키
 * @param {T} initialValue localStorage에 값이 없을 때 사용할 초기값
 * @param {UseLocalStorageOptions<T>} [options] 직렬화, 역직렬화 방식 및 초기 저장 여부 설정
 * @param {boolean} [options.autoInit=true] localStorage에 값이 없을 경우 초기값을 자동 저장할지 여부
 * @param {(value: T) => string} [options.serializer] 커스텀 직렬화 함수 (기본값: JSON.stringify)
 * @param {(value: string) => T} [options.deserializer] 커스텀 역직렬화 함수 (기본값: JSON.parse)
 *
 * @returns {[T, (value: T | ((prev: T) => T)) => void, () => void]}
 * - [0]: 현재 상태 값
 * - [1]: 상태를 업데이트하고 localStorage에 저장하는 setter
 * - [2]: localStorage에서 최신 값을 가져와 상태를 수동으로 동기화하는 refresh 함수
 */

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: UseLocalStorageOptions<T>
): useLocalStorageReturn<T> {
  const { serializer = JSON.stringify, deserializer = JSON.parse, autoInit = true } = options ?? {};

  const [storedValue, setStoredValue] = useState<T>(() => storage.get(key, initialValue, deserializer));

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        storage.set(key, valueToStore, serializer);
        return valueToStore;
      });
    },
    [key, serializer]
  );

  const refresh = () => {
    setStoredValue(storage.get(key, initialValue, deserializer));
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

  return [storedValue, setValue, refresh] as const;
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
