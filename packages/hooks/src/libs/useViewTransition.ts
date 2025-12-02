import { useCallback, useRef } from 'react';

export interface UseViewTransitionOptions {
  onFinish?: () => void;
  onReady?: () => void;
}

export interface UseViewTransitionReturn {
  startTransition: (
    update: () => void,
    options?: UseViewTransitionOptions
  ) => void;
  bindRef: (name: string) => (el: HTMLElement | null) => void;
}

function isViewTransitionSupported(): boolean {
  return typeof document !== 'undefined' && 'startViewTransition' in document;
}

export function useViewTransition(): UseViewTransitionReturn {
  const elementsRef = useRef<Map<string, Set<HTMLElement>>>(new Map());

  const bindRef = useCallback((name: string) => {
    return (el: HTMLElement | null) => {
      const elements = elementsRef.current;
      
      if (el) {
        el.style.viewTransitionName = name;
        
        if (!elements.has(name)) {
          elements.set(name, new Set());
        }
        elements.get(name)!.add(el);
      } else {
        const set = elements.get(name);
        if (set) {
          set.forEach(e => { e.style.viewTransitionName = ''; });
          elements.delete(name);
        }
      }
    };
  }, []);

  const startTransition = useCallback((
    update: () => void,
    options?: UseViewTransitionOptions
  ) => {
    if (!isViewTransitionSupported()) {
      options?.onReady?.();
      update();
      options?.onFinish?.();
      return;
    }

    try {
      const transition = (document as Document & { startViewTransition: (update: () => void) => ViewTransition }).startViewTransition(update);
      
      if (options?.onReady) {
        transition.ready.then(options.onReady).catch(() => {
          options.onReady?.();
        });
      }
      
      if (options?.onFinish) {
        transition.finished.then(options.onFinish).catch(() => {
          options.onFinish?.();
        });
      }
    } catch (error) {
      console.warn('View transition failed:', error);
      options?.onReady?.();
      update();
      options?.onFinish?.();
    }
  }, []);

  return {
    startTransition,
    bindRef,
  };
}

