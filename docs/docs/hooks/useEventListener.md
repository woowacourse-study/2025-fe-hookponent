# useEventListener

`useEventListener`는 지정한 이벤트 타입에 대해 타겟 요소에 안전하게 이벤트 리스너를 등록·해제하는 커스텀 React 훅입니다.

DOM 요소, `window`, `document`, `MediaQueryList` 등 다양한 이벤트 타겟에 대응하며, 최신 콜백 유지와 자동 정리까지 처리합니다.

## 🔗 사용법

```tsx
useEventListener(target, type, listener, options);
```

### 매개변수

| 이름       | 타입                                          | 설명                                                  |
| ---------- | --------------------------------------------- | ----------------------------------------------------- |
| `target`   | `RefObject<EventTarget>` \| `EventTarget`     | 이벤트를 등록할 대상 (`ref` 객체 또는 직접 지정 가능) |
| `type`     | `string`                                      | 이벤트 타입 (예: `'click'`, `'resize'`, `'keydown'`)  |
| `listener` | `(e: Event) => void`                          | 이벤트 발생 시 실행될 콜백 함수                       |
| `options`  | `boolean \| AddEventListenerOptions` _(선택)_ | 이벤트 등록 옵션 (`capture`, `once`, `passive` 등)    |

## ✅ 예시

### 1. window 리사이즈 이벤트

```tsx
import React, { useState } from 'react';
import { useEventListener } from './useEventListener';

function WindowSizeLogger() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEventListener(window, 'resize', () => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  });

  return (
    <div>
      <p>가로: {size.width}px</p>
      <p>세로: {size.height}px</p>
    </div>
  );
}
```

### 2. 특정 DOM 요소 클릭 감지

```tsx
import React, { useRef, useState } from 'react';
import { useEventListener } from './useEventListener';

function ClickCounter() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [count, setCount] = useState(0);

  useEventListener(buttonRef, 'click', () => {
    setCount((prev) => prev + 1);
  });

  return (
    <div>
      <button ref={buttonRef}>클릭 횟수: {count}</button>
    </div>
  );
}
```

### 3. MediaQueryList 이벤트 감지

```tsx
import React, { useState } from 'react';
import { useEventListener } from './useEventListener';

function DarkModeDetector() {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const [isDark, setIsDark] = useState(mediaQuery.matches);

  useEventListener(mediaQuery, 'change', (e: MediaQueryListEvent) => {
    setIsDark(e.matches);
  });

  return <div>현재 모드: {isDark ? '다크 모드' : '라이트 모드'}</div>;
}
```

## 📋 주의사항

- listener 함수는 내부에서 최신 참조를 유지하므로, 매 렌더마다 이벤트를 재등록할 필요가 없습니다.
- options 객체를 매번 새로 만들면 재등록이 발생하므로, 필요한 경우 useMemo로 안정화하는 것이 좋습니다.
- target이 null인 경우(예: 조건부 렌더링 시), 이벤트는 등록되지 않습니다.
- cleanup은 훅 내부에서 자동으로 처리되므로 별도 해제가 필요 없습니다.
- ref 객체를 사용할 때는 ref.current가 유효한 시점에만 이벤트가 등록됩니다.
