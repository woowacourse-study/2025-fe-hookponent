import { useEffect, useRef } from 'react';

export const usePrevious = <T>(value: T, initialValue?: T): T | undefined => {
  const valueRef = useRef<T | undefined>(initialValue);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  return valueRef.current;
};
