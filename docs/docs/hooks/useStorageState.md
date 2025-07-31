# `useStorageState`

`localStorage` 또는 `sessionStorage`에 상태를 저장하고 동기화할 수 있는 커스텀 React Hook입니다.

페이지를 새로고침하거나 다른 탭에서 저장소가 변경되더라도 상태가 유지되거나 자동 동기화되며, 초기값 저장과 직렬화 옵션도 지원합니다.

---

## 🔗 사용법

```tsx
const [value, setValue] = useStorageState(key, initialValue, options);
```

---

## 📥 매개변수

| 이름           | 타입      | 설명                                                                 |
| -------------- | --------- | -------------------------------------------------------------------- |
| `key`          | `string`  | 저장소에 저장할 키                                                   |
| `initialValue` | `T`       | 값이 없을 때 사용할 초기값                                           |
| `options`      | `object?` | 선택값. 저장소 타입, 직렬화 함수, 자동 초기 저장 여부 등을 설정 가능 |

---

### 🔧 `options` 구조

| 필드           | 타입                   | 설명                                                                       |
| -------------- | ---------------------- | -------------------------------------------------------------------------- |
| `type`         | `'local' \| 'session'` | 사용할 저장소 타입 (`localStorage` 또는 `sessionStorage`) (기본: `local`)  |
| `autoInit`     | `boolean`              | 저장소에 값이 없을 경우 `initialValue`를 자동 저장할지 여부 (기본: `true`) |
| `serializer`   | `(value: T) => string` | 값을 문자열로 직렬화하는 함수 (기본: `JSON.stringify`)                     |
| `deserializer` | `(value: string) => T` | 문자열을 원래 값으로 역직렬화하는 함수 (기본: `JSON.parse`)                |

---

## 🔁 반환값

`[value, setValue]`

| 인덱스 | 이름       | 타입                                   | 설명                               |
| ------ | ---------- | -------------------------------------- | ---------------------------------- |
| `0`    | `value`    | `T`                                    | 현재 상태값                        |
| `1`    | `setValue` | `(value: T \| (prev: T) => T) => void` | 상태를 업데이트하고 Storage에 저장 |

---

## ✅ 예시

```tsx
import { useStorageState } from 'hookdle';

function ThemeToggle() {
  const [theme, setTheme] = useStorageState<'light' | 'dark'>('theme', 'light');

  return (
    <>
      <button onClick={() => setTheme('light')}>라이트 모드</button>
      <button onClick={() => setTheme('dark')}>다크 모드</button>
      <div>현재 테마: {theme}</div>
    </>
  );
}
```

---

## 💡 만약 이 훅이 없다면?

직접 `localStorage`에 접근해 상태를 초기화하고, `useState`, `useEffect`를 조합해야 합니다.

```tsx
function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('theme');
    return stored ? (JSON.parse(stored) as 'light' | 'dark') : 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  return (
    <>
      <button onClick={() => setTheme('light')}>라이트 모드</button>
      <button onClick={() => setTheme('dark')}>다크 모드</button>
      <div>현재 테마: {theme}</div>
    </>
  );
}
```

이 방식은 코드 중복이 많고, 직렬화/역직렬화 오류나 탭 간 동기화가 자동으로 되지 않기 때문에 유지 관리에 불리합니다.
