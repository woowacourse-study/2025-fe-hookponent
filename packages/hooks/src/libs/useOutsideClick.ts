import { useEffect, useRef } from 'react';

export function useOutsideClick(callback: () => void) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleDocumentClick = ({ target }: MouseEvent) => {
      const element = elementRef.current;

      if (element && !element.contains(target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [callback]);

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
