import { useCallback, useEffect, useRef, useState } from 'react';

type UseStorageStateOptions<T> = {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  autoInit?: boolean;
  type?: 'local' | 'session';
};

type useStorageStateReturn<T> = [storedValue: T, setValue: (storedValue: T | ((prev: T) => T)) => void];

/**
 * `useStorageState` 훅은 `localStorage` 또는 `sessionStorage`에 상태를 저장하고 동기화하는 상태 관리 훅입니다.
 *
 * - 상태를 변경하면 지정된 Storage (`localStorage` 또는 `sessionStorage`)에 자동으로 반영됩니다.
 * - 새로고침 이후에도 저장된 값을 유지하며, 값이 존재하지 않을 경우 `initialValue`가 사용됩니다.
 * - 다른 탭 또는 창에서 해당 키가 변경될 경우 자동으로 상태를 동기화합니다.
 *
 * @template T 저장할 상태의 타입
 * @param {string} key - Storage에 저장할 키 값
 * @param {T} initialValue - 저장된 값이 없을 경우 사용할 초기값
 * @param {UseLocalStorageOptions<T>} [options] - 직렬화/역직렬화 함수, 자동 초기화 여부, Storage 타입을 설정하는 옵션 객체
 * @param {(value: T) => string} [options.serializer] - 값을 문자열로 변환하는 함수 (기본값: JSON.stringify)
 * @param {(value: string) => T} [options.deserializer] - 문자열을 원래 값으로 변환하는 함수 (기본값: JSON.parse)
 * @param {boolean} [options.autoInit=true] - 초기 렌더 시 저장된 값이 없으면 `initialValue`를 자동 저장할지 여부
 * @param {'local' | 'session'} [options.type='local'] - 사용할 Storage 종류. 'local'은 localStorage, 'session'은 sessionStorage를 사용
 *
 * @returns {[T, (value: T | ((prev: T) => T)) => void, () => void]}
 * - `[0]`: 현재 상태 값
 * - `[1]`: 상태를 업데이트하고 Storage에 저장하는 setter 함수
 */

export function useStorageState<T>(
  key: string,
  initialValue: T,
  options?: UseStorageStateOptions<T>
): useStorageStateReturn<T> {
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
