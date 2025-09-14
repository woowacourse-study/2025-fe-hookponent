import { EffectCallback, useEffect } from 'react';

/**
 * useInitEffect
 *
 * 컴포넌트 최초 마운트 시 단 한 번만 실행되는 effect 훅입니다.
 * 내부적으로 `useEffect(callback, [])`를 호출하는 것과 동일하지만,
 * 이름을 통해 의도를 더 명확하게 표현할 수 있습니다.
 *
 * @param callback 실행할 이펙트 콜백 함수
 * - 컴포넌트가 마운트될 때 한 번 실행됩니다.
 * - `useEffect`와 동일하게 cleanup 함수를 반환할 수 있습니다.
 *
 * @example
 * ```tsx
 * useInitEffect(() => {
 *   console.log('컴포넌트가 마운트될 때 한 번만 실행됩니다.');
 *   return () => {
 *     console.log('컴포넌트가 언마운트될 때 실행됩니다.');
 *   };
 * });
 * ```
 */

interface useInitEffectParams {
  callback: EffectCallback;
}
const useInitEffect = ({ callback }: useInitEffectParams) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, []);
};

export default useInitEffect;
