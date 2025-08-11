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

/**
 * 다양한 이벤트 타겟(Window, Document, HTMLElement, MediaQueryList 등)에
 * 이벤트 리스너를 등록하고, 컴포넌트 언마운트 시 자동으로 해제하는 React 훅입니다.
 *
 * 이 훅은 이벤트 리스너의 등록과 해제를 자동으로 관리하므로,
 * 직접 `addEventListener`/`removeEventListener`를 호출할 필요가 없습니다.
 *
 * @template K 주어진 타겟의 이벤트 맵에서 이벤트 타입 키 (예: `'click'`, `'resize'`, `'keydown'` 등)
 *
 * @param target - 이벤트 리스너를 등록할 대상
 *   - `Window` 또는 `RefObject<Window>`
 *   - `Document` 또는 `RefObject<Document>`
 *   - `HTMLElement` 또는 `RefObject<HTMLElement>`
 *   - `MediaQueryList` 또는 `RefObject<MediaQueryList>`
 *   - 일반 `EventTarget` 또는 `RefObject<EventTarget>`
 *
 * @param type - 수신할 이벤트 타입 이름 (예: `'click'`, `'resize'`, `'keydown'`)
 *
 * @param listener - 이벤트 발생 시 호출될 콜백 함수
 *   - 이벤트 객체를 인자로 받으며, 타입은 `target`에 따라 자동으로 추론됩니다.
 *
 * @param [options=false] - 이벤트 리스너 옵션
 *   - `boolean`(캡처 여부) 또는 `AddEventListenerOptions` 객체
 *
 * @example
 * ```tsx
 * // window 리사이즈 이벤트 수신
 * useEventListener(window, 'resize', (e) => {
 *   console.log('윈도우 크기 변경', e);
 * });
 *
 * // 버튼 클릭 이벤트 수신 (ref 사용)
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * useEventListener(buttonRef, 'click', (e) => {
 *   console.log('버튼 클릭', e);
 * });
 *
 * // 미디어 쿼리 변경 이벤트 수신
 * const mql = window.matchMedia('(max-width: 600px)');
 * useEventListener(mql, 'change', (e) => {
 *   console.log('미디어 쿼리 매치 여부:', e.matches);
 * });
 * ```
 *
 * @remarks
 * - `RefObject`를 전달하면 `.current`에 이벤트 리스너가 등록됩니다.
 * - 내부적으로 `listener` 참조를 안정적으로 유지하므로, 인라인 함수 전달 시에도 안전합니다.
 * - 의존성(`target`, `type`, `options`)이 변경되면 기존 리스너를 제거하고 새로 등록합니다.
 */
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
