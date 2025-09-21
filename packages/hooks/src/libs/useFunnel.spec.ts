// useFunnel.test.tsx
import { act, renderHook } from '@testing-library/react';
import useFunnel from './useFunnel';

const steps = ['Intro', 'Calendar', 'Basic', 'Confirm'] as const;

describe('useFunnel (history: false)', () => {
  it('초기 step은 steps[0] 이다', () => {
    const { result } = renderHook(() => useFunnel(steps, { history: false }));
    expect(result.current.step).toBe('Intro');
  });

  it('next/prev가 내부 상태만으로 이동한다(경계 체크 포함)', () => {
    const { result } = renderHook(() => useFunnel(steps, { history: false }));

    // Intro -> Calendar
    act(() => result.current.next());
    expect(result.current.step).toBe('Calendar');

    // Calendar -> Basic
    act(() => result.current.next());
    expect(result.current.step).toBe('Basic');

    // Basic -> Confirm
    act(() => result.current.next());
    expect(result.current.step).toBe('Confirm');

    // 마지막에서 next는 유지
    act(() => result.current.next());
    expect(result.current.step).toBe('Confirm');

    // prev로 뒤로 이동
    act(() => result.current.prev());
    expect(result.current.step).toBe('Basic');

    // 처음까지 이동 후 prev는 유지
    act(() => result.current.prev()); // Basic -> Calendar
    act(() => result.current.prev()); // Calendar -> Intro
    expect(result.current.step).toBe('Intro');
    act(() => result.current.prev()); // Intro 유지
    expect(result.current.step).toBe('Intro');
  });
});

describe('useFunnel (history: true)', () => {
  const origPush = window.history.pushState;
  const origReplace = window.history.replaceState;
  const origBack = window.history.back;

  let pushSpy: jest.SpyInstance;
  let replaceSpy: jest.SpyInstance;
  let backSpy: jest.SpyInstance;

  beforeEach(() => {
    pushSpy = jest.spyOn(window.history, 'pushState');
    replaceSpy = jest.spyOn(window.history, 'replaceState');
    backSpy = jest.spyOn(window.history, 'back').mockImplementation(() => {});
  });

  afterEach(() => {
    pushSpy.mockRestore();
    replaceSpy.mockRestore();
    backSpy.mockRestore();
    // 안전: 원본 보존 (일부 러너에서 필요)
    window.history.pushState = origPush;
    window.history.replaceState = origReplace;
    window.history.back = origBack;
  });

  it('마운트 시 현재 스텝으로 replaceState가 한 번 호출된다', () => {
    renderHook(() => useFunnel(steps, { history: true }));
    expect(replaceSpy).toHaveBeenCalledTimes(1);
    const stateArg = replaceSpy.mock.calls[0][0];
    expect(stateArg).toEqual({ funnelStep: 'Intro' });
  });

  it('next 호출 시 pushState가 호출되고, state에 다음 스텝이 담긴다', () => {
    const { result } = renderHook(() => useFunnel(steps, { history: true }));

    act(() => result.current.next()); // Intro -> Calendar
    expect(result.current.step).toBe('Calendar');

    expect(pushSpy).toHaveBeenCalledTimes(1);
    expect(pushSpy.mock.calls[0][0]).toEqual({ funnelStep: 'Calendar' });

    act(() => result.current.next()); // Calendar -> Basic
    expect(result.current.step).toBe('Basic');
    expect(pushSpy.mock.calls[1][0]).toEqual({ funnelStep: 'Basic' });
  });

  it('prev 호출 시 window.history.back()이 호출된다', () => {
    const { result } = renderHook(() => useFunnel(steps, { history: true }));
    // 먼저 한 스텝 이동
    act(() => result.current.next());
    expect(result.current.step).toBe('Calendar');

    act(() => result.current.prev());
    expect(backSpy).toHaveBeenCalledTimes(1);
  });

  it('popstate 이벤트로 step이 변경된다', () => {
    const { result } = renderHook(() => useFunnel(steps, { history: true }));

    // Calendar로 한 스텝 이동해 pushState를 남김
    act(() => result.current.next());
    expect(result.current.step).toBe('Calendar');

    // popstate로 Intro로 회귀 시뮬레이션
    act(() => {
      const event = new PopStateEvent('popstate', { state: { funnelStep: 'Intro' } });
      window.dispatchEvent(event);
    });

    expect(result.current.step).toBe('Intro');
  });
});

describe('useFunnel (공통 동작)', () => {
  it('setStep으로 특정 스텝으로 이동할 수 있다', () => {
    const { result } = renderHook(() => useFunnel(steps, { history: false }));

    act(() => result.current.setStep('Basic'));
    expect(result.current.step).toBe('Basic');

    act(() => result.current.setStep('Intro'));
    expect(result.current.step).toBe('Intro');
  });
});
