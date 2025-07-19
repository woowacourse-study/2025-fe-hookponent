import { useCallback, useEffect, useRef } from 'react';

type UseDebounceReturn<T extends any[]> = (...args: T) => any;

export function useDebounce<T extends any[]>(callback: (...args: T) => any, wait: number): UseDebounceReturn<T> {
  const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  const debounced = useCallback(
    (...args: T) => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }

      timerIdRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, wait);
    },
    [wait]
  );

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    };
  }, []);

  return debounced;
}
