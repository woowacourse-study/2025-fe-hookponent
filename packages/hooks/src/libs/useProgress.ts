import { useEffect, useRef, useState } from 'react';

/**
 * useProgress 훅의 props 타입
 */
type UseProgressProps = {
  duration?: number;
  initialProgress?: number;
  targetProgress?: number;
};

/**
 * useProgress 훅의 반환 타입
 */
type UseProgressReturn = {
  progress: number;
  complete: () => void;
};

/**
 * Progress bar 애니메이션을 위한 커스텀 훅
 *
 *
 * @param {Object} props - 프로그레스 설정 옵션
 * @param {number} [props.duration=5000] - 애니메이션 진행 시간 (밀리초)
 * @param {number} [props.initialProgress=0] - 시작 진행률 (0-100)
 * @param {number} [props.targetProgress=90] - 목표 진행률 (0-100)
 *
 * @returns {Object} 프로그레스 상태와 컨트롤 함수
 * @returns {number} returns.progress - 현재 진행률 (0-100)
 * @returns {() => void} returns.complete - 프로그레스를 100%로 완료하는 함수
 */
export const useProgress = ({
  duration = 5000,
  initialProgress = 0,
  targetProgress = 90,
}: UseProgressProps = {}): UseProgressReturn => {
  // 현재 진행률을 관리하는 상태
  const [progress, setProgress] = useState(initialProgress);

  // requestAnimationFrame ID를 저장하는 ref
  const animationRef = useRef<number>(null);

  // 애니메이션 시작 시간을 저장하는 ref
  const startTimeRef = useRef<number>(0);

  // 마지막으로 업데이트된 진행률을 저장하는 ref (렌더링 최적화용)
  const lastProgressRef = useRef<number>(initialProgress);

  useEffect(() => {
    // 애니메이션 시작 시간 초기화
    startTimeRef.current = performance.now();
    lastProgressRef.current = initialProgress;

    /**
     * 각 애니메이션 프레임에서 실행되는 함수
     * @param {number} currentTime - 현재 시간 (performance.now()의 반환값)
     */
    const animationFrame = (currentTime: number) => {
      // 경과 시간 계산
      const elapsed = currentTime - startTimeRef.current;

      // 설정된 시간이 지나면 목표 진행률로 설정하고 애니메이션 종료
      if (elapsed >= duration) {
        setProgress(targetProgress);
        return;
      }

      // 진행률 계산
      const ratio = elapsed / duration;
      // cubic easing 함수를 사용하여 부드러운 애니메이션 구현
      const easedProgress = targetProgress * (1 - Math.pow(1 - ratio, 3));

      // 진행률이 1% 이상 변경되었을 때만 상태 업데이트 (렌더링 최적화)
      if (Math.abs(lastProgressRef.current - easedProgress) > 1) {
        lastProgressRef.current = easedProgress;
        setProgress(easedProgress);
      }

      // 다음 애니메이션 프레임 요청
      animationRef.current = requestAnimationFrame(animationFrame);
    };

    // 첫 애니메이션 프레임 요청
    animationRef.current = requestAnimationFrame(animationFrame);

    // cleanup 함수: 컴포넌트 언마운트 또는 의존성 변경 시 실행
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [duration, targetProgress]);

  /**
   * 프로그레스바를 즉시 100%로 완료하는 함수
   */
  const complete = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    lastProgressRef.current = 100;
    setProgress(100);
  };

  return {
    progress,
    complete,
  };
};
