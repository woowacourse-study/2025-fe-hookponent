import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom'; // 명시적으로 import 추가
import { Motion } from './Motion';

describe('Motion Component', () => {
  let requestAnimationFrameSpy: jest.SpyInstance;

  // 실제 시간이 흐르는 것을 시뮬레이션하기 위한 헬퍼 함수
  const advanceTimersByTime = (ms: number) => {
    act(() => {
      jest.advanceTimersByTime(ms);
    });
  };

  beforeEach(() => {
    // requestAnimationFrame 모킹
    jest.useFakeTimers();
    requestAnimationFrameSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => setTimeout(callback, 16) as unknown as number);
  });

  afterEach(() => {
    requestAnimationFrameSpy.mockRestore();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('기본 렌더링 테스트', () => {
    it('Motion.div가 올바르게 렌더링되어야 한다', () => {
      const { container } = render(<Motion.div>테스트</Motion.div>);
      expect(container.firstChild).toBeTruthy();
      expect(container.firstChild?.textContent).toBe('테스트');
    });

    it('사용자 정의 className이 적용되어야 한다', () => {
      const { container } = render(<Motion.div className="test-class">테스트</Motion.div>);
      expect(container.firstChild).toHaveClass('test-class');
    });

    it('사용자 정의 style이 적용되어야 한다', () => {
      const { container } = render(<Motion.div style={{ backgroundColor: 'red' }}>테스트</Motion.div>);
      const element = container.firstChild as HTMLElement;
      expect(element.style.backgroundColor).toBe('red');
    });
  });

  describe('애니메이션 동작 테스트', () => {
    let now = 0;

    beforeEach(() => {
      now = 0;
      // 시간을 시뮬레이션하기 위한 mock
      jest.spyOn(performance, 'now').mockImplementation(() => now);
    });

    const advanceFrame = (ms: number) => {
      act(() => {
        // 현재 시간 진행
        now += ms;
        // 애니메이션 프레임 실행
        jest.advanceTimersByTime(16); // RAF 간격
        jest.runOnlyPendingTimers();
      });
    };

    beforeEach(() => {
      // RAF 모킹 설정
      jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        return setTimeout(() => callback(now), 16) as unknown as number;
      });
    });

    it('기본 회전 애니메이션이 적용되어야 한다', () => {
      const { container } = render(<Motion.div animate={{ rotate: 180 }} transition={{ duration: 1 }} />);
      const element = container.firstChild as HTMLElement;

      // 초기 렌더링 후 첫 프레임
      advanceFrame(16);
      expect(element.style.transform).toBe('rotate(0deg)');

      // 중간 상태 (약 50%)
      advanceFrame(250); // 500ms까지
      expect(element.style.transform).toBe('rotate(45deg)');

      // 최종 상태 (100%)
      advanceFrame(1000); // 1000ms까지
      expect(element.style.transform).toBe('rotate(45deg)');
    });

    it('애니메이션이 없을 때는 transform이 적용되지 않아야 한다', () => {
      const { container } = render(<Motion.div />);
      const element = container.firstChild as HTMLElement;

      advanceTimersByTime(1000);
      expect(element.style.transform).toBe('');
    });
  });

  describe('ref 전달 테스트', () => {
    it('ref가 올바르게 전달되어야 한다', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Motion.div ref={ref}>테스트</Motion.div>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('ref를 통해 DOM에 접근할 수 있어야 한다', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Motion.div ref={ref} data-testid="motion-div">
          테스트
        </Motion.div>
      );

      expect(ref.current?.getAttribute('data-testid')).toBe('motion-div');
    });
  });

  describe('cleanup 테스트', () => {
    it('컴포넌트 언마운트 시 애니메이션이 정리되어야 한다', () => {
      // requestAnimationFrame과 cancelAnimationFrame을 모두 모킹
      const animationFrameId = 1;
      jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        setTimeout(() => cb(performance.now()), 0);
        return animationFrameId;
      });

      const cancelAnimationFrameSpy = jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});

      const { unmount } = render(<Motion.div animate={{ rotate: 180 }} transition={{ duration: 1 }} />);

      unmount();
      expect(cancelAnimationFrameSpy).toHaveBeenCalledWith(animationFrameId);
    });
  });
});
