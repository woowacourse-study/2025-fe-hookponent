import { useCallback, useEffect, useRef, useState } from 'react';

export interface ScrollPosition {
  x: number; // 현재 수평 스크롤 값
  y: number; // 현재 수직 스크롤 값
}

export type ScrollDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export interface UseScrollPositionReturn {
  /** 현재 스크롤 위치 */
  position: ScrollPosition;

  /** 스크롤 방향 */
  direction: ScrollDirection;
}

export interface UseScrollPositionOptions {
  /**
   * 스크롤 이벤트 대상
   * - 없으면 window
   * - ref.current를 넣으면 해당 DOM 요소
   */
  target?: React.RefObject<HTMLElement | null>;

  /** 스크롤 이벤트 감지 지연 (ms) */
  throttleMs?: number;

  /** 스크롤 시 호출되는 콜백 */
  onScroll?: (position: ScrollPosition, direction: ScrollDirection) => void;
}

export function useScrollPosition(options?: UseScrollPositionOptions): UseScrollPositionReturn {
  const { target, throttleMs, onScroll } = options || {};

  const [position, setPosition] = useState<ScrollPosition>({ x: 0, y: 0 });
  const [direction, setDirection] = useState<ScrollDirection>('none');

  const prevXRef = useRef(0);
  const prevYRef = useRef(0);

  const lastCall = useRef(0);

  const handleScroll = useCallback(() => {
    const now = Date.now();
    if (throttleMs && now - lastCall.current < throttleMs) return;

    const newPos = getScrollPosition(target?.current ?? window);
    const newDir = getScrollDirection(newPos, {
      x: prevXRef.current,
      y: prevYRef.current,
    });

    onScroll?.(newPos, newDir);

    prevXRef.current = newPos.x;
    prevYRef.current = newPos.y;
    setPosition(newPos);
    setDirection(newDir);
    lastCall.current = now;
  }, [onScroll, target, throttleMs]);

  useEffect(() => {
    const targetElement = target?.current ?? window;

    targetElement.addEventListener('scroll', handleScroll);
    return () => targetElement.removeEventListener('scroll', handleScroll);
  }, [handleScroll, target]);

  return { position, direction };
}

function getScrollPosition(target?: HTMLElement | Window) {
  if (target instanceof Window) {
    return { x: target.scrollX, y: target.scrollY };
  }
  if (target) {
    return { x: target.scrollLeft, y: target.scrollTop };
  }
  return { x: 0, y: 0 };
}

function getScrollDirection(curPosition: { x: number; y: number }, prevPosition: { x: number; y: number }) {
  const diffX = curPosition.x - prevPosition.x;
  const diffY = curPosition.y - prevPosition.y;
  let dir: ScrollDirection = 'none';

  if (Math.abs(diffY) > Math.abs(diffX)) {
    dir = diffY > 0 ? 'down' : diffY < 0 ? 'up' : 'none';
  } else {
    dir = diffX > 0 ? 'right' : diffX < 0 ? 'left' : 'none';
  }

  return dir;
}
