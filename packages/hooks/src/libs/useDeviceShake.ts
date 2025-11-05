import { useCallback, useEffect, useRef, useState } from 'react';

/** 중력가속도(9.8m/s²) 기준으로 설정된 최소 감도 임계값 */
const MIN_SHAKE_THRESHOLD = 12;

interface UseDeviceShakeOptions {
  threshold?: number;
  callback?: () => void;
}

interface UseDeviceShakeReturn {
  isShaking: boolean;
  shakeCount: number;
  permission?: 'default' | 'granted' | 'denied';
  requestPermission: () => Promise<void>;
}

/**
 * `useDeviceShake` 훅은 모바일 기기의 흔들림 동작을 감지하는 훅입니다.
 *
 * - `DeviceMotionEvent` API를 활용하여 가속도 데이터를 기반으로 threshold 이상일 때 흔들림으로 판정합니다.
 * - 흔들림이 감지되면 `shakeCount`를 증가시키고, 선택적으로 `callback`을 실행합니다.
 * - iOS Safari (13+) 환경에서는 반드시 `requestPermission`을 호출해 권한을 요청해야 이벤트를 받을 수 있습니다.
 *
 * @param {UseDeviceShakeOptions} options - threshold(민감도), callback(콜백) 옵션
 * @returns {UseDeviceShakeReturn}
 * - `isShaking`: 현재 흔들림 여부
 * - `shakeCount`: 감지된 흔들림 횟수
 * - `permission`: 현재 권한 상태
 * - `requestPermission`: 권한 요청 함수
 */
export const useDeviceShake = ({ threshold = 15, callback }: UseDeviceShakeOptions): UseDeviceShakeReturn => {
  if (threshold < MIN_SHAKE_THRESHOLD)
    throw new Error(`❌ threshold must be >= ${MIN_SHAKE_THRESHOLD} (gravity baseline ≈ 9.8).`);

  const [isShaking, setIsShaking] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);
  const [permission, setPermission] = useState<'default' | 'granted' | 'denied'>('default');
  const thresholdRef = useRef<number>(threshold);
  const callbackRef = useRef<() => void>(callback);

  /** iOS Safari 권한 요청 */
  const requestPermission = useCallback(async () => {
    const motionEvent = DeviceMotionEvent as typeof DeviceMotionEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };

    if (typeof motionEvent.requestPermission === 'function') {
      try {
        const result = await motionEvent.requestPermission();
        setPermission(result);
      } catch {
        setPermission('denied');
      }
    } else {
      // Android 등 (requestPermission 자체가 없음)
      setPermission('granted');
    }
  }, []);

  useEffect(() => {
    thresholdRef.current = threshold;
  }, [threshold]);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const motionEvent = DeviceMotionEvent as typeof DeviceMotionEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    // Android → mount 시점에 자동 granted
    if (typeof motionEvent?.requestPermission !== 'function') {
      setPermission('granted');
    }
  }, []);

  useEffect(() => {
    if (permission !== 'granted') return;

    let lastShake = 0;

    const handler = (e: DeviceMotionEvent) => {
      const { x = 0, y = 0, z = 0 } = e.accelerationIncludingGravity || {};
      const total = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();

      if (total > thresholdRef.current) {
        setIsShaking(true);

        // 디바운스 걸기
        if (now - lastShake > 500) {
          setShakeCount((prev) => prev + 1);
          callbackRef.current?.();
          lastShake = now;
        }
      } else {
        setIsShaking(false);
      }
    };

    window.addEventListener('devicemotion', handler);
    return () => window.removeEventListener('devicemotion', handler);
  }, [permission]);

  return { isShaking, shakeCount, permission, requestPermission };
};
