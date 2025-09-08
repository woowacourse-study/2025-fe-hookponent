# useUpdateEffect

`useUpdateEffect`는 React의 `useEffect`와 동일한 방식으로 동작하지만, **컴포넌트 마운트 시에는 실행되지 않고, 지정된 의존성(dependencies)이 업데이트될 때만 effect를 실행**하는 커스텀 훅입니다.

API 호출, 애니메이션, 알림 등에서 **초기 렌더링 시 불필요한 실행을 방지**하는 데 유용합니다.

---

## 🔗 사용법

```tsx
useUpdateEffect(effect, deps);
```

---

### 매개변수

| 이름     | 타입                                                     | 설명                                                |
| -------- | -------------------------------------------------------- | --------------------------------------------------- |
| `effect` | `EffectCallback`                                         | 실행할 effect 함수. `useEffect`와 동일한 시그니처.  |
| `deps`   | `readonly [unknown, ...unknown[]]` 또는 `DependencyList` | 의존성 배열. 최소 1개 이상의 값이 있어야 의미 있음. |

---

### 반환값

없음.

(`useEffect`와 동일하게 side effect를 관리하기 위한 훅이므로 값은 반환하지 않습니다.)

---

## 🧭 지원하는 기능

| 기능                 | 설명                                                                           |
| -------------------- | ------------------------------------------------------------------------------ |
| **초기 렌더링 무시** | 컴포넌트가 처음 마운트될 때는 effect가 실행되지 않습니다.                      |
| **업데이트 시 실행** | `deps`에 포함된 값이 변경될 때마다 effect가 실행됩니다.                        |
| **cleanup 지원**     | 반환한 cleanup 함수는 다음 effect 실행 전이나 컴포넌트 언마운트 시 실행됩니다. |

---

## ✅ 예시

```tsx
import React, { useState } from 'react';
import { useUpdateEffect } from './useUpdateEffect';

function SearchBox() {
  const [query, setQuery] = useState('');

  // 초기 렌더링에서는 실행되지 않고,
  // query 값이 바뀔 때만 실행됨
  useUpdateEffect(() => {
    console.log('🔎 검색 API 호출:', query);
    // fetchSearchResults(query);
  }, [query]);

  return (
    <div>
      <h2>검색창</h2>
      <inputvalue={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어를 입력하세요"
      />
    </div>
  );
}

```
