# useCounter

`useCounter`는 숫자의 증가, 감소, 초기화, 대입 기능을 제공하는 커스텀 훅입니다.

## 🔗 사용법

```tsx
const { count, increment, decrement, reset, setCount } = useCounter(10, { min: 0, max: 100, step: 5 });
```

### 매개변수

| 이름           | 타입                    | 설명    |
| -------------- | ----------------------- | ------- |
| `initialValue` | `number`                | 초기 값 |
| `min`          | `number` \| `undefined` | 최소 값 |
| `max`          | `number` \| `undefined` | 최대 값 |
| `step`         | `number` \| `undefined` | 증가 값 |

### 반환값

`{ count, increment, decrement, reset, setCount }`
| 이름 | 타입 | 설명 |
| ---------- | ----------------------------------- | ----------------------------------------------------- |
| `count` | `number` | 현재 숫자 값 |
| `increment` | `() => void` | 숫자를 증가하는 함수 |
| `decrement` | `() => void` | 숫자를 감소하는 함수 |
| `reset` | `() => void` | 숫자를 초기 값으로 변경하는 함수 |
| `setCount` | `(value: number \| ((prev: number) => number)) => void` | 숫자를 지정한 값으로 변경하는 함수 |

## ✅ 예시

```tsx
import useCounter from './hook';

function App() {
  const { count, increment, decrement, reset, setCount } = useCounter(10, { min: 20, max: 100, step: 5 });
  return (
    <>
      <p>{count}</p>
      <button type="button" onClick={increment}>
        +
      </button>
      <button type="button" onClick={decrement}>
        -
      </button>
      <button type="button" onClick={reset}>
        reset
      </button>
      <button type="button" onClick={() => setCount(100)}>
        한번에 내가 원하는 숫자로
      </button>
    </>
  );
}

export default App;
```
