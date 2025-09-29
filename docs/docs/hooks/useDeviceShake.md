# useDeviceShake

**모바일** 기기의 흔들림 동작을 감지해 상태를 반환하고, 필요 시 콜백을 실행할 수 있는 커스텀 React Hook입니다.

- 가속도 센서를 기반으로 흔들림을 감지합니다.
- threshold(임계값)를 조절해 흔들림 감지 민감도를 설정할 수 있습니다.
- 흔들림 횟수(`shakeCount`)와 현재 흔들림 여부(`isShaking`)를 제공합니다.
- iOS Safari(13+) 환경에서는 권한 요청(`requestPermission`)을 반드시 거쳐야 이벤트를 받을 수 있습니다.
- Android/Chrome/데스크탑 환경에서는 권한 요청이 필요 없으며, 자동으로 'granted' 상태가 됩니다.

<div
  style={{
    border: '1px solid #f5c2c7',
    padding: '12px',
    borderRadius: '6px',
    background: '#f8d7da',
    color: '#842029',
  }}
>
  ⚠️ <strong>주의</strong><br  style={{
   height:'0'
  }}/>
  <span>데스크탑 브라우저에서는 동작하지않습니다.</span><br  style={{
   height:'0'
  }}/>
<code>DeviceMotionEvent</code>를 지원하지 않으며, 가속도 센서가 없어 이벤트가 발생하지 않습니다.<br /><br />
🌐 <strong>환경 제한</strong> <br /> 개발 환경(Localhost)에서는 센서 권한 요청이 동작하지 않습니다.  <br />
반드시 <code>https</code> 환경에서 실행해야 정상적으로 동작합니다.
</div>

---

## 🔗 사용법

```tsx
const { isShaking, shakeCount, permission, requestPermission } = useDeviceShake(options);
```

### 매개변수

| 이름        | 타입         | 설명                                                                                                                                                                            |
| ----------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `threshold` | `number?`    | 흔들림으로 판정할 임계값 (기본: `15`, 최소값: `12`) <br/> <code>12 미만 금지: accelerationIncludingGravity는 중력(≈9.8 m/s²)을 포함하므로 너무 낮으면 가만히 있어도 잡힘</code> |
| `callback`  | `() => void` | 흔들림이 감지될 때 실행할 콜백 (선택)                                                                                                                                           |

### 반환값

| 이름                | 타입                                 | 설명                                                              |
| ------------------- | ------------------------------------ | ----------------------------------------------------------------- |
| `isShaking`         | `boolean`                            | 현재 흔들림 여부                                                  |
| `shakeCount`        | `number`                             | 감지된 흔들림 횟수                                                |
| `permission`        | `'default' \| 'granted' \| 'denied'` | iOS Safari 권한 상태                                              |
| `requestPermission` | `() => Promise<void>`                | iOS Safari 환경에서 권한을 요청하는 함수 (다른 환경에서는 사용 x) |

---

## ✅ 예시

### 기본 예시

```tsx
import { useDeviceShake } from 'hookdle';

function ShakeGame() {
  const { isShaking, shakeCount, permission, requestPermission } = useDeviceShake({
    threshold: 15,
    callback: () => console.log('흔들림 감지!'),
  });

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      {permission !== 'granted' && <button onClick={requestPermission}>📱 센서 권한 요청하기</button>}
      <h1>흔들림 횟수: {shakeCount}</h1>
      <p>상태: {isShaking ? '흔들리는 중' : '안 흔들림'}</p>
    </div>
  );
}
```

---

## 💡 threshold 조절하기

- threshold는 **가속도 크기의 임계값**입니다.
- 기본값 15 → 대체로 "한 번 크게 흔들었을 때" 감지됨.
- 값을 낮추면(예: 12) 더 민감하게 감지되어 작은 움직임에도 카운트될 수 있습니다.
- 중력 가속도 baseline이 약 `9.8`이므로 **12 미만은 허용하지 않습니다**.

---

## 💡 iOS Safari 권한 요청

iOS Safari(13+)에서는 모션 센서를 사용하기 전에 반드시 사용자가 명시적으로 허용해야 합니다.

```tsx
const { permission, requestPermission } = useDeviceShake();

if (permission !== 'granted') {
  return <button onClick={requestPermission}>센서 권한 요청</button>;
}
```

- 권한을 거부하면(`denied`) 다시는 요청할 수 없고, 브라우저를 완전히 새로 열어야 합니다.
- Android 등 다른 환경에서는 해당 함수를 사용할 필요가 없습니다.

---

## 💡 만약 이 훅이 없다면?

직접 `window.addEventListener('devicemotion', handler)`를 등록하고, 가속도 값을 가져와 threshold 계산, 디바운스 로직, 상태 관리까지 구현해야 합니다.

```tsx
useEffect(() => {
  const handler = (e: DeviceMotionEvent) => {
    const { x = 0, y = 0, z = 0 } = e.accelerationIncludingGravity || {};
    const total = Math.sqrt(x * x + y * y + z * z);
    if (total > 15) {
      console.log('흔들림 감지!');
    }
  };
  window.addEventListener('devicemotion', handler);
  return () => window.removeEventListener('devicemotion', handler);
}, []);
```

`useDeviceShake`를 사용하면 권한 요청, threshold 관리, 카운트 증가, 디바운스까지 한 번에 해결할 수 있습니다.
