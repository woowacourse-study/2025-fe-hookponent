import { useCallback, useEffect, useRef } from 'react';

// zone cursor와 global cursor 의 역할 이해

/**
 * cursorStore — 전역 커서 가시성 조정을 위한 store
 *
 * - 하나 이상의 "존 커서(zone cursor)"가 활성화되면 activeCount > 0
 * - 글로벌 커서(global cursor)는 이를 구독하여, 활성 존이 있으면 숨김(opacity 0), 없으면 표시(opacity 1)
 *
 * 내부 상태를 클로저로 은닉하는 IIFE 형태의 작은 pub/sub 스토어입니다.
 */
const cursorStore = (() => {
  let activeCount = 0;
  const subscribers = new Set<(isActiveZone: boolean) => void>();

  const notify = () => subscribers.forEach((fn) => fn(activeCount > 0));

  return {
    /**
     * zone 활성/비활성 전환을 반영합니다. 동일 값이면 무시합니다.
     * @param active 현재 zone 활성화 상태
     * @param prev   직전 zone 활성화 상태
     */
    set(active: boolean, prev: boolean) {
      if (active === prev) return;
      // 단순히 "존 하나만 존재" 가정에 맞춘 토글
      activeCount = active ? 1 : 0;
      notify();
    },

    /**
     * 활성 존 존재 여부(zoneActive)를 구독합니다.
     * @param fn (isActiveZone: boolean) => void
     * @returns 구독 해제 함수(unsubscribe)
     */
    subscribe(fn: (isActiveZone: boolean) => void) {
      subscribers.add(fn);
      fn(activeCount > 0); // 현재 상태 즉시 반영
      return () => subscribers.delete(fn);
    },
  };
})();

type useMouseFollowerStyle = {
  /** 포인터 상대 오프셋(px) */
  offset?: { x?: number; y?: number }; // default: {}
};

type useMouseFollowerOptions<T extends HTMLElement = HTMLElement> = {
  targetRef?: React.RefObject<T | null>;
  style?: useMouseFollowerStyle;
};

/**
 * `useMouseFollower` 훅은 DOM 요소를 마우스 포인터처럼 따라다니게 만들어주는 훅입니다.
 *
 * - 커스텀 요소를 생성해 마우스 포인터 대체용으로 활용할 수 있습니다.
 * - `targetRef`가 있으면 해당 영역 안에서만 보이는 "존 커서", 없으면 "글로벌 커서"로 동작합니다.
 * - 하나 이상의 존 커서가 활성화되면 글로벌 커서는 자동으로 숨겨집니다.
 * - state 없이 ref + style만 갱신하여 리렌더링 없이 부드럽게 작동합니다.
 *
 * @template E 팔로워 요소 타입(기본: HTMLElement, 예: HTMLDivElement, HTMLSpanElement)
 * @template T 타깃(존) 요소 타입(기본: HTMLElement, 예: HTMLDivElement)
 *
 * @param options
 * @param options.targetRef 팔로워가 표시될 "존" 요소의 ref (없으면 글로벌 커서로 동작)
 * @param options.style.offset 포인터로부터의 상대 오프셋(px) `{ x?: number; y?: number }`
 *
 * @returns React.RefObject<E | null>
 * - 커서로 사용할 요소에 붙일 ref
 *
 * @note 커서 엘리먼트에는 보통 다음 스타일을 권장합니다:
 *  - position: fixed; pointer-events: none; will-change: transform;
 *  - transform: translate3d(-9999px, -9999px, 0); // 초기 화면 밖
 */
export function useMouseFollower<E extends HTMLElement = HTMLElement, T extends HTMLElement = HTMLElement>({
  targetRef = { current: null },
  style,
}: useMouseFollowerOptions<T> = {}): React.RefObject<E | null> {
  const cursorRef = useRef<E>(null);
  const posRef = useRef({ x: -9999, y: -9999 });
  const prevInsideRef = useRef(false);
  const targetElRef = useRef<HTMLElement | null>(null);

  const offsetX = style?.offset?.x ?? 0;
  const offsetY = style?.offset?.y ?? 0;

  // 0) 베이스 스타일 1회 적용: 좌상단 기준 고정 + 기본 값
  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    // 필수 베이스 (좌표계 고정)
    el.style.position = 'fixed';
    el.style.top = '0';
    el.style.left = '0';
    el.style.pointerEvents = 'none';
    el.style.willChange = 'transform, opacity';
    // 초기 화면 밖
    el.style.transform = 'translate3d(-9999px, -9999px, 0)';
  }, []);

  // 1) targetRef 동기화
  useEffect(() => {
    targetElRef.current = targetRef.current ?? null;
  }, [targetRef]);

  // 2) 글로벌 커서: 활성 존 여부 구독 → opacity 토글
  useEffect(() => {
    if (targetElRef.current || !cursorRef.current) return;

    const unsubscribe = cursorStore.subscribe((isActiveZone) => {
      cursorRef.current.style.opacity = isActiveZone ? '0' : '1';
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // 3) 좌표/가시성 갱신
  const updateCursor = useCallback(
    (x: number, y: number) => {
      const el = cursorRef.current;
      if (!el) return;

      // 글로벌 커서
      posRef.current = { x, y };
      el.style.transform = `translate3d(${x + offsetX}px, ${y + offsetY}px, 0)`;

      // 존 커서
      const targetEl = targetElRef.current;
      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
        cursorStore.set(inside, prevInsideRef.current);
        prevInsideRef.current = inside;
        el.style.opacity = inside ? '1' : '0';
      }
    },
    [offsetX, offsetY]
  );

  // 4) 포인터 추적 (이벤트 등록)
  useEffect(() => {
    const onMove = (e: PointerEvent) => updateCursor(e.clientX, e.clientY);

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      // 존 커서가 내부에서 사라질 때 상태 정리
      if (targetElRef.current && prevInsideRef.current) {
        cursorStore.set(false, true);
        prevInsideRef.current = false;
      }
    };
  }, [updateCursor]);

  // 5) 뷰포트 변화 시 재판정(스크롤/리사이즈/타깃 스크롤)
  useEffect(() => {
    const targetEl = targetElRef.current;
    if (!targetEl) return;

    const recompute = () => updateCursor(posRef.current.x, posRef.current.y);

    window.addEventListener('scroll', recompute, { passive: true });
    window.addEventListener('resize', recompute);
    targetEl.addEventListener('scroll', recompute, { passive: true });

    return () => {
      window.removeEventListener('scroll', recompute);
      window.removeEventListener('resize', recompute);
      targetEl.removeEventListener('scroll', recompute);
    };
  }, [updateCursor]);

  return cursorRef;
}
