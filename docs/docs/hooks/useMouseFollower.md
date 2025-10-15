# useMouseFollower

`useMouseFollower`는 DOM 요소를 마우스 포인터처럼 따라다니게 만들어주는 커스텀 React Hook입니다.

커스텀 커서를 만들어 **기존 포인터(global cursor)를 대체**하거나, 특정 영역 안에서만 표시되는 **존 커서(zone cursor)** 를 구현할 수 있습니다.

**존/글로벌 간 활성 상태를 자동으로 동기화** 해줍니다.
내부적으로는 전역 store를 두고, 하나 이상의 존 커서가 활성화되면 글로벌 커서는 자동으로 숨겨지는 방식으로 동작합니다.

DOM 요소의 `transform: translate3d(x, y, 0)` 스타일을 직접 갱신하므로, 별도의 state 업데이트 없이 리렌더링 없이 부드럽게 움직입니다.

---

## 🔗 사용법

전체 영역에서 사용하는 **글로벌 커서(global cursor)**

```tsx
const cursorRef = useMouseFollower<HTMLDivElement>();
```

또는 특정 DOM 영역 안에서만 보이는 **존 커서(zone cursor)**

```tsx
const zoneRef = useRef<HTMLDivElement>(null);
const cursorRef = useMouseFollower<HTMLDivElement, HTMLDivElement>({ targetRef: zoneRef });
```

---

## 매개변수

```tsx
type useMouseFollowerOptions<T extends HTMLElement = HTMLElement> = {
  targetRef?: React.RefObject<T | null>;
  style?: {
    /** 포인터 상대 오프셋(px). 기본 { x: 0, y: 0 } */
    offset?: { x?: number; y?: number };
  };
};
```

| 키               | 타입                        | 기본값      | 설명                                                |
| ---------------- | --------------------------- | ----------- | --------------------------------------------------- |
| `targetRef`      | `RefObject<T> \| undefined` | `undefined` | 커서가 표시될 특정 영역의 ref. 없으면 글로벌로 동작 |
| `style.offset.x` | `number \| undefined`       | `0`         | 포인터 X 좌표에서의 픽셀 오프셋                     |
| `style.offset.y` | `number \| undefined`       | `0`         | 포인터 Y 좌표에서의 픽셀 오프셋                     |

> 예: 텍스트/이미지 커서를 포인터 중앙에 맞추고 싶을 때 offset으로 미세 조정하세요. (중심 정렬은 아래 “커스터마이즈 팁” 참고)

---

### 반환값

`React.RefObject<E | null>`

- 커서로 사용할 DOM 요소에 연결해야 하는 `ref` 객체

---

### 제네릭 타입

- `E`: 커서(팔로워) 요소 타입 (기본 `HTMLElement`)
- `T`: 타깃(존) 요소 타입 (기본 `HTMLElement`)

예시:

```tsx
// 커서(E)는 span, 존(T)은 div
const cursorRef = useMouseFollower<HTMLSpanElement, HTMLDivElement>({ targetRef: zoneRef });
```

---

## 기본 스타일(자동 적용)

훅은 최초 마운트 시 커서 요소에 다음 **베이스 스타일을 자동 적용**합니다. (좌표계 고정 + 성능 최적화 + 초기 숨김)

```css
position: fixed;
top: 0;
left: 0;
pointer-events: none;
will-change: transform, opacity;
transform: translate3d(-9999px, -9999px, 0); /* 초기 화면 밖 */
```

> 덕분에 별도 CSS 없이도 바로 사용 가능합니다.
>
> 필요 시 추가 스타일(예: `z-index`, `filter`, `mix-blend-mode`)을 커서 요소에 자유롭게 더해도 됩니다.

---

## ✅ 예시

### 기본 사용 - 글로벌 커서(global cursor)

```tsx
function GlobalCursor() {
  const cursorRef = useMouseFollower<HTMLDivElement>();

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        transform: 'translate3d(-9999px, -9999px, 0)',
      }}
    >
      🎯
    </div>
  );
}
```

### 특정 영역 안 - 존 커서(zone cursor)

```tsx
function ZoneCursor() {
  const zoneRef = useRef<HTMLDivElement>(null);
  const cursorRef = useMouseFollower<HTMLDivElement, HTMLDivElement>({ targetRef: zoneRef });

  return (
    <div>
      <divref={zoneRef}
        style={{ width: 300, height: 300, background: 'lightblue' }}
      >
        이 영역 안에서만 보이는 커서
      </div>
      <divref={cursorRef}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          transform: 'translate3d(-9999px, -9999px, 0)',
        }}
      >
        ✨
      </div>
    </div>
  );
}

```

### 동시에 동작 (글로벌 + 존)

```tsx
function CombinedCursorExample() {
  const zoneRef = useRef<HTMLDivElement>(null);

  const zoneCursorRef = useMouseFollower<HTMLDivElement, HTMLDivElement>({
    targetRef: zoneRef,
    style: { offset: { x: 0, y: 0 } },
  });

  const globalCursorRef = useMouseFollower<HTMLDivElement>({
    style: { offset: { x: 12, y: 12 } },
  });

  return (
    <div>
      <h1>마우스 따라다니는 커서 예제</h1>
      <div ref={zoneRef} style={{ width: 300, height: 300, background: 'pink', marginTop: 20 }}>
        여기에 들어가면 존 커서 활성화
      </div>

      {/* 존 커서 */}
      <div ref={zoneCursorRef} style={{ zIndex: 10000 }}>
        🔵 zone
      </div>

      {/* 글로벌 커서 (존이 활성화되면 자동 숨김) */}
      <div ref={globalCursorRef} style={{ zIndex: 9999 }}>
        ⚪ global
      </div>
    </div>
  );
}
```

---

## 💡 만약 이 훅이 없다면?

직접 `pointermove` 이벤트를 등록하고, `clientX/clientY` 좌표를 추적해 DOM 요소의 스타일을 갱신해야 합니다.

또 존 커서를 구현하려면 `getBoundingClientRect`로 inside/outside 여부를 계산하고, **글로벌 커서와 동기화하는 로직까지 직접 작성**해야 합니다.

```tsx
function ManualCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <divref={cursorRef}
      style={{ position: 'fixed', pointerEvents: 'none' }}
    >
      👆
    </div>
  );
}

```

`useMouseFollower`를 사용하면 이 과정을 훨씬 간단하게 추상화하여 사용할 수 있습니다.
