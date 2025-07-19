import { useCallback, useEffect, useRef } from 'react';

type UseDebounceReturn = () => void;

export function useDebounce(callback: () => void, wait: number): UseDebounceReturn {
  const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  const debounced = useCallback(() => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
    }

    timerIdRef.current = setTimeout(() => {
      callbackRef.current();
    }, wait);
  }, [wait]);

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
