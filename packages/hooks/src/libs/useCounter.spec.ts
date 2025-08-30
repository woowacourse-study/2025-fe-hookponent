import { act, renderHook } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter 훅 검증 테스트', () => {
  it('초기 값을 지정하지 않은 경우 기본 값으로 초기 값이 설정되어야 한다.', () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);
  });

  it('초기 값을 지정한 경우 지정한 값으로 초기 값이 설정되어야 한다.', () => {
    const { result } = renderHook(() => useCounter(10));

    expect(result.current.count).toBe(10);
  });

  it('값이 정상적으로 증가되어야 한다.', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(6);
  });

  it('값이 정상적으로 감소되어야 한다.', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });

  it('리셋 함수를 실행시킬 경우 초기 값으로 돌아가야한다.', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.increment();
      result.current.increment();
    });

    expect(result.current.count).toBe(7);

    act(() => {
      result.current.reset();
    });

    expect(result.current.count).toBe(5);
  });

  it('감소 함수가 실행되어도 최소값 이하로 값이 감소될 수 없다.', () => {
    const { result } = renderHook(() =>
      useCounter(5, {
        min: 3,
      })
    );

    act(() => {
      result.current.decrement();
      result.current.decrement();
      result.current.decrement();
    });

    expect(result.current.count).toBe(3);
  });

  it('증가 함수가 실행되어도 최댓값 이상으로 값이 증가될 수 없다.', () => {
    const { result } = renderHook(() =>
      useCounter(5, {
        max: 7,
      })
    );

    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.increment();
    });

    expect(result.current.count).toBe(7);
  });

  it('증가, 감소는 step 옵션이 지정된 경우 지정된 값 만큼 증가 혹은 감소를 한다.', () => {
    const { result } = renderHook(() =>
      useCounter(5, {
        step: 2,
      })
    );

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(7);

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(5);
  });

  it('min 혹은 max 옵션 값을 지정한 경우 그 이하 혹은 이상으로 초기 값이 될 수 없다.', () => {
    const { result } = renderHook(() =>
      useCounter(1, {
        min: 3,
      })
    );

    expect(result.current.count).toBe(3);

    const { result: result2 } = renderHook(() =>
      useCounter(10, {
        max: 8,
      })
    );

    expect(result2.current.count).toBe(8);
  });

  it('min 혹은 max 옵션 값을 지정한 경우 그 이하 혹은 이상으로 값이 변경될 수 없다.', () => {
    const { result } = renderHook(() =>
      useCounter(0, {
        min: 3,
        max: 8,
      })
    );

    act(() => {
      result.current.setCount(6);
    });

    expect(result.current.count).toBe(6);

    act(() => {
      result.current.setCount(1);
    });

    expect(result.current.count).toBe(3);

    act(() => {
      result.current.setCount(10);
    });

    expect(result.current.count).toBe(8);
  });

  it('setCount 함수는 함수형 업데이트를 함께 지원해야한다.', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.setCount((prev) => prev + 3);
    });

    expect(result.current.count).toBe(8);
  });
});
