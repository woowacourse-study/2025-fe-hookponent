import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * `useIdle` 훅은 사용자의 비활성 상태(Idle)를 감지하는 React 훅입니다.
 *
 * - 사용자가 마우스, 키보드, 스크롤 등 입력 이벤트를 발생시키지 않으면 일정 시간이 지난 후 Idle 상태로 간주합니다.
 * - 입력 이벤트가 감지되면 타이머가 리셋되며, 다시 일정 시간 동안 입력이 없을 경우 Idle 상태가 됩니다.
 * - 다양한 입력 이벤트(`mousemove`, `click`, `keydown` 등)를 감지하여 자동으로 상태를 추적합니다.
 *
 * @param {number} timeout - 사용자가 입력 이벤트를 발생시키지 않았을 때 Idle 상태로 전환되는 시간(ms 단위)
 *
 * @returns {boolean} - 사용자가 현재 Idle 상태인지 여부 (`true`: 비활성 상태, `false`: 활성 상태)
 *
 * @example
 * ```tsx
 * const isIdle = useIdle(5000); // 5초간 입력 없으면 Idle로 간주
 *
 * useEffect(() => {
 *   if (isIdle) {
 *     console.log('사용자가 비활성 상태입니다.');
 *   }
 * }, [isIdle]);
 * ```
 */

export function useIdle(timeout: number): boolean {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef(timeout);
  const timerRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = timeout;
  }, [timeout]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setIsIdle(false);

    timerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, timeoutRef.current);
  }, []);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'keydown', 'scroll', 'touchstart', 'click'];

    const handleActivity = () => {
      resetTimer();
    };

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    resetTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [resetTimer]);

  return isIdle;
}
