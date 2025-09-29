import { useEffect, useMemo, useState } from 'react';

interface UseGeolocationOptions {
  watch?: boolean;
  maximumAge?: number;
  timeout?: number;
  enableHighAccuracy?: boolean;
}

interface UseGeolocationReturns {
  coords: GeolocationCoordinates | null; // 위도/경도 등 좌표 정보
  loading: boolean; // 현재 위치 요청 중 여부
  error: GeolocationPositionError | null; // 권한 거부, 타임아웃 등 에러
}

export function useGeolocation({
  watch = false,
  maximumAge = 0,
  timeout = Infinity,
  enableHighAccuracy = false,
}: UseGeolocationOptions = {}): UseGeolocationReturns {
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const loading = useMemo(() => coords === null && error === null, [coords, error]);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError({ code: 0, message: 'Geolocation is not supported by this browser.' } as GeolocationPositionError);
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setCoords(position.coords);
    };

    const onError = (err: GeolocationPositionError) => {
      setError(err);
    };

    const options = {
      maximumAge,
      timeout,
      enableHighAccuracy,
    };
    console.log(options);

    if (watch) {
      const id = navigator.geolocation.watchPosition(onSuccess, onError, options);
      return () => navigator.geolocation.clearWatch(id);
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    }
  }, [enableHighAccuracy, maximumAge, timeout, watch]);

  return { coords, loading, error };
}
