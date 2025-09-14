# useAsyncLock

중복 요청을 방지하기 위한 커스텀 훅입니다.
비동기 함수 실행 시 이미 실행 중이라면, 새로운 실행을 막고 undefined를 반환합니다.
이를 통해 버튼 연타 등으로 인한 중복 API 요청을 안전하게 차단할 수 있습니다.

⸻

## 🔗 사용법

```tsx
const { runWithLock, loading, isLockedRef } = useAsyncLock();
```

### 매개변수

useAsyncLock 자체는 별도 매개변수가 없습니다.  
대신 `runWithLock`을 호출할 때 두 번째 인자로 `onError`를 전달할 수 있습니다.

#### runWithLock

| 이름      | 타입                     | 설명                                       | 필수 여부 |
| --------- | ------------------------ | ------------------------------------------ | --------- |
| `fn`      | `() => Promise<T>`       | 실행할 비동기 함수                         | 필수      |
| `onError` | `(err: unknown) => void` | 실행 중 에러가 발생했을 때 호출되는 핸들러 | 선택      |

### 반환값

`{ runWithLock, loading, isLockedRef }`

| 이름          | 타입                              | 설명                                          |
| ------------- | --------------------------------- | --------------------------------------------- |
| `runWithLock` | `Promise<T> or undefined`         | fn을 실행하면서 중복 실행을 막아주는 함수     |
| `loading`     | `boolean`                         | 현재 실행 중인지 여부                         |
| `isLockedRef` | `React.MutableRefObject<boolean>` | 내부 잠금 상태를 직접 확인할 수 있는 ref 객체 |

---

## ✅ 예시

- 버튼을 여러 번 눌러도 실행 중에는 한 번만 동작합니다.
- 에러가 발생하면 onError 콜백이 실행됩니다.
- loading 상태를 이용해 버튼을 disable 처리할 수 있습니다.

```tsx
import { useAsyncLock } from '@/hooks/useAsyncLock';

function DeleteButton({ id }: { id: number }) {
  const { runWithLock, loading } = useAsyncLock();

  const deleteItem = async () => {
    const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('삭제 실패');
    alert('삭제 완료!');
  };

  const handleClick = () => {
    runWithLock(deleteItem, (err) => {
      if (err instanceof Error) {
        alert(`삭제 실패: ${err.message}`);
      } else {
        console.error('Unexpected error:', err);
      }
    });
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? '삭제 중...' : '삭제하기'}
    </button>
  );
}
```
