# useViewTransition

`useViewTransition`은 브라우저의 View Transition API를 React에서 쉽게 사용할 수 있도록 도와주는 커스텀 React Hook입니다.  
페이지 전환이나 요소 이동 시 부드러운 애니메이션 효과를 구현할 때 유용하며, 브라우저 지원 여부에 관계없이 안전하게 동작합니다.

이 훅은 View Transition API가 지원되지 않는 환경에서는 자동으로 폴백 모드로 동작하여, 모든 브라우저에서 일관된 사용자 경험을 제공합니다.

## 🔗 사용법

```tsx
const { startTransition, bindRef } = useViewTransition();
```

### 반환값

- `startTransition`: View Transition을 시작하는 함수
  - `(update: () => void, options?: UseViewTransitionOptions) => void`
- `bindRef`: DOM 요소에 `view-transition-name`을 설정하는 ref 바인딩 함수
  - `(name: string) => (el: HTMLElement | null) => void`

### 옵션 타입

```tsx
interface UseViewTransitionOptions {
  onReady?: () => void;   // 전환 준비 완료 시 실행
  onFinish?: () => void;  // 전환 완료 시 실행
}
```

### 추가 기능

- **자동 브라우저 지원 감지**: View Transition API 지원 여부를 자동으로 확인합니다.
- **폴백 모드**: API가 지원되지 않는 경우 즉시 업데이트를 실행합니다.
- **에러 핸들링**: 전환 실패 시에도 안전하게 폴백으로 동작합니다.
- **자동 정리**: ref가 `null`로 설정될 때 요소들의 `view-transition-name`이 자동으로 정리됩니다.

---

## ✅ 예시

### 기본 사용법

```tsx
function MovingBox() {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const { startTransition, bindRef } = useViewTransition();

  const moveBox = () => {
    const newX = Math.random() * 80;
    const newY = Math.random() * 70;

    startTransition(() => {
      setPosition({ x: newX, y: newY });
    });
  };

  return (
    <div
      ref={bindRef("moving-box")}
      style={{
        position: "absolute",
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: "100px",
        height: "100px",
        backgroundColor: "#007ACC",
        borderRadius: "8px",
        transform: "translate(-50%, -50%)",
      }}
      onClick={moveBox}
    >
      Click me!
    </div>
  );
}
```

### 콜백 함수와 함께 사용

```tsx
function AnimatedCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { startTransition, bindRef } = useViewTransition();

  const toggleCard = () => {
    startTransition(
      () => {
        setIsExpanded(!isExpanded);
      },
      {
        onReady: () => {
          console.log("전환 준비 완료!");
        },
        onFinish: () => {
          console.log("전환 완료!");
        },
      }
    );
  };

  return (
    <div
      ref={bindRef("card")}
      style={{
        width: isExpanded ? "300px" : "150px",
        height: isExpanded ? "200px" : "100px",
        backgroundColor: "#28a745",
        borderRadius: "12px",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onClick={toggleCard}
    >
      {isExpanded ? "축소하기" : "확장하기"}
    </div>
  );
}
```

### 여러 요소 동시 전환

```tsx
function MultiElementTransition() {
  const [items, setItems] = useState([1, 2, 3, 4]);
  const { startTransition, bindRef } = useViewTransition();

  const shuffleItems = () => {
    startTransition(() => {
      setItems([...items].sort(() => Math.random() - 0.5));
    });
  };

  return (
    <div>
      <button onClick={shuffleItems}>섞기</button>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        {items.map((item, index) => (
          <div
            key={item}
            ref={bindRef(`item-${item}`)}
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: `hsl(${item * 60}, 70%, 50%)`,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### CSS와 함께 사용

```tsx
function StyledTransition() {
  const [theme, setTheme] = useState("light");
  const { startTransition, bindRef } = useViewTransition();

  const toggleTheme = () => {
    startTransition(() => {
      setTheme(theme === "light" ? "dark" : "light");
    });
  };

  return (
    <div
      ref={bindRef("theme-container")}
      style={{
        backgroundColor: theme === "light" ? "#ffffff" : "#1a1a1a",
        color: theme === "light" ? "#000000" : "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        transition: "all 0.3s ease",
      }}
    >
      <h2>테마 전환 예시</h2>
      <button onClick={toggleTheme}>
        {theme === "light" ? "다크 모드" : "라이트 모드"}로 전환
      </button>
    </div>
  );
}
```

## 🎨 CSS 설정

View Transition API를 최대한 활용하려면 CSS에서 `view-transition-name`을 설정해야 합니다:

```css
/* 기본 전환 효과 */
::view-transition-old(moving-box) {
  animation: slide-out 0.3s ease-out;
}

::view-transition-new(moving-box) {
  animation: slide-in 0.3s ease-in;
}

@keyframes slide-out {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}

@keyframes slide-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
```

## 🌐 브라우저 지원

- **Chrome 111+**: 완전 지원
- **Firefox, Safari**: 폴백 모드로 동작 (즉시 업데이트)
- **기타 브라우저**: 폴백 모드로 동작

## ⚠️ 주의사항

1. **CSS 설정 필요**: 최적의 애니메이션을 위해서는 CSS에서 `view-transition-name`과 관련 애니메이션을 설정해야 합니다.

2. **성능 고려**: 복잡한 DOM 조작이나 많은 요소를 동시에 전환할 때는 성능을 고려해야 합니다.

3. **브라우저 호환성**: Chrome,Whale,Safari 에서만 완전한 애니메이션을 확인할 수 있으며, 다른 브라우저에서는 폴백 모드로 동작합니다.

