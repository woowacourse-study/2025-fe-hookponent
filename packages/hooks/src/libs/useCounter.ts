import { useCallback, useState } from 'react';

interface UseCounterOptions {
  min?: number;
  max?: number;
  step?: number;
}

interface UseCounterReturns {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (value: number | ((prev: number) => number)) => void;
}

/**
 * 숫자의 증가, 감소, 초기화 기능을 제공하는 커스텀 훅입니다.
 * 이 훅은 count 상태와 함께 increment, decrement, reset, setCount 함수를 제공합니다.
 * increment는 count를 step만큼 증가시키고, decrement는 step만큼 감소시키며,
 * reset은 초기값으로 되돌립니다.
 * setCount는 count를 직접 설정할 수 있는 함수로, 함수형 업데이트를 지원합니다.
 *
 * @template T 저장할 상태의 타입
 * @param {number} initialValue - 초기값 (기본값: 0)
 * @param {UseCounterOptions} [options] - 옵션 객체
 * @param {number} [options.min] - 최소값 (기본값: undefined)
 * @param {number} [options.max] - 최대값 (기본값: undefined)
 * @param {number} [options.step=1] - 증가/감소 단위 (기본값: 1)
 * @returns {UseCounterReturns} - {count, increment, decrement, reset, setCount}
 * @example
 * const { count, increment, decrement, reset, setCount } = useCounter(10, { min: 0, max: 100, step: 5 });
 */

export function useCounter(
  initialValue: number = 0,
  { min, max, step = 1 }: UseCounterOptions = {}
): UseCounterReturns {
  const validateValue = useCallback(
    (value: number): number => {
      let validatedValue = value;

      if (min !== undefined && validatedValue < min) {
        validatedValue = min;
      }

      if (max !== undefined && validatedValue > max) {
        validatedValue = max;
      }

      return validatedValue;
    },
    [min, max]
  );

  const [count, setCountState] = useState<number>(() => validateValue(initialValue));

  const setCount = useCallback(
    (value: number | ((prev: number) => number)) => {
      setCountState((prev) => {
        const nextValue = typeof value === 'function' ? value(prev) : value;

        return validateValue(nextValue);
      });
    },
    [validateValue]
  );

  const increment = useCallback(() => {
    setCount((prev) => prev + step);
  }, [setCount, step]);

  const decrement = useCallback(() => {
    setCount((prev) => prev - step);
  }, [setCount, step]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [setCount, initialValue]);

  return {
    count,
    increment,
    decrement,
    reset,
    setCount,
  };
}
