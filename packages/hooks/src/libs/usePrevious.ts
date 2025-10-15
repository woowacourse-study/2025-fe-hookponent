import { useEffect, useRef } from 'react';

/**
 * `usePrevious` 훅은 지정된 값의 **이전 렌더링 값**을 기억하여 반환하는 훅입니다.
 *
 * - 현재 값이 변경될 때마다 내부적으로 ref를 갱신하여 직전 값을 저장합니다.
 * - 첫 번째 렌더링 시에는 `undefined` 또는 지정된 `initialValue`를 반환합니다.
 * - 값의 변화 추적, 이전 상태 비교, 애니메이션 조건 처리 등에 유용합니다.
 *
 * @template T 추적할 값의 타입
 * @param {T} value - 추적할 값 (state, props 등)
 * @param {T} [initialValue] - 첫 번째 렌더링 시 반환할 초기 이전 값 (기본값: undefined)
 *
 * @returns {T | undefined} - 이전 렌더링 시의 값. 초기 렌더링에서는 `undefined` 또는 지정된 `initialValue`를 반환
 *
 * @example
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 *
 * useEffect(() => {
 *   if (prevCount !== undefined && prevCount !== count) {
 *     console.log(`이전 값: ${prevCount}, 현재 값: ${count}`);
 *   }
 * }, [count, prevCount]);
 */

export const usePrevious = <T>(value: T, initialValue?: T): T | undefined => {
  const valueRef = useRef<T | undefined>(initialValue);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  return valueRef.current;
};
