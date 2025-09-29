import { act, renderHook } from '@testing-library/react';
import { useDeviceShake } from './useDeviceShake';

describe('useDeviceShake', () => {
  beforeAll(() => {
    class MockDeviceMotionEvent extends Event {
      accelerationIncludingGravity?: { x?: number; y?: number; z?: number };
      static requestPermission?: () => Promise<'granted' | 'denied'>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      constructor(type: string, init?: any) {
        super(type, init);
        this.accelerationIncludingGravity = init?.accelerationIncludingGravity;
      }
    }

    // 전역에 주입
    // @ts-expect-error: 테스트 환경에서만 주입
    global.DeviceMotionEvent = MockDeviceMotionEvent;
  });

  beforeEach(() => {
    // Safari 환경 흉내: requestPermission 없는 경우
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (DeviceMotionEvent as any).requestPermission = undefined;
  });

  it('기본값으로 초기화된다', () => {
    const { result } = renderHook(() => useDeviceShake({}));
    expect(result.current.isShaking).toBe(false);
    expect(result.current.shakeCount).toBe(0);
    expect(result.current.permission).toBe('default');
  });

  it('requestPermission이 호출되면 permission이 granted로 바뀐다 (Android/desktop)', async () => {
    const { result } = renderHook(() => useDeviceShake({ threshold: 15 }));

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(result.current.permission).toBe('granted');
  });

  it('흔들림이 감지되면 shakeCount가 증가하고 callback이 호출된다', async () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useDeviceShake({ threshold: 12, callback: mockCallback }));

    await act(async () => {
      await result.current.requestPermission();
    });

    const event = new DeviceMotionEvent('devicemotion', {
      accelerationIncludingGravity: { x: 20, y: 0, z: 0 },
    });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(result.current.isShaking).toBe(true);
    expect(result.current.shakeCount).toBe(1);
    expect(mockCallback).toHaveBeenCalled();
  });

  it('threshold보다 낮으면 흔들림으로 감지되지 않는다', async () => {
    const { result } = renderHook(() => useDeviceShake({ threshold: 20 }));

    await act(async () => {
      await result.current.requestPermission();
    });

    const event = new DeviceMotionEvent('devicemotion', {
      accelerationIncludingGravity: { x: 5, y: 5, z: 5 }, // sqrt(75) ≈ 8.6 < 20
    });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(result.current.isShaking).toBe(false);
    expect(result.current.shakeCount).toBe(0);
  });

  it('500ms 디바운스 내에서는 카운트가 중복되지 않는다', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useDeviceShake({ threshold: 12 }));

    await act(async () => {
      await result.current.requestPermission();
    });

    const event = new DeviceMotionEvent('devicemotion', {
      accelerationIncludingGravity: { x: 20, y: 0, z: 0 },
    });

    act(() => {
      window.dispatchEvent(event);
      window.dispatchEvent(event);
    });

    expect(result.current.shakeCount).toBe(1);

    act(() => {
      jest.advanceTimersByTime(600);
      window.dispatchEvent(event);
    });

    expect(result.current.shakeCount).toBe(2);
    jest.useRealTimers();
  });

  it('iOS Safari: requestPermission이 granted를 반환하면 permission 상태가 갱신된다', async () => {
    // requestPermission 모킹
    (DeviceMotionEvent as unknown as { requestPermission: () => Promise<'granted'> }).requestPermission = jest
      .fn()
      .mockResolvedValue('granted');

    const { result } = renderHook(() => useDeviceShake({ threshold: 15 }));

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(result.current.permission).toBe('granted');
    expect((DeviceMotionEvent as unknown as { requestPermission: jest.Mock }).requestPermission).toHaveBeenCalled();
  });

  it('iOS Safari: requestPermission이 denied를 반환하면 permission 상태가 갱신된다', async () => {
    // requestPermission 모킹
    (DeviceMotionEvent as unknown as { requestPermission: () => Promise<'denied'> }).requestPermission = jest
      .fn()
      .mockResolvedValue('denied');

    const { result } = renderHook(() => useDeviceShake({ threshold: 15 }));

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(result.current.permission).toBe('denied');
  });
});
