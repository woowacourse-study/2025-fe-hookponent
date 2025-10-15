# useSingleEffect

컴포넌트가 처음 마운트될 때 한 번만 실행되는 사이드이펙트를 등록할 수 있는 커스텀 React Hook입니다.

일반적으로 `useEffect(callback, [])` 패턴으로 작성하던 코드를 간결하게 추상화하여, 불필요한 반복을 줄여줍니다.

## 🔗 사용법

```tsx
useSingleEffect(callback);
```

### 매개변수

| 이름       | 타입                                 | 설명                                                                   |
| :--------- | :----------------------------------- | :--------------------------------------------------------------------- |
| `callback` | `() => void` \| `() => (() => void)` | 마운트 시 실행할 함수. cleanup 함수를 반환하면 언마운트 시 실행됩니다. |

### 반환값

없음 (void)

## ✅ 예시

### 1. 언마운트 작업 없는 버전

```tsx
import { useState } from 'react';
import { useSingleEffect } from 'hookdle';

function DataFetcher() {
  const [data, setData] = useState(null);

  useSingleEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://api.example.com/data');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    };

    fetchData();
  });

  return <div>{data ? data.title : '로딩 중...'}</div>;
}
```

### 2. 언마운트 작업 있는 버전

```tsx
import { useState } from 'react';
import { useSingleEffect } from 'hookdle';

function DataFetcher() {
  const [data, setData] = useState(null);

  useSingleEffect(() => {
    let isMounted = true; // 언마운트 후 setState 방지용 플래그

    const fetchData = async () => {
      try {
        const res = await fetch('https://api.example.com/data');
        const json = await res.json();
        if (isMounted) {
          setData(json); // 언마운트된 상태라면 setState 안 함
        }
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    };

    fetchData();

    // 언마운트 시 실행
    return () => {
      isMounted = false;
      console.log('컴포넌트 언마운트 → fetch 무시');
    };
  });

  return <div>{data ? data.title : '로딩 중...'}</div>;
}
```
