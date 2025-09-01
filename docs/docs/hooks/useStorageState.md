# `useStorageState`

`localStorage` 또는 `sessionStorage`에 상태를 저장하고 동기화할 수 있는 커스텀 React Hook입니다.

- 페이지를 새로고침하거나 이동해도 상태가 유지됩니다.
- 다른 탭이나 창에서 동일 키의 Storage 값이 변경되면 해당 변경 사항이 자동으로 상태에 반영됩니다.
- 필요 시 refresh() 함수를 통해 수동으로 Storage 값을 다시 불러올 수 있습니다.
- 초기값 저장 여부, 직렬화/역직렬화 함수도 유연하게 설정할 수 있습니다.

## 🔗 사용법

```tsx
const [value, setValue, refresh] = useStorageState(key, initialValue, options);
```

### 매개변수

| 이름           | 타입      | 설명                                                                 |
| -------------- | --------- | -------------------------------------------------------------------- |
| `key`          | `string`  | 저장소에 저장할 키                                                   |
| `initialValue` | `T`       | 값이 없을 때 사용할 초기값                                           |
| `options`      | `object?` | 선택값. 저장소 타입, 직렬화 함수, 자동 초기 저장 여부 등을 설정 가능 |

### 🔧 `options` 구조

| 필드           | 타입                   | 설명                                                                       |
| -------------- | ---------------------- | -------------------------------------------------------------------------- |
| `type`         | `'local' \| 'session'` | 사용할 저장소 타입 (`localStorage` 또는 `sessionStorage`) (기본: `local`)  |
| `autoInit`     | `boolean`              | 저장소에 값이 없을 경우 `initialValue`를 자동 저장할지 여부 (기본: `true`) |
| `serializer`   | `(value: T) => string` | 값을 문자열로 직렬화하는 함수 (기본: `JSON.stringify`)                     |
| `deserializer` | `(value: string) => T` | 문자열을 원래 값으로 역직렬화하는 함수 (기본: `JSON.parse`)                |

### 🔁 반환값

`[value, setValue, refresh]`

| 인덱스 | 이름       | 타입                                   | 설명                                            |
| ------ | ---------- | -------------------------------------- | ----------------------------------------------- |
| `0`    | `value`    | `T`                                    | 현재 상태값                                     |
| `1`    | `setValue` | `(value: T \| (prev: T) => T) => void` | 상태를 업데이트하고 Storage에 저장              |
| `2`    | `refresh`  | `() => void`                           | Storage의 최신 값을 수동으로 불러와 상태를 갱신 |

---

## ✅ 예시

### 기본 예시

```tsx
import { useStorageState } from 'hookdle';

function ThemeToggle() {
  const [theme, setTheme, refreshTheme] = useStorageState<'light' | 'dark'>('theme', 'light');

  return (
    <>
      <button onClick={() => setTheme('light')}>라이트 모드</button>
      <button onClick={() => setTheme('dark')}>다크 모드</button>
      <button onClick={refreshTheme}>스토리지에서 새로고침</button>
      <div>현재 테마: {theme}</div>
    </>
  );
}
```

### localStorage를 외부에서 직접 수정한 경우

```tsx
function ExternalStorageUpdate() {
  const [value, , refresh] = useStorageState<number>('hi', 0);

  return (
    <button
      onClick={() => {
        localStorage.setItem('hi', JSON.stringify(10)); // 직접 수정
        refresh(); // 수동으로 상태 갱신
      }}
    >
      값 강제 동기화: {value}
    </button>
  );
}
```

localStorage.setItem(...)과 같이 훅 외부에서 Storage를 직접 수정한 경우, refresh()를 호출해야 상태가 반영됩니다.

---

## 💡 만약 이 훅이 없다면?

직접 localStorage에 접근해 상태를 초기화하고, useState, useEffect를 조합해야 합니다. 또한 탭 간 동기화나 수동 갱신 기능도 직접 구현해야 합니다!

```tsx
function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('theme');
    return stored ? (JSON.parse(stored) as 'light' | 'dark') : 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  // 다른 탭에서 변경 감지 (수동 구현 필요)
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        setTheme(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <>
      <button onClick={() => setTheme('light')}>라이트 모드</button>
      <button onClick={() => setTheme('dark')}>다크 모드</button>
      <div>현재 테마: {theme}</div>
    </>
  );
}
```

이처럼 useStorageState를 사용하면 저장소 관리, 직렬화, 동기화까지 간편하게 처리할 수 있습니다.
