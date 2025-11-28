import { RefObject, useEffect, useRef } from 'react';

interface UseEnterKeyOptions {
  callback: () => void | Promise<void>;
  buttonRef?: RefObject<HTMLElement>;
}

export function useEnterKey<T extends HTMLElement = HTMLElement>({ callback, buttonRef }: UseEnterKeyOptions) {
  const targetRef = useRef<T>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      if (document.activeElement === targetRef.current && !e.isComposing) {
        callbackRef.current?.();
        buttonRef?.current?.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [buttonRef]);

  return { targetRef };
}
