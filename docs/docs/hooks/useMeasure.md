# `useMeasure`

`useMeasure`는 DOM 요소의 크기(`width`, `height`)를 실시간으로 측정하고, 해당 요소의 크기가 변경될 때마다 자동으로 업데이트되는 커스텀 React Hook입니다.

- `ResizeObserver`를 이용해 요소의 크기 변화를 추적합니다.
- `ref`를 연결하지 않은 경우, `window.innerWidth`와 `window.innerHeight`를 사용하여 뷰포트 크기를 기본값으로 제공합니다.
- `크기가 변경되지 않은 경우에는` 불필요한 상태 업데이트를 방지합니다.

---

## 🔗 사용법

```tsx
const { ref, size } = useMeasure<HTMLDivElement>();
```

---

## 📥 매개변수

해당 훅은 별도의 매개변수를 받지 않습니다. 대신 **반환된 `ref`를 특정 DOM 요소에 연결**해 사용하는 방식입니다.

---

## 🔁 반환값

`{ref, size}`

| 키     | 타입                                | 설명                                                        |
| ------ | ----------------------------------- | ----------------------------------------------------------- |
| `ref`  | `RefObject<T>`                      | 크기를 측정할 DOM 요소에 연결할 `ref` 객체                  |
| `size` | `{ width: number; height: number }` | 측정된 요소의 현재 크기. `ref`가 없을 경우 window 크기 반환 |

---

## 🧩 제네릭 타입

`useMeasure<T>()` 형태로 사용할 수 있으며, `T`는 `HTMLElement`를 확장한 타입입니다.

- 예시: `HTMLDivElement`, `HTMLTextAreaElement`, `HTMLCanvasElement` 등

```tsx
const { ref, size } = useMeasure<HTMLTextAreaElement>();
```

---

## ✅ 예시

### 기본 사용

```tsx
function Component() {
  const { ref, size } = useMeasure<HTMLDivElement>();

  return (
    <div ref={ref} style={{ resize: 'both', overflow: 'auto' }}>
      <p>너비: {size.width}px</p>
      <p>높이: {size.height}px</p>
    </div>
  );
}
```

### `ref`를 연결하지 않은 경우 (fallback으로 window 크기 사용)

```tsx
function FullscreenLayout() {
  const { size } = useMeasure();

  return (
    <div>
      현재 화면 크기: {size.width} x {size.height}
    </div>
  );
}
```

---

## 🧠 작동 방식

1. `ref.current`가 존재하면 `ResizeObserver`를 등록하여 요소의 크기 변화를 감지합니다.
2. `ref.current`가 `null`일 경우, `window.innerWidth` 및 `innerHeight`를 초기값으로 사용하고,

   `resize` 이벤트를 통해 크기 변화를 추적합니다.

3. 크기 값이 변하지 않은 경우에는 `setState`를 호출하지 않아 불필요한 리렌더링을 방지합니다.

---

## 💡 만약 이 훅이 없다면?

직접 `ResizeObserver` 또는 `window.addEventListener('resize')`를 사용해 다음과 같이 처리해야 합니다:

```tsx
function ManualMeasure() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      크기: {size.width} x {size.height}
    </div>
  );
}
```

`useMeasure`를 사용하면 위 작업을 훨씬 간단하게 추상화하여 사용할 수 있습니다.
