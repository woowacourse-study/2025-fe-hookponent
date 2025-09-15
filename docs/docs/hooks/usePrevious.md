# usePrevious

`usePrevious`는 지정한 값의 **이전 렌더링 값**을 기억하여 반환하는 커스텀 React 훅입니다.

상태나 props의 이전 값을 추적할 수 있으며, 값의 변화 감지, 애니메이션 조건 처리, 디버깅 등에 유용하게 활용됩니다.

---

## 🔗 사용법

```tsx
const prevValue = usePrevious(value, initialValue?);
```

## 매개변수

| 이름           | 타입         | 설명                                                                    |
| -------------- | ------------ | ----------------------------------------------------------------------- |
| `value`        | `T`          | 추적할 값 (state, props 등)                                             |
| `initialValue` | `T` _(선택)_ | 첫 번째 렌더링 시 반환할 초기 이전 값. 지정하지 않으면 `undefined` 반환 |

## ✅ 예시

### 1. 카운터의 이전 값 추적

```tsx
import React, { useState, useEffect } from 'react';
import { usePrevious } from './usePrevious';

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  useEffect(() => {
    if (prevCount !== undefined && prevCount !== count) {
      console.log(`이전: ${prevCount}, 현재: ${count}`);
    }
  }, [count, prevCount]);

  return (
    <div>
      <p>현재 값: {count}</p>
      <p>이전 값: {String(prevCount)}</p>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );
}
```

### 2. 입력값 변화 감지

```tsx
import React, { useState, useEffect } from 'react';
import { usePrevious } from './usePrevious';

function InputLogger() {
  const [text, setText] = useState('');
  const prevText = usePrevious(text, '');

  useEffect(() => {
    if (prevText !== text) {
      console.log(`"${prevText}" ➡ "${text}"`);
    }
  }, [text, prevText]);

  return <input value={text} onChange={(e) => setText(e.target.value)} />;
}
```

## 📋 주의사항

- 첫 렌더링에서는 기본적으로 undefined를 반환합니다. 필요 시 initialValue로 초기값을 지정할 수 있습니다.
- 반환되는 값은 항상 직전 렌더링 시점의 값입니다.
- React 18의 StrictMode에서는 개발 환경에서 useEffect가 두 번 실행되므로, 디버깅 시 로그가 중복될 수 있습니다.
- usePrevious는 단순히 이전 값을 기억하는 용도로만 설계되었으므로, 여러 이전 상태를 관리하려면 별도의 스택 구조를 직접 구현해야 합니다.
