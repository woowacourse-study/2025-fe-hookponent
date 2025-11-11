# 🪝 Hookdle

> React 프로젝트에 바로 쓸 수 있는 실용적인 커스텀 훅 모음

[![npm version](https://img.shields.io/npm/v/hookdle.svg)](https://www.npmjs.com/package/hookdle)
[![license](https://img.shields.io/npm/l/hookdle.svg)](https://github.com/woowacourse-study/2025-fe-hookponent/blob/main/LICENSE)

## 📦 설치

```bash
npm install hookdle

# or

yarn add hookdle

# or

pnpm add hookdle
```

## 🚀 빠른 시작 예시

```tsx
import { useBooleanState, useDebounce } from 'hookdle';

function App() {
  const [isOpen, open, close, toggle] = useBooleanState(false);
  const debouncedValue = useDebounce(searchTerm, 500);

  // ...
}
```

## 📖 훅 목록

| 카테고리            | 훅 이름             | 설명                             |
| ------------------- | ------------------- | -------------------------------- |
| **State 관리**      | `useArrayState`     | 배열 상태 관리                   |
|                     | `useBooleanState`   | boolean 상태 관리                |
|                     | `useCounter`        | 카운터 관리                      |
|                     | `useStorageState`   | localStorage/sessionStorage 연동 |
|                     | `usePrevious`       | 이전 값 추적                     |
| **비동기 & 이벤트** | `useDebounce`       | 디바운스                         |
|                     | `useAsyncLock`      | 비동기 작업 잠금                 |
|                     | `useEventListener`  | 이벤트 리스너                    |
|                     | `useIdle`           | 비활성 감지                      |
| **UI & 인터랙션**   | `useHover`          | 호버 상태                        |
|                     | `useOutsideClick`   | 외부 클릭 감지                   |
|                     | `useMeasure`        | 엘리먼트 크기                    |
|                     | `useScrollPosition` | 스크롤 위치                      |
|                     | `useMouseFollower`  | 마우스 추적                      |
|                     | `useLockBodyScroll` | 스크롤 잠금                      |
| **미디어 & 반응형** | `useMediaQuery`     | 미디어 쿼리                      |
|                     | `useDarkMode`       | 다크 모드                        |
| **고급 패턴**       | `useFunnel`         | 퍼널 플로우                      |
|                     | `useInfiniteScroll` | 무한 스크롤                      |
|                     | `usePagination`     | 페이지네이션                     |
|                     | `useDocumentTab`    | 문서 탭 관리                     |
| **유틸리티**        | `useIsMountedRef`   | 마운트 상태                      |
|                     | `useSingleEffect`   | 단일 실행 effect                 |
|                     | `useUpdateEffect`   | 업데이트 effect                  |
|                     | `useTextClipboard`  | 클립보드                         |

## 📋 요구사항

- **React**: ^18.0.0 이상
- **TypeScript**: ^5.0.0 이상 (선택사항, 타입 정의 포함)

> 💡 `hookdle`은 외부 의존성이 없으며, React만 있으면 바로 사용할 수 있습니다.

## 📚 상세 문서

전체 문서와 API 레퍼런스는 [Hookponent 공식 문서](https://hookponent.vercel.app/)에서 확인하세요.

## 🤝 기여

이 프로젝트는 [Hookponent 스터디](https://github.com/woowacourse-study/2025-fe-hookponent)에서 관리됩니다.
기여는 언제나 환영합니다!

## 📄 라이선스

MIT © Hookponent Team
