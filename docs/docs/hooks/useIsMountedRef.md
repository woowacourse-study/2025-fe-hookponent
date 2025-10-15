# useIsMountedRef

`useIsMountedRef`는 React 컴포넌트가 현재 마운트된 상태인지 여부를 추적하는 커스텀 React Hook입니다.

- 비동기 작업 후 컴포넌트가 언마운트된 상태에서 상태 업데이트를 방지할 때 유용합니다.
- 메모리 누수를 방지하고 "Can't perform a React state update on an unmounted component" 경고를 예방합니다.
- 컴포넌트의 생명주기 동안 일관된 참조를 유지합니다.

---

## 🔗 사용법

```tsx
const isMountedRef = useIsMountedRef();
```

---

## 📥 매개변수

별도의 매개변수를 받지 않습니다.

---

## 🔁 반환값

`{ isMount: boolean }`

| 속성      | 타입      | 설명                                                                |
| --------- | --------- | ------------------------------------------------------------------- |
| `isMount` | `boolean` | 컴포넌트의 현재 마운트 상태 (`true`: 마운트됨, `false`: 언마운트됨) |

---

## ✅ 예시

### 비동기 데이터 로딩 시 안전한 상태 업데이트

```tsx
function UserProfile() {
  const isMountedRef = useIsMountedRef();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData().then((data) => {
      // 컴포넌트가 마운트된 상태일 때만 상태 업데이트
      if (isMountedRef.isMount) {
        setUserData(data);
      }
    });
  }, []);

  return <div>{/* 렌더링 로직 */}</div>;
}
```

### API 요청 취소 처리

```tsx
function SearchComponent() {
  const isMountedRef = useIsMountedRef();
  const [results, setResults] = useState([]);

  const handleSearch = async (query) => {
    try {
      const data = await searchAPI(query);
      // 컴포넌트가 마운트된 상태일 때만 결과 업데이트
      if (isMountedRef.isMount) {
        setResults(data);
      }
    } catch (error) {
      if (isMountedRef.isMount) {
        console.error('검색 중 오류 발생:', error);
      }
    }
  };

  return <div>{/* 검색 UI */}</div>;
}
```

---

## 🧠 작동 방식

1. 컴포넌트가 마운트될 때 `isMount` 값이 `true`로 설정됩니다.
2. `useRef`를 사용하여 컴포넌트의 생명주기 동안 일관된 참조를 유지합니다.
3. 컴포넌트가 언마운트될 때 `isMount` 값이 `false`로 변경됩니다.
4. cleanup 함수를 통해 메모리 누수를 방지합니다.

---

## 💡 만약 이 훅이 없다면?

비동기 작업에서 컴포넌트의 마운트 상태를 추적하기 위해 다음과 같은 복잡한 코드를 작성해야 합니다:

```tsx
function Component() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      const result = await someAsyncOperation();
      if (isMounted) {
        setData(result);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return <div>{/* 렌더링 로직 */}</div>;
}
```

`useIsMountedRef`를 사용하면 위 작업을 훨씬 간단하게 추상화하여 사용할 수 있으며, 여러 비동기 작업에서 재사용이 가능합니다.
