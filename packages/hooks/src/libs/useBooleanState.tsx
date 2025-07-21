import { useState, useCallback } from 'react';

type UseBooleanStateReturn = [
  value: boolean,
  setTrue: () => void,
  setFalse: () => void,
  toggle: () => void,
];

/**
 * useBooleanState 훅은 boolean 상태를 제어하는 튜플을 반환합니다.
 *
 * @returns [value, setTrue, setFalse, toggle]
 */
export function useBooleanState(initial: boolean = false): UseBooleanStateReturn {
  const [value, setValue] = useState(initial);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((v) => !v), []);

  return [value, setTrue, setFalse, toggle];
}
