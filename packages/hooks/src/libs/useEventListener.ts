import { RefObject, useEffect, useRef } from 'react';

type EventTargetLike = Window | Document | HTMLElement | MediaQueryList | EventTarget;
type EventListenerOptions = boolean | AddEventListenerOptions;

const isRefObject = <T>(obj: unknown): obj is RefObject<T> => obj && typeof obj === 'object' && 'current' in obj;

export function useEventListener<K extends keyof WindowEventMap>(
  target: RefObject<Window> | Window,
  type: K,
  listener: (e: WindowEventMap[K]) => void,
  options?: EventListenerOptions
): void;
export function useEventListener<K extends keyof DocumentEventMap>(
  target: RefObject<Document> | Document,
  type: K,
  listener: (e: DocumentEventMap[K]) => void,
  options?: EventListenerOptions
): void;
export function useEventListener<K extends keyof HTMLElementEventMap>(
  target: RefObject<HTMLElement> | HTMLElement,
  type: K,
  listener: (e: HTMLElementEventMap[K]) => void,
  options?: EventListenerOptions
): void;
export function useEventListener<K extends keyof MediaQueryListEventMap>(
  target: RefObject<MediaQueryList> | MediaQueryList,
  type: K,
  listener: (e: MediaQueryListEventMap[K]) => void,
  options?: EventListenerOptions
): void;
export function useEventListener(
  target: RefObject<EventTarget> | EventTarget,
  type: string,
  listener: (e: Event) => void,
  options?: EventListenerOptions
): void;

export function useEventListener(
  target: RefObject<EventTargetLike> | EventTargetLike,
  type: string,
  listener: (e: Event) => void,
  options: EventListenerOptions = false
) {
  const listenerRef = useRef(listener);

  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const targetEl = isRefObject<EventTargetLike>(target) ? target.current : target;
    if (!targetEl || !targetEl.addEventListener) return;

    targetEl.addEventListener(type, listenerRef.current, options);
    return () => {
      targetEl.removeEventListener(type, listenerRef.current, options);
    };
  }, [target, type, options]);
}
