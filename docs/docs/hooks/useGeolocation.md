# useGeolocation

`useGeolocation`은 브라우저의 Geolocation API를 사용하여 사용자의 현재 위치를 가져오거나 추적(watch) 하는 커스텀 React 훅입니다.

위도(`latitude`), 경도(`longitude`) 등 좌표 정보를 손쉽게 얻을 수 있으며,
옵션에 따라 한 번만 위치를 가져오거나(`getCurrentPosition`), 지속적으로 위치를 추적(`watchPosition`) 할 수 있습니다.

## 🔗 사용법

```tsx
const { coords, loading, error } = useGeolocation(options);
```

### 매개변수

| 이름                 | 타입      | 기본값     | 설명                                                                      |
| -------------------- | --------- | ---------- | ------------------------------------------------------------------------- |
| `watch`              | `boolean` | `false`    | 위치 변화를 지속적으로 감지할지 여부(`true`일 경우 `watchPosition` 사용)  |
| `maximumAge`         | `number`  | `0`        | 캐시된 위치 정보를 허용할 최대 시간(ms 단위)`0`이면 항상 최신 위치를 요청 |
| `timeout`            | `number`  | `Infinity` | 위치 요청이 실패로 간주되기 전까지의 대기 시간(ms 단위)                   |
| `enableHighAccuracy` | `boolean` | `false`    | 고정밀 모드 사용 여부(GPS 등 고성능 센서 활용, 배터리 소모 증가 가능)     |

### 반환값

| 이름      | 타입                               | 설명                                                             |
| --------- | ---------------------------------- | ---------------------------------------------------------------- |
| `coords`  | `GeolocationCoordinates \| null`   | 사용자의 현재 좌표 정보 (`latitude`, `longitude`, `accuracy` 등) |
| `loading` | `boolean`                          | 현재 위치 요청이 진행 중인지 여부                                |
| `error`   | `GeolocationPositionError \| null` | 권한 거부, 타임아웃, 지원 불가 등의 에러 정보                    |

## ✅ 예시

### 1. 현재 위치 한 번만 가져오기

```tsx
import React, { useEffect } from 'react';
import { useGeolocation } from './useGeolocation';

function CurrentLocation() {
  const { coords, loading, error } = useGeolocation();

  useEffect(() => {
    if (coords) {
      console.log('현재 위치:', coords.latitude, coords.longitude);
    }
  }, [coords]);

  if (loading) return <p>위치를 가져오는 중...</p>;
  if (error) return <p>에러: {error.message}</p>;

  return (
    <div>
      <p>위도: {coords?.latitude}</p>
      <p>경도: {coords?.longitude}</p>
    </div>
  );
}
```

### 2. 지속적으로 위치 추적하기 (예: 이동 중 사용자 위치 갱신)

```tsx
import React, { useEffect } from 'react';
import { useGeolocation } from './useGeolocation';

function MovingTracker() {
  const { coords, error } = useGeolocation({
    watch: true,
    enableHighAccuracy: true,
  });

  useEffect(() => {
    if (coords) {
      console.log('위치가 변경되었습니다:', coords.latitude, coords.longitude);
    }
  }, [coords]);

  if (error) return <p>에러: {error.message}</p>;

  return (
    <div>
      <h3>실시간 위치 추적 중...</h3>
      <p>위도: {coords?.latitude ?? '-'}</p>
      <p>경도: {coords?.longitude ?? '-'}</p>
    </div>
  );
}
```

### 3. 위치 권한 거부 처리

```tsx
import React from 'react';
import { useGeolocation } from './useGeolocation';

function PermissionCheck() {
  const { error } = useGeolocation();

  if (error?.code === 1) {
    return <p>❌ 위치 접근이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.</p>;
  }

  return <p>위치 정보 요청 중...</p>;
}
```

## 📋 주의사항

- navigator.geolocation은 HTTPS 환경에서만 작동합니다. (로컬 개발 시 localhost는 예외적으로 허용됩니다.)
- 일부 데스크톱 브라우저에서는 위치 추적(watchPosition)이 느리거나 동작하지 않을 수 있습니다.
- enableHighAccuracy 옵션을 활성화하면 정확도는 높아지지만, 배터리 소모가 증가할 수 있습니다.
- maximumAge를 활용하면 동일한 위치 요청이 반복될 때 캐시된 데이터를 재사용할 수 있습니다.
- error.code 값은 다음과 같습니다:
  | 코드 | 상수명 | 설명 |
  | --- | ---------------------- | ------------------ |
  | `1` | `PERMISSION_DENIED` | 사용자가 위치 정보 접근을 거부함 |
  | `2` | `POSITION_UNAVAILABLE` | 위치 정보를 가져올 수 없음 |
  | `3` | `TIMEOUT` | 요청 제한 시간을 초과함 |

## 🧩 관련 API

- [MDN Web Docs – Geolocation API](https://developer.mozilla.org/ko/docs/Web/API/Geolocation_API)
- [GeolocationPosition](https://developer.mozilla.org/ko/docs/Web/API/GeolocationPosition)
- [GeolocationCoordinates](https://developer.mozilla.org/ko/docs/Web/API/GeolocationCoordinates)
- [GeolocationPositionError](https://developer.mozilla.org/ko/docs/Web/API/GeolocationPositionError)
