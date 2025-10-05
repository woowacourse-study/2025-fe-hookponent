import { useEffect, useMemo, useState } from 'react';

interface UseGeolocationOptions {
  watch?: boolean;
  maximumAge?: number;
  timeout?: number;
  enableHighAccuracy?: boolean;
}

interface UseGeolocationReturns {
  isSupported: boolean; // Geolocation API 지원 여부
  coords: GeolocationCoordinates | null; // 위도/경도 등 좌표 정보
  loading: boolean; // 현재 위치 요청 중 여부
  error: GeolocationPositionError | null; // 권한 거부, 타임아웃 등 에러
}

/**
 * `useGeolocation` 훅은 사용자의 현재 위치 정보를 가져오거나 추적(watch)하는 React 훅입니다.
 *
 * - 브라우저의 Geolocation API를 사용하여 사용자의 위도, 경도 등의 위치 정보를 제공합니다.
 * - `watch` 옵션을 활성화하면 사용자의 위치가 변경될 때마다 자동으로 갱신됩니다.
 * - `getCurrentPosition`과 `watchPosition`을 상황에 따라 선택적으로 사용하며,
 *   권한 거부, 타임아웃 등의 에러 상태도 함께 반환합니다.
 * - `enableHighAccuracy`, `timeout`, `maximumAge` 등의 옵션을 통해 위치 요청의 정밀도 및 성능을 제어할 수 있습니다.
 *
 * @param {Object} [options] - 위치 요청 시 사용할 설정 옵션
 * @param {boolean} [options.watch=false] - 위치 변화를 지속적으로 감지할지 여부 (`true` 시 `watchPosition` 사용)
 * @param {number} [options.maximumAge=0] - 캐시된 위치 정보를 허용할 최대 시간(ms 단위)
 * @param {number} [options.timeout=Infinity] - 위치 요청이 실패로 간주되기 전까지의 대기 시간(ms 단위)
 * @param {boolean} [options.enableHighAccuracy=false] - 고정밀 모드 사용 여부 (GPS 등 고성능 센서 활용)
 *
 * @returns {Object} - 위치 정보 및 상태를 담은 객체
 * @returns {boolean} return.isSupported - 브라우저가 Geolocation API를 지원하는지 여부
 * @returns {GeolocationCoordinates | null} return.coords - 사용자의 위도, 경도 등 위치 좌표 정보
 * @returns {boolean} return.loading - 현재 위치 요청이 진행 중인지 여부 (`true`: 로딩 중)
 * @returns {GeolocationPositionError | null} return.error - 위치 요청 중 발생한 에러 정보
 *
 * @example
 * ```tsx
 * // 단 한 번 현재 위치 가져오기
 * const { coords, loading, error } = useGeolocation();
 *
 * // 지속적으로 위치 추적 (예: 지도 이동 감지)
 * const { coords } = useGeolocation({ watch: true, enableHighAccuracy: true });
 *
 * useEffect(() => {
 *   if (coords) {
 *     console.log('현재 위치:', coords.latitude, coords.longitude);
 *   }
 *   if (error) {
 *     console.error('위치 정보를 가져오지 못했습니다:', error.message);
 *   }
 * }, [coords, error]);
 * ```
 */
export function useGeolocation({
  watch = false,
  maximumAge = 0,
  timeout = Infinity,
  enableHighAccuracy = false,
}: UseGeolocationOptions = {}): UseGeolocationReturns {
  const [isSupported, setIsSupported] = useState(true);
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const loading = useMemo(() => isSupported && coords === null && error === null, [coords, error, isSupported]);

  useEffect(() => {
    if (!('geolocation' in navigator) || !navigator.geolocation) {
      setIsSupported(false);
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setCoords(position.coords);
      setError(null);
    };

    const onError = (err: GeolocationPositionError) => {
      setError(err);
    };

    const options = {
      maximumAge,
      timeout,
      enableHighAccuracy,
    };

    if (watch) {
      const id = navigator.geolocation.watchPosition(onSuccess, onError, options);
      return () => navigator.geolocation.clearWatch(id);
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    }
  }, [enableHighAccuracy, maximumAge, timeout, watch]);

  return { isSupported, coords, loading, error };
}
