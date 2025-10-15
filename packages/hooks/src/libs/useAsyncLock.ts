import { useCallback, useRef, useState } from 'react';

/**
 * useAsyncLock
 *
 * 비동기 함수 실행 시, 이미 실행 중이라면 중복 실행을 막아주는 커스텀 훅입니다.
 * - 실행 중에는 `loading` 상태가 true가 됩니다.
 * - 실행이 끝나면 자동으로 lock이 해제되고 `loading`은 false가 됩니다.
 * - 필요하다면 실행 시점에 `onError` 핸들러를 두 번째 인자로 전달해 에러를 처리할 수 있습니다.
 *
 * @returns {object} runWithLock, loading, isLockedRef
 *
 * @property runWithLock 비동기 함수를 감싸 중복 실행을 막아주는 실행 함수
 * @property loading 현재 실행 중인지 여부
 * @property isLockedRef 내부 잠금 상태 ref (디버깅/제어용)
 *
 * @example
 * ```tsx
 * const { runWithLock, loading } = useAsyncLock();
 *
 * const fetchData = async () => {
 *   const res = await fetch('/api/data');
 *   return res.json();
 * };
 *
 * const handleClick = () => {
 *   runWithLock(fetchData, (err) => {
 *     console.error('요청 실패:', err);
 *   });
 * };
 *
 * return (
 *   <button onClick={handleClick} disabled={loading}>
 *     {loading ? '실행 중...' : '데이터 가져오기'}
 *   </button>
 * );
 * ```
 */
export const useAsyncLock = () => {
  const isLockedRef = useRef(false);
  const [loading, setLoading] = useState(false);

  const runWithLock = useCallback(
    async <T>(fn: () => Promise<T>, onError?: (err: unknown) => void): Promise<T | undefined> => {
      if (isLockedRef.current) return undefined;

      isLockedRef.current = true;
      setLoading(true);

      try {
        return await fn();
      } catch (e) {
        onError?.(e);
      } finally {
        isLockedRef.current = false;
        setLoading(false);
      }
    },
    []
  );

  return { runWithLock, loading, isLockedRef };
};
