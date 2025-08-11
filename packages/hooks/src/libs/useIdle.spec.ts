import { act, renderHook } from '@testing-library/react';
import { useIdle } from './useIdle';

jest.useFakeTimers();

describe('useIdle 훅', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  it('초기에는 isIdle이 false이다', () => {
    const { result } = renderHook(() => useIdle(3000));
    expect(result.current).toBe(false);
  });

  it('timeout 후 isIdle이 true로 변경된다', () => {
    const { result } = renderHook(() => useIdle(3000));
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current).toBe(true);
  });

  it('이벤트 발생 시 isIdle이 false로 전환되고 타이머가 재시작된다', () => {
    const { result } = renderHook(() => useIdle(3000));

    act(() => {
      jest.advanceTimersByTime(3000); // idle 상태로
    });

    expect(result.current).toBe(true);

    act(() => {
      document.dispatchEvent(new Event('mousemove', { bubbles: true }));
    });

    expect(result.current).toBe(false); // 이벤트로 인해 활성 상태 복귀

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current).toBe(true); // 다시 idle로
  });

  const events = ['mousedown', 'mousemove', 'keypress', 'keydown', 'scroll', 'touchstart', 'click'];

  events.forEach((eventName) => {
    it(`이벤트 "${eventName}" 발생 시 타이머가 초기화되고 isIdle이 false로 전환된다`, () => {
      const { result } = renderHook(() => useIdle(3000));

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(result.current).toBe(true); // idle 상태 도달

      act(() => {
        document.dispatchEvent(new Event(eventName, { bubbles: true }));
      });

      expect(result.current).toBe(false); // 이벤트로 활성

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(result.current).toBe(true); // 다시 idle 상태
    });
  });

  it('클린업 시 이벤트 리스너가 제거된다', () => {
    const addSpy = jest.spyOn(document, 'addEventListener');
    const removeSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => useIdle(3000));
    expect(addSpy).toHaveBeenCalled();

    unmount();
    expect(removeSpy).toHaveBeenCalled();

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
