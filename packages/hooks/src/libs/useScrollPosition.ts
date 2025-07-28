import { useEffect, useRef } from 'react';

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
  const prevXRef = useRef(0);
  const prevYRef = useRef(0);

  const position = getScrollPosition(options.target.current);
  const direction = getScrollDirection(position, { x: prevXRef.current, y: prevYRef.current });

  const handleScroll = () => {
    options.onScroll(position, direction);
  };

  useEffect(() => {
    options.target.current.addEventListener('scroll', handleScroll);
    return () => options.target.current.removeEventListener('scroll', handleScroll);
  });

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
