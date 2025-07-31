import { useEffect, useRef } from 'react';

export function useOutsideClick(callback: () => void) {
  const elementRef = useRef<HTMLElement>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleDocumentClick = ({ target }: MouseEvent) => {
      const element = elementRef.current;

      if (element && !element.contains(target as Node)) {
        callbackRef.current();
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

  return (element: HTMLElement | null) => {
    if (!element) {
      return;
    }

    elementRef.current = element;

    return () => {
      elementRef.current = null;
    };
  };
}
