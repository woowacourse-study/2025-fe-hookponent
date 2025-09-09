import { useEffect, useRef, type EffectCallback } from 'react';

/**
 * useUpdateEffect는 마운트 시에는 effect를 실행하지 않고, 의존성 배열이 변경될 때만 effect를 실행하는 커스텀 훅입니다.
 *
 * 일반적인 useEffect와 달리, 최초 렌더링(마운트) 시에는 콜백이 실행되지 않습니다.
 * 이후 의존성 배열(dependencies)이 변경될 때만 콜백이 실행됩니다.
 *
 * @param callback effect로 실행할 함수 (EffectCallback)
 * @param dependencies 의존성 배열 (최소 1개 이상의 값 필요)
 *
 * @example
 * useUpdateEffect(() => {
 *   // 이 코드는 마운트 시에는 실행되지 않고, count가 변경될 때만 실행됩니다.
 *   console.log(count);
 * }, [count]);
 */
export function useUpdateEffect(callback: EffectCallback, dependencies: readonly [unknown, ...unknown[]]) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    return callback();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  }, dependencies);
}
