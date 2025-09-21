# useHover

`useHover`는 DOM 요소에 마우스 호버 상태를 감지하고 관리하는 커스텀 React Hook입니다.  
마우스가 요소 위에 올라갔을 때(`mouseenter`)와 요소에서 벗어났을 때(`mouseleave`) 이벤트를 처리하며, 호버 상태를 추적할 수 있습니다.

이 훅은 호버 상태 변화 시 실행될 콜백 함수들을 옵션으로 받을 수 있으며, 다양한 인터랙티브 UI 요소를 구현할 때 유용합니다.

## 🔗 사용법

```tsx
const { isHovered, hoverRef } = useHover();
const { isHovered, hoverRef } = useHover({
  onEnter: (event) => console.log('마우스 진입'),
  onLeave: (event) => console.log('마우스 이탈'),
});
```

### 매개변수

- options: 호버 이벤트 처리 옵션 객체 (선택적)
  - `onEnter?: (event: MouseEvent) => void`: 마우스가 요소에 진입할 때 실행될 콜백 함수
  - `onLeave?: (event: MouseEvent) => void`: 마우스가 요소에서 이탈할 때 실행될 콜백 함수

### 반환값

- `isHovered: boolean`: 현재 호버 상태를 나타내는 boolean 값
- `hoverRef: React.RefObject<T>`: 호버를 감지할 DOM 요소에 연결할 ref 객체

### 추가 기능

- 제네릭 타입 지원
  - `useHover<T extends HTMLElement>`로 특정 HTML 요소 타입을 지정할 수 있습니다.

- 자동 이벤트 관리
  - 컴포넌트 언마운트 시 이벤트 리스너가 자동으로 정리됩니다.

- 유연한 콜백 시스템
  - 호버 상태 변화 시 원하는 로직을 실행할 수 있는 콜백 함수를 제공합니다.

## ✅ 예시

### 기본 호버 상태 감지

```tsx
function HoverButton() {
  const { isHovered, hoverRef } = useHover();

  return (
    <button ref={hoverRef} style={{ backgroundColor: isHovered ? '#007bff' : '#6c757d' }}>
      {isHovered ? '호버 중!' : '마우스를 올려보세요'}
    </button>
  );
}
```

### 콜백 함수와 함께 사용

```tsx
function InteractiveCard() {
  const { isHovered, hoverRef } = useHover({
    onEnter: (event) => {
      console.log('카드에 마우스가 진입했습니다', event);
    },
    onLeave: (event) => {
      console.log('카드에서 마우스가 이탈했습니다', event);
    },
  });

  return (
    <div ref={hoverRef} className={`card ${isHovered ? 'card-hovered' : ''}`}>
      <h3>인터랙티브 카드</h3>
      <p>상태: {isHovered ? '호버됨' : '일반'}</p>
    </div>
  );
}
```

### 특정 HTML 요소 타입 지정

```tsx
function ImageGallery() {
  const { isHovered, hoverRef } = useHover<HTMLImageElement>({
    onEnter: () => console.log('이미지 호버 시작'),
    onLeave: () => console.log('이미지 호버 종료'),
  });

  return (
    <img
      ref={hoverRef}
      src="/image.jpg"
      alt="갤러리 이미지"
      style={{
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s ease',
      }}
    />
  );
}
```
