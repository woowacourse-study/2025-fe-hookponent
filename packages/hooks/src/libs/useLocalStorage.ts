import { useCallback, useEffect, useRef, useState } from 'react';

type UseLocalStorageOptions<T> = {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  autoInit?: boolean;
  type?: 'local' | 'session';
};

type useLocalStorageReturn<T> = [storedValue: T, setValue: (storedValue: T | ((prev: T) => T)) => void];

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
  const { serializer, deserializer, autoInit = true, type = 'local' } = options ?? {};

  const storage = useRef(type === 'local' ? localStorageObj : sessionStorageObj);

  const serializerRef = useRef(serializer);
  const deserializerRef = useRef(deserializer);
  const autoInitRef = useRef(autoInit);

  const [storedValue, setStoredValue] = useState<T>(() =>
    storage.current.get(key, initialValue, deserializerRef.current)
  );

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        if (valueToStore === null) {
          storage.current.remove(key);
        } else {
          storage.current.set(key, valueToStore, serializerRef.current);
        }
        return valueToStore;
      });
    },
    [key]
  );

  //외부에서 상태 변경되었을 때, 해당 로컬스토리지의 값으로 상태를 반영해준다.
  useEffect(() => {
    const storageHandler = (event: StorageEvent) => {
      if (event.key === key) setValue(storage.current.get(key));
    };

    window.addEventListener('storage', storageHandler);

    return () => window.removeEventListener('storage', storageHandler);
  }, [key, setValue]);

  useEffect(() => {
    if (!autoInitRef.current) return;

    const existing = type === 'local' ? localStorage.getItem(key) : sessionStorage.getItem(key);
    if (existing === null) {
      try {
        storage.current.set(key, initialValue, serializerRef.current);
      } catch (error) {
        console.error('autoInit 저장 실패', error);
      }
    }
  }, [key, initialValue, type]);

  useEffect(() => {
    serializerRef.current = serializer;
  }, [serializer]);

  useEffect(() => {
    deserializerRef.current = deserializer;
  }, [deserializer]);

  useEffect(() => {
    autoInitRef.current = autoInit;
  }, [autoInit]);

  return [storedValue, setValue] as const;
}

const localStorageObj = {
  get<T>(key: string, defaultValue?: T, deserializer?: (value: string) => T): T {
    const parse = deserializer ?? JSON.parse;
    try {
      const item = localStorage.getItem(key);
      return item ? parse(item) : defaultValue || null;
    } catch (error) {
      console.error('localStorage getItem 오류', error);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T, serializer?: (value: T) => string): void {
    const stringify = serializer ?? JSON.stringify;

    try {
      localStorage.setItem(key, stringify(value));
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

const sessionStorageObj = {
  get<T>(key: string, defaultValue?: T, deserializer?: (value: string) => T): T {
    const parse = deserializer ?? JSON.parse;
    try {
      const item = sessionStorage.getItem(key);
      return item ? parse(item) : defaultValue || null;
    } catch (error) {
      console.error('sessionStorage getItem 오류', error);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T, serializer?: (value: T) => string): void {
    const stringify = serializer ?? JSON.stringify;

    try {
      sessionStorage.setItem(key, stringify(value));
    } catch (error) {
      console.error('sessionStorage setItem 오류', error);
    }
  },

  remove(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('sessionStorage removeItem 오류', error);
    }
  },
};
