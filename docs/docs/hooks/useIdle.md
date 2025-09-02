# useIdle

`useIdle`은 사용자의 입력 활동이 일정 시간 이상 없을 경우 **비활성(Idle) 상태**로 간주하는 React 커스텀 훅입니다.

타이핑, 마우스 이동, 클릭, 스크롤 등 다양한 활동 이벤트를 감지하며, 지정된 시간 동안 활동이 없을 경우 `true`를 반환합니다.

## 🔗 사용법

```tsx
const isIdle = useIdle(timeout);
```

### 매개변수

| 이름      | 타입     | 설명                                                  |
| --------- | -------- | ----------------------------------------------------- |
| `timeout` | `number` | 비활성 상태로 간주하기까지 대기할 시간 (단위: 밀리초) |

### 반환값

| 이름     | 타입      | 설명                               |
| -------- | --------- | ---------------------------------- |
| `isIdle` | `boolean` | 현재 사용자가 비활성 상태인지 여부 |

### 🧭 동작 방식

1. 초기 마운트 시 timeout 시간 내에 입력 활동이 없으면 isIdle이 true가 됩니다.
2. 사용자의 다음 이벤트(클릭, 입력, 스크롤 등)가 감지되면 타이머가 초기화되며 isIdle은 다시 false로 바뀝니다.
3. `mousedown`, `mousemove`, `keypress`, `keydown`, `scroll`, `touchstart`, `click` 이벤트를 감지합니다.
4. 컴포넌트가 언마운트되면 이벤트 리스너 및 타이머를 정리합니다.

---

## ✅ 예시

```tsx
import React, { useEffect } from 'react';
import { useIdle } from './useIdle';

function IdleWarning() {
  const isIdle = useIdle(5000); // 5초간 아무 입력 없으면 Idle로 간주

  useEffect(() => {
    if (isIdle) {
      alert('잠시 자리를 비우셨네요!');
    }
  }, [isIdle]);

  return (
    <div>
      <h2>🖐️ 사용자 상태</h2>
      <p>현재 상태: {isIdle ? '비활성(Idle)' : '활성(Active)'}</p>
    </div>
  );
}
```

## 💡 활용 팁

- 자동 로그아웃 기능 구현 시 유용합니다.
- 사용자 상태 추적(예: 실시간 협업 앱에서 활동 중 표시)에 활용할 수 있습니다.
- 타이머를 리셋하는 로직은 useCallback으로 메모이즈되어 렌더링 성능에 영향을 주지 않습니다.
- 다중 이벤트를 document에 바인딩하므로, 클라이언트 환경에서만 작동합니다 (SSR 주의).
