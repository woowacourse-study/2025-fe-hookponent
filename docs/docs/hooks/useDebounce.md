# useDebounce

`useDebounce`는 연속적으로 호출되는 함수의 실행을 지정한 시간(wait) 동안 지연시키는 커스텀 React Hook입니다.

주로 입력 이벤트나 윈도우 리사이즈 이벤트 등에서 불필요한 호출을 방지할 때 유용합니다.

## 🔗 사용법

```tsx
const debouncedFn = useDebounce(callback, wait);
```

### 매개변수

- callback: 디바운싱할 함수

- wait: 지연 시간 (ms 단위)

### 반환값

- debouncedFn: 디바운스된 콜백 함수로, 필요할 때 호출

---

## ✅ 예시

```tsx
const debouncedSearch = useDebounce((value: string) => {
  console.log('검색 요청:', value);
}, 500);

<input onChange={(e) => debouncedSearch(e.target.value)} />;
```
