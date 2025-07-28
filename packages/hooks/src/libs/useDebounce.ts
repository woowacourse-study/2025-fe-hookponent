import { useCallback, useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UseDebounceReturn<T extends any[]> = (...args: T) => any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebounce<T extends any[]>(callback: (...args: T) => any, wait: number): UseDebounceReturn<T> {
  const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  let returnValue = {};

  const debounced = useCallback(
    (...args: T) => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }

      timerIdRef.current = setTimeout(() => {
        returnValue = callbackRef.current(...args);
      }, wait);

      return returnValue;
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
