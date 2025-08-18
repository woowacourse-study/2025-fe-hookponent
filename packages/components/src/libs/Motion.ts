import React, { forwardRef, useEffect, useRef, JSX } from 'react';

// 애니메이션 속성 타입 정의
type AnimateProps = {
  rotate?: number; // 회전 각도 (degree 단위)
};

// 트랜지션 설정 타입 정의
type TransitionProps = {
  duration?: number; // 애니메이션 지속 시간 (초 단위)
  repeat?: number | 'Infinity'; // 반복 횟수 (숫자 또는 무한반복)
  ease?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'; // 가속도 타입
  repeatDelay?: number; // 반복 사이 지연 시간 (초 단위)
};

type MotionProps<T extends keyof JSX.IntrinsicElements> = React.ComponentPropsWithRef<T> & {
  animate?: AnimateProps;
  transition?: TransitionProps;
};

// Motion 컴포넌트 생성 함수
const createMotionComponent = <T extends HTMLElement>(Component: keyof JSX.IntrinsicElements) => {
  const MotionComponent = forwardRef<T, MotionProps<typeof Component>>(
    ({ animate, transition, style, ...props }, ref) => {
      const elementRef = useRef<T>(null);

      useEffect(() => {
        const element = ref ? (ref as React.RefObject<T>).current : elementRef.current;
        if (!element || !animate?.rotate) return;

        const { duration = 1, repeat = 1, ease = 'linear', repeatDelay = 0 } = transition || {};

        const isInfinite = repeat === 'Infinity'; // 무한 반복 여부를 체크하는 변수
        let iteration = 0; // 현재까지 실행된 애니메이션 반복 횟수를 카운트
        let startTime: number | null = null; // 애니메이션이 시작된 시점의 타임스탬프
        let delayStartTime: number | null = null; // 반복 사이의 딜레이가 시작된 시점의 타임스탬프
        let isInDelay = false; // 현재 딜레이 중인지 여부를 나타내는 플래그
        let animationFrameId: number; // requestAnimationFrame의 ID를 저장하는 변수 (애니메이션 정리(cleanup)에 사용)

        const animateFrame = (currentTime: number) => {
          // 1. 첫 프레임인 경우 시작 시간 설정
          if (!startTime) startTime = currentTime;

          // 2. 딜레이 상태 체크 및 처리
          if (isInDelay) {
            // 2-1. 딜레이가 처음 시작되는 경우
            if (!delayStartTime) delayStartTime = currentTime;
            // 2-2. 딜레이 경과 시간 계산
            const delayElapsed = currentTime - delayStartTime;

            // 2-3. 설정된 딜레이 시간이 지났는지 체크 (repeatDelay는 초 단위라서 1000을 곱함)
            if (delayElapsed >= repeatDelay * 1000) {
              // 딜레이가 끝난 경우:
              isInDelay = false; // 딜레이 상태 해제
              delayStartTime = null; // 딜레이 시작 시간 초기화
              startTime = currentTime; // 새로운 애니메이션 시작 시간 설정
            } else {
              // 아직 딜레이 중인 경우:
              // 다음 프레임 요청하고 현재 프레임 처리 종료
              animationFrameId = requestAnimationFrame(animateFrame);
              return;
            }
          }

          // 애니메이션의 진행 상태를 계산하고 적용하는 부분
          const elapsed = currentTime - startTime;
          const animationDuration = duration * 1000;

          // 한 주기의 애니메이션이 완료되었는지 체크
          if (elapsed >= animationDuration) {
            iteration++; // 반복 횟수 증가

            // 무한 반복이 아니고 설정된 반복 횟수를 초과한 경우:
            if (!isInfinite && iteration >= (repeat as number)) {
              return;
            }

            // 다음 반복을 위한 초기화
            isInDelay = true;
            startTime = null;
            element.style.transform = `rotate(0deg)`;
          } else {
            // 현재 애니메이션 진행률 계산 및 적용
            const progress = elapsed / animationDuration;
            const rotation = progress * (animate.rotate || 0);
            element.style.transform = `rotate(${rotation}deg)`;
          }

          // 트랜지션 효과 적용 (부드러운 움직임을 위한 CSS 트랜지션)
          element.style.transition = `transform ${ease}`;
          animationFrameId = requestAnimationFrame(animateFrame);
        };

        // 최초 애니메이션 프레임 시작
        animationFrameId = requestAnimationFrame(animateFrame);

        // cleanup 함수 - 컴포넌트가 언마운트되거나 의존성이 변경될 때 실행
        return () => {
          cancelAnimationFrame(animationFrameId); // 진행 중인 애니메이션 정리
        };
      }, [animate, transition, ref]);

      // 최종적으로 컴포넌트 렌더링
      return React.createElement(Component, {
        ref: ref || elementRef, // 사용자가 전달한 ref 또는 내부 ref 사용
        style: { ...style }, // 사용자가 전달한 스타일 전달
        ...props, // 나머지 props 전달 (className 등)
      });
    }
  );

  // React DevTools 에서 컴포넌트를 더 쉽게 식별하기 위해 displayName 설정
  MotionComponent.displayName = `Motion${(Component as string).charAt(0).toUpperCase() + (Component as string).slice(1)}`;
  return MotionComponent;
};

export const Motion = {
  div: createMotionComponent<HTMLDivElement>('div'),
  span: createMotionComponent<HTMLSpanElement>('span'),
  img: createMotionComponent<HTMLImageElement>('img'),
  p: createMotionComponent<HTMLParagraphElement>('p'),
  button: createMotionComponent<HTMLButtonElement>('button'),
};
