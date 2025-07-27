import { useState, useCallback } from 'react';

type useToggleStateReturn = readonly [boolean, () => void];

export function useToggleState(defaultValue: boolean = false): useToggleStateReturn {
  const [bool, setBool] = useState<boolean>(defaultValue);

  const toggle = useCallback(() => {
    setBool((prevBool) => !prevBool);
  }, []);

  return [bool, toggle] as const;
}
