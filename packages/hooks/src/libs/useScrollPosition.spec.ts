import { renderHook, act } from '@testing-library/react';
import { useScrollPosition } from './useScrollPosition';

beforeAll(() => {
  let mockScrollX = 0;
  let mockScrollY = 0;

  Object.defineProperty(window, 'scrollX', {
    get: () => mockScrollX,
    set: (val) => {
      mockScrollX = val;
    },
    configurable: true,
  });
  Object.defineProperty(window, 'scrollY', {
    get: () => mockScrollY,
    set: (val) => {
      mockScrollY = val;
    },
    configurable: true,
  });

  window.scrollTo = ((x: number, y: number) => {
    window.scrollX = x;
    window.scrollY = y;
    window.dispatchEvent(new Event('scroll'));
  }) as typeof window.scrollTo;
});

describe('useScrollPosition', () => {
  it('초기 위치가 반영되어야 한다', () => {
    const { result } = renderHook(() => useScrollPosition());

    console.log('result', result);

    expect(result.current.position).toEqual({ x: 0, y: 0 });
    expect(result.current.direction).toBe('none');
  });

  it('스크롤 시 위치와 방향이 업데이트된다 (down)', () => {
    const { result } = renderHook(() => useScrollPosition());

    act(() => {
      window.scrollTo(0, 100);
    });

    expect(result.current.position).toEqual({ x: 0, y: 100 });
    expect(result.current.direction).toBe('down');
  });

  it('스크롤 시 위치와 방향이 업데이트된다 (up)', () => {
    const { result } = renderHook(() => useScrollPosition());

    act(() => {
      window.scrollTo(0, 100);
      window.scrollTo(0, 50);
    });

    expect(result.current.position).toEqual({ x: 0, y: 50 });
    expect(result.current.direction).toBe('up');
  });

  it('좌우 스크롤 방향 감지(right, left)', () => {
    const { result } = renderHook(() => useScrollPosition());

    act(() => {
      window.scrollTo(100, 50);
    });
    expect(result.current.direction).toBe('right');

    act(() => {
      window.scrollTo(50, 50);
    });
    expect(result.current.direction).toBe('left');
  });

  it('throttleMs 옵션 적용 확인', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useScrollPosition({ throttleMs: 200 }));

    act(() => {
      window.scrollTo(0, 100);
      window.scrollTo(0, 200); // throttle 시간 내 호출 → 무시됨
    });

    expect(result.current.position).toEqual({ x: 0, y: 100 });

    act(() => {
      jest.advanceTimersByTime(250);
      window.scrollTo(0, 200);
    });

    expect(result.current.position).toEqual({ x: 0, y: 200 });
    jest.useRealTimers();
  });
});
