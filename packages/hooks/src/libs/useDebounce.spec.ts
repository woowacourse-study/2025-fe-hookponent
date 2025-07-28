import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  it('wait 시간 후 콜백을 실행한다', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current();
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('여러 번 호출해도 한번만 실행된다', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current();
      result.current();
      result.current();
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('리렌더링이 되면 최신 콜백을 사용한다', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const { result, rerender } = renderHook(({ cb }) => useDebounce(cb, 500), { initialProps: { cb: callback1 } });

    // rerender with new callback
    rerender({ cb: callback2 });

    act(() => {
      result.current();
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('인자를 콜백에 전달한다', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current('hello', 123);
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledWith('hello', 123);
  });

  it('언마운트 시 콜백이 실행되지 않는다', () => {
    const callback = jest.fn();
    const { result, unmount } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current();
    });

    unmount();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();
  });
});
