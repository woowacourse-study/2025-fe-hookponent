import { act, renderHook } from '@testing-library/react';
import { useProgress } from './useProgress';

describe('useProgress', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('애니메이션이 실행되기 전, 프로그래스바에 초기 진행률(initialProgress)이 반영되어야 한다.', () => {
    // given : initialProgress: 30
    const initialProgress = 30;

    // when : 애니메이션이 실행되기 전애
    const { result } = renderHook(() => useProgress({ initialProgress }));

    // then : 프로그래스바에 initialProgress가 반영되어야 한다.
    expect(result.current.progress).toBe(initialProgress);
  });

  it('애니메이션이 실행되고 난 뒤, 프로그래스바에 목표 진행률(targetProgress)이 반영되어야 한다.', () => {
    // given : initialProgress: 0, targetProgress: 80, duration: 1000
    const initialProgress = 0;
    const targetProgress = 80;
    const duration = 100;

    // when : duration 동안 애니메이션이 진행되고 나면 (default duration: 5000ms)
    const { result } = renderHook(() => useProgress({ initialProgress, targetProgress, duration }));

    act(() => {
      jest.advanceTimersByTime(duration + 20);
    });

    // then : 목표 진행률이 반영되어야 한다.
    expect(result.current.progress).toBe(targetProgress);
  });

  it('완료 함수(complete)를 실행시킬 경우, 로직 상태(progress)가 100%로 돌아가야한다.', () => {
    // given : initialProgress: 30, completeDuration: 500
    const initialProgress = 30;
    const completeDuration = 500; // useProgress 내부의 PROGRESS_COMPLETE_DURATION 값

    // when : 완료 함수를 실행시키고 completeDuration 동안 애니메이션이 진행되고 나면 (default completeDuration: 500ms)
    const { result } = renderHook(() => useProgress({ initialProgress }));

    act(() => {
      result.current.complete();
      jest.advanceTimersByTime(completeDuration + 20);
    });

    // then : 로직 상태(progress)가 100%로 돌아가야한다.
    expect(result.current.progress).toBe(100);
  });
});
