# useBooleanState

`boolean` 타입을 간단하게 제어할 수 있는 커스텀 React Hook입니다.

`true`, `false` 설정과 `toggle` 기능을 모두 제공하여 불필요한 상태 핸들링 로직을 줄여줍니다.

## 🔗 사용법

```tsx
const [value, setTrue, setFalse, toggle] = useBooleanState(defaultValue);
```

### 매개변수

| 이름           | 타입    | 설명   |
| -------------- | ------- | ------ |
| `defaultValue` | boolean | 초기값 |

### 반환값

`[value, setTrue, setFalse, toggle]`

| 인덱스 | 이름       | 타입         | 설명                     |
| ------ | ---------- | ------------ | ------------------------ |
| `0`    | `value`    | `boolean`    | 현재 상태값              |
| `1`    | `setTrue`  | `() => void` | 상태를 `true`로 설정     |
| `2`    | `setFalse` | `() => void` | 상태를 `false`로 설정    |
| `3`    | `toggle`   | `() => void` | 현재 상태를 반전(toggle) |

---

## ✅ 예시

```tsx
import { useBooleanState } from 'hookdle';

function BottomSheet() {
  const [open, openSheet, closeSheet, toggleSheet] = useBooleanState();

  return (
    <>
      <button onClick={openSheet}>열기</button>
      <button onClick={closeSheet}>닫기</button>
      <button onClick={toggleSheet}>토글</button>
      {open && <div>바텀시트 열림!</div>}
    </>
  );
}
```
