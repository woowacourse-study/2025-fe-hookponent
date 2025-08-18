import { useLayoutEffect } from 'react';

let lockCount = 0;
let savedOverflow: string | null = null;

/**
 * body 스크롤 잠금 훅
 * - 마운트 시 body overflow를 'hidden'으로 변경
 * - 언마운트 시 원래 상태 복원
 * - 다중 모달 지원
 *
 * @example
 * useLockBodyScroll(); // 모달 내부에서 호출 시 모달 열리는 동안 스크롤 잠금
 */
export const useLockBodyScroll = (): void => {
  useLayoutEffect(() => {
    if (lockCount === 0) {
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        document.body.style.overflow = savedOverflow ?? 'auto';
        savedOverflow = null;
      }
    };
  }, []);
};
