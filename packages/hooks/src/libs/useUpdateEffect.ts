import { useEffect, useRef, EffectCallback } from 'react';

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
