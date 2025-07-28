# useLocalStorage

localStorage에 상태를 저장하고 동기화할 수 있는 커스텀 React Hook입니다.

브라우저를 새로고침하거나 페이지를 이동해도 값이 유지되며, 상태를 외부에서 변경한 경우 수동으로 동기화(refresh)도 가능합니다.

## 🔗 사용법

```tsx
const [value, setValue, refresh] = useLocalStorage(key, initialValue, options);
```

### 매개변수

| 이름           | 타입      | 설명                                                              |
| -------------- | --------- | ----------------------------------------------------------------- |
| `key`          | `string`  | localStorage에 저장할 키 이름                                     |
| `initialValue` | `T`       | 값이 없을 때 사용할 초기값                                        |
| `options`      | `object?` | 선택값. 직렬화/역직렬화 함수 또는 자동 초기 저장 여부를 설정 가능 |

### `options` 구조

| 필드           | 타입                   | 설명                                                                  |
| -------------- | ---------------------- | --------------------------------------------------------------------- |
| `autoInit`     | `boolean`              | 초기값이 없을 때 `localStorage`에 자동 저장할지 여부 (기본값: `true`) |
| `serializer`   | `(value: T) => string` | 값을 문자열로 직렬화하는 함수 (기본값: `JSON.stringify`)              |
| `deserializer` | `(value: string) => T` | 문자열을 원래 값으로 복원하는 함수 (기본값: `JSON.parse`)             |

---

### 반환값

`[value, setValue, refresh]`

| 인덱스 | 이름       | 타입                                   | 설명                                                               |
| ------ | ---------- | -------------------------------------- | ------------------------------------------------------------------ |
| `0`    | `value`    | `T`                                    | 현재 상태값                                                        |
| `1`    | `setValue` | `(value: T \| (prev: T) => T) => void` | 상태를 변경하고 `localStorage`에 저장                              |
| `2`    | `refresh`  | `() => void`                           | localStorage의 최신 값을 다시 읽어와 상태를 덮어씌움 (수동 동기화) |

---

## ✅ 예시

```tsx
import { useLocalStorage } from 'hookdle';

function ThemeToggle() {
  const [theme, setTheme, refreshTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  return (
    <>
      <button onClick={() => setTheme('light')}>라이트 모드</button>
      <button onClick={() => setTheme('dark')}>다크 모드</button>
      <button onClick={refreshTheme}>수동 동기화</button>

      <div>현재 테마: {theme}</div>
    </>
  );
}
```
