---
sidebar_position: 1
---

# 시작하기

Hookponent는 React 환경에서 사용할 수 있는 **훅(Hooks)과 컴포넌트 라이브러리**입니다.

## 업데이트된 훅포넌트

Hookponent는 현재 다음과 같은 훅들을 제공합니다:

### 컴포넌트

- **SwitchCase** - 조건 값에 따라 다른 컴포넌트를 선택적으로 렌더링하는 분기 처리 컴포넌트

### 상태 관리

- **useArrayState** - 배열 상태 관리를 위한 유틸리티 훅
- **useBooleanState** - 불리언 상태 토글 및 조작 훅
- **useCounter** - 카운터 상태 관리 훅
- **useStorageState** - localStorage/sessionStorage 연동 상태 훅

### UI/UX 관련

- **useDarkMode** - 다크 모드 상태 관리 훅
- **useDebounce** - 디바운싱 기능 훅
- **useIdle** - 사용자 활동 감지 훅
- **useLockBodyScroll** - 스크롤 잠금 기능 훅
- **useMeasure** - 엘리먼트 크기 측정 훅
- **useMediaQuery** - 미디어 쿼리 반응형 훅
- **useOutsideClick** - 외부 클릭 감지 훅
- **useScrollPosition** - 스크롤 위치 추적 훅

### 이벤트 및 리스너

- **useEventListener** - 이벤트 리스너 관리 훅

> 📢 **업데이트 안내**: 현재 개발 중인 라이브러리로, 더 많은 유용한 훅들이 계속해서 추가되고 있습니다 🚀

## 기본 사용법

```jsx
import { useCounter, useDarkMode } from 'hookponent';

function MyComponent() {
  const { count, increment, decrement } = useCounter(0);
  const { isDark, toggle } = useDarkMode();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>

      <button onClick={toggle}>{isDark ? '🌞' : '🌙'}</button>
    </div>
  );
}
```

## 도움이 필요하신가요?

- **npm**: https://www.npmjs.com/package/hookponent
- **문서**: 이 사이트의 다른 섹션들을 참고하세요 🙇‍♀️

---

> **주의**: 이 패키지는 React 환경에서만 동작합니다. 다른 프레임워크나 바닐라 JavaScript 환경에서는 사용할 수 없습니다.
