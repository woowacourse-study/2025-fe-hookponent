import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 프로그레스바 최소 상태 값 (0%)
 */
const PROGRESS_MIN_VALUE = 0;
/**
 * 프로그레스바 최대 상태 값 (100%)
 */
const PROGRESS_MAX_VALUE = 100;

/**
 * 프로그레스바 애니메이션 완료 시간 (밀리초)
 */
const PROGRESS_COMPLETE_DURATION = 500;

/**
 * useProgress 훅의 매개변수 타입
 */
type UseProgressParams = {
  duration?: number;
  initialProgress?: number;
  targetProgress?: number;
};

/**
 * useProgress 훅의 반환 타입
 */
type UseProgressReturns = {
  progress: number;
  complete: () => void;
};

/**
 * Progress bar 애니메이션을 위한 커스텀 훅
 *
 * 프로그레스바의 진행 상태를 관리하고 부드러운 애니메이션을 제공합니다.
 * 일반 진행과 완료 시 모두 requestAnimationFrame을 사용하여 최적화된 애니메이션을 구현합니다.
 *
 * @param {Object} props - 프로그레스 설정 옵션
 * @param {number} [props.duration=5000] - 일반 진행 시 애니메이션 시간 (밀리초)
 * @param {number} [props.initialProgress=PROGRESS_MIN_VALUE] - 시작 진행률 (기본값: 0%)
 * @param {number} [props.targetProgress=PROGRESS_MAX_VALUE] - 목표 진행률 (기본값: 100%)
 *
 * @returns {Object} 프로그레스 상태와 컨트롤 함수
 * @returns {number} returns.progress - 현재 진행률 (PROGRESS_MIN_VALUE ~ PROGRESS_MAX_VALUE)
 * @returns {() => void} returns.complete - 프로그레스를 즉시 PROGRESS_MAX_VALUE로 완료하는 함수 (PROGRESS_COMPLETE_DURATION ms 동안 애니메이션)
 */
export const useProgress = ({
  duration = 5000,
  initialProgress = PROGRESS_MIN_VALUE,
  targetProgress = PROGRESS_MAX_VALUE,
}: UseProgressParams = {}): UseProgressReturns => {
  /**
   * 현재 진행률 상태
   * initialProgress에서 시작하여 애니메이션에 따라 업데이트됩니다.
   */
  const [progress, setProgress] = useState(initialProgress);

  /**
   * requestAnimationFrame의 ID를 저장하는 ref
   * 애니메이션 취소 시 사용되며, 메모리 누수 방지를 위해 관리됩니다.
   */
  const animationRef = useRef<number>(null);

  /**
   * 애니메이션 시작 시간을 저장하는 ref
   * performance.now()의 값을 저장하여 경과 시간 계산에 사용됩니다.
   */
  const startTimeRef = useRef<number>(0);

  /**
   * 프로그레스바 애니메이션을 처리하는 함수
   * requestAnimationFrame을 사용하여 부드러운 애니메이션을 구현합니다.
   *
   * @param {number} from - 시작 진행률
   * @param {number} to - 목표 진행률
   * @param {number} duration - 애니메이션 지속 시간 (밀리초)
   */
  const animate = useCallback((duration: number, from: number, to: number) => {
    startTimeRef.current = performance.now();
    const startProgress = from;

    /**
     * 각 애니메이션 프레임에서 실행되는 함수
     * cubic easing을 적용하여 자연스러운 진행을 구현합니다.
     *
     * @param {number} currentTime - 현재 시간 (performance.now()의 반환값)
     */
    const animationFrame = (currentTime: number) => {
      setProgress((currentProgress) => {
        if (currentProgress === to) return currentProgress;

        // 1. 시간 계산
        const elapsed = currentTime - startTimeRef.current;

        // 2. 애니메이션 완료 체크
        if (elapsed >= duration) {
          return to;
        }

        // 3. 진행률 계산 및 애니메이션 적용
        const ratio = elapsed / duration;
        const easedProgress = startProgress + (to - startProgress) * (1 - Math.pow(1 - ratio, 3));
        const easedProgressNumber = Math.floor(easedProgress * 1000) / 1000;
        return easedProgressNumber;
      });

      // 4. 다음 프레임 예약
      animationRef.current = requestAnimationFrame(animationFrame);
    };

    // 애니메이션 시작
    animationRef.current = requestAnimationFrame(animationFrame);
  }, []);

  /**
   * 프로그레스바의 기본 진행 애니메이션을 처리하는 effect
   * 주의: 이미 PROGRESS_MAX_VALUE에 도달한 경우 애니메이션을 시작하지 않습니다.
   */
  useEffect(() => {
    /**
     * 매개변수 유효성 검사
     * duration이 0 이하인 경우 에러 발생합니다.
     * initialProgress가 PROGRESS_MIN_VALUE 미만 또는 PROGRESS_MAX_VALUE 초과인 경우 에러 발생
     * - targetProgress가 PROGRESS_MIN_VALUE 미만 또는 PROGRESS_MAX_VALUE 초과인 경우 에러 발생
     */
    if (duration <= 0) {
      throw new Error('duration must be greater than 0');
    }

    if (initialProgress < PROGRESS_MIN_VALUE || initialProgress > PROGRESS_MAX_VALUE) {
      throw new Error(`Initial progress must be between ${PROGRESS_MIN_VALUE} and ${PROGRESS_MAX_VALUE}`);
    }

    if (targetProgress < PROGRESS_MIN_VALUE || targetProgress > PROGRESS_MAX_VALUE) {
      throw new Error(`Target progress must be between ${PROGRESS_MIN_VALUE} and ${PROGRESS_MAX_VALUE}`);
    }

    if (progress !== PROGRESS_MAX_VALUE) {
      animate(duration, initialProgress, targetProgress);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * 프로그레스바를 즉시 완료 상태로 전환하는 함수
   * 현재 진행률에서 PROGRESS_MAX_VALUE까지 PROGRESS_COMPLETE_DURATION 동안 애니메이션을 실행합니다.
   *
   * 주의:
   * - 이미 PROGRESS_MAX_VALUE인 경우 아무 동작도 하지 않습니다.
   * - 실행 중인 기존 애니메이션은 취소됩니다.
   */
  const complete = useCallback(() => {
    setProgress((currentProgress) => {
      if (currentProgress === PROGRESS_MAX_VALUE) return currentProgress;

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      animate(PROGRESS_COMPLETE_DURATION, currentProgress, PROGRESS_MAX_VALUE);
      return currentProgress;
    });
  }, [animate]);

  return {
    progress,
    complete,
  };
};
