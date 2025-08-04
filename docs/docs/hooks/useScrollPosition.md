# useScrollPosition

`useScrollPosition`은 스크롤 위치 및 스크롤 방향을 추적할 수 있는 커스텀 React Hook입니다.

스크롤 이벤트를 기반으로 스크롤 좌표와 방향을 반환하며, 스크롤 이벤트 발생 시 콜백 실행도 지원합니다.

## 🔗 사용법

```tsx
const { position, direction } = useScrollPosition(options);
```

### 매개변수(options)

- `target: React.RefObject<HTMLElement | null>`
  - 스크롤 이벤트를 감지할 DOM 요소의 ref.
  - 지정하지 않으면 window 스크롤을 추적합니다.

- `throttleMs: number`
  - 스크롤 이벤트 처리 주기를 제한할 시간(ms).
  - (예: 100 → 100ms에 한 번만 스크롤 상태 갱신)

- `onScroll: (position: ScrollPosition, direction: ScrollDirection) => void`
  - 스크롤 이벤트 발생 시 호출되는 콜백 함수.

### 반환값

- `position: { x: number; y: number }`
  - 현재 스크롤 위치

- `direction: 'up' | 'down' | 'left' | 'right' | 'none'`
  - 최근 스크롤 방향

## ✅ 예시

### Window 스크롤 추적

```tsx
import { useScrollPosition } from './useScrollPosition';

function App() {
  const { position, direction } = useScrollPosition({
    throttleMs: 100,
    onScroll: (pos, dir) => console.log('스크롤', pos, dir),
  });

  return (
    <>
      <p>X: {position.x}</p>
      <p>Y: {position.y}</p>
      <p>Direction: {direction}</p>
    </>
  );
}
```

### 특정 요소 스크롤 추적

```tsx
import { useRef } from 'react';
import { useScrollPosition } from './useScrollPosition';

function ScrollBox() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { position, direction } = useScrollPosition({ target: scrollRef });

  return (
    <div ref={scrollRef} style={{ height: 200, overflowY: 'scroll', border: '1px solid black' }}>
      <div style={{ height: 800 }}>
        <p>X: {position.x}</p>
        <p>Y: {position.y}</p>
        <p>Direction: {direction}</p>
      </div>
    </div>
  );
}
```
