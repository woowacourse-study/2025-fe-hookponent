import { useCallback, useEffect, useRef, useState } from 'react';

export interface ScrollPosition {
  x: number;
  y: number;
}

export type ScrollDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export interface UseScrollPositionReturn {
  position: ScrollPosition;

  direction: ScrollDirection;
}

export interface UseScrollPositionOptions {
  target?: React.RefObject<HTMLElement | null>;
  throttleMs?: number;
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
    const initialPos = getScrollPosition(target?.current ?? window);
    setPosition(initialPos);
    prevXRef.current = initialPos.x;
    prevYRef.current = initialPos.y;
  }, [target]);

  useEffect(() => {
    const targetElement = target?.current ?? window;

    targetElement.addEventListener('scroll', handleScroll);
    return () => targetElement.removeEventListener('scroll', handleScroll);
  }, [handleScroll, target]);

  return { position, direction };
}

function getScrollPosition(target?: HTMLElement | Window) {
  if (!target) return { x: 0, y: 0 };

  // Window 객체인지 안전하게 확인
  const isWindow = target === window || (typeof Window !== 'undefined' && target instanceof Window);

  if (isWindow) {
    return { x: (target as Window).scrollX ?? 0, y: (target as Window).scrollY ?? 0 };
  }
  return { x: (target as HTMLElement).scrollLeft ?? 0, y: (target as HTMLElement).scrollTop ?? 0 };
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
