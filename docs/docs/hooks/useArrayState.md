# useArrayState

`useArrayState`는 배열 상태를 관리하는 커스텀 React 훅입니다.

배열에 대해 자주 사용하는 조작 메서드(push, pop, splice 등)를 포함한 불변성 기반의 유틸리티 함수를 제공합니다.

## 🔗 사용법

```tsx
const [value, controls] = useArrayState(initialArray);
```

### 매개변수

| 이름           | 타입                 | 설명                             |
| -------------- | -------------------- | -------------------------------- |
| `initialValue` | `T[]` \| `() => T[]` | 초기 배열 값 또는 배열 반환 함수 |

### 반환값

`[value, userDefinedArraySetterName]`

| 인덱스 | 이름       | 타입                                | 설명                                                  |
| ------ | ---------- | ----------------------------------- | ----------------------------------------------------- |
| `0`    | `value`    | `Array`                             | 현재 배열 상태 값                                     |
| `1`    | `controls` | `UserDefinedArraySetterNameType<T>` | 배열을 조작할 수 있는 메서드 객체 (push, pop 등 제공) |

### 🧭 지원하는 메서드 목록

| 메서드명                           | 설명                                             |
| ---------------------------------- | ------------------------------------------------ |
| `set(array)`                       | 배열 전체를 새로운 배열로 교체합니다.            |
| `push(...v)`                       | 배열 끝에 값을 추가합니다.                       |
| `pop()`                            | 배열 끝의 값을 제거합니다.                       |
| `clear()`                          | 배열을 비웁니다.                                 |
| `shift()`                          | 배열 맨 앞의 값을 제거합니다.                    |
| `unshift(...v)`                    | 배열 맨 앞에 값을 추가합니다.                    |
| `splice(start, deleteCount, ...v)` | 배열의 특정 위치에 요소를 삽입하거나 제거합니다. |
| `insertAt(index, ...v)`            | 지정된 위치에 값을 삽입합니다.                   |
| `removeAt(index)`                  | 지정된 위치의 값을 제거합니다.                   |
| `updateAt(index, value)`           | 지정된 위치의 값을 새로운 값으로 교체합니다.     |

---

## ✅ 예시

```tsx
import React from 'react';
import { useArrayState } from './useArrayState';

function TodoList() {
  const [todos, todoActions] = useArrayState<string>([]);
  // todos: string[]
  // todoActions: UserDefinedArraySetterNameType<string>

  const handleAdd = () => {
    const newTodo = prompt('새로운 할 일을 입력하세요');
    if (newTodo) {
      todoActions.push(newTodo);
    }
  };

  const handleRemove = (index: number) => {
    todoActions.removeAt(index);
  };

  return (
    <div>
      <h2>📝 할 일 목록</h2>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>
            {todo}
            <button onClick={() => handleRemove(i)}>삭제</button>
          </li>
        ))}
      </ul>
      <button onClick={handleAdd}>할 일 추가</button>
      <button onClick={() => todoActions.clear()}>전체 삭제</button>
    </div>
  );
}
```
