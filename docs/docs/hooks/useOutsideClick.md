`useOutsideClick`은 지정된 요소의 외부 클릭을 감지하는 커스텀 React 훅입니다.

모달, 드롭다운, 팝오버 등의 UI 컴포넌트에서 외부 클릭 시 해당 요소를 닫거나 숨기는 기능을 구현할 때 유용합니다.

## 🔗 사용법

```tsx
const ref = useOutsideClick(callback);
```

### 매개변수

| 이름       | 타입         | 설명                          |
| ---------- | ------------ | ----------------------------- |
| `callback` | `() => void` | 외부 클릭 시 실행될 콜백 함수 |

### 반환값

| 이름  | 타입              | 설명                                 |
| ----- | ----------------- | ------------------------------------ |
| `ref` | `React.RefObject` | 외부 클릭을 감지할 요소에 연결할 ref |

## ✅ 예시

### 기본 사용법 - 모달 컴포넌트

```tsx
import React, { useState } from 'react';
import { useOutsideClick } from './useOutsideClick';

function Modal() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useOutsideClick(() => {
    setIsOpen(false);
  });

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>모달 열기</button>
      {isOpen && (
        <div className="modal-overlay">
          <div ref={modalRef} className="modal-content">
            <h2>모달 내용</h2>
            <p>외부를 클릭하면 모달이 닫힙니다.</p>
            <button onClick={() => setIsOpen(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 드롭다운 메뉴

```tsx
import React, { useState } from 'react';
import { useOutsideClick } from './useOutsideClick';

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useOutsideClick(() => {
    setIsOpen(false);
  });

  return (
    <div className="dropdown-container">
      <button onClick={() => setIsOpen(!isOpen)}>메뉴 ▼</button>

      {isOpen && (
        <div ref={dropdownRef} className="dropdown-menu">
          <div className="dropdown-item">메뉴 1</div>
          <div className="dropdown-item">메뉴 2</div>
          <div className="dropdown-item">메뉴 3</div>
        </div>
      )}
    </div>
  );
}
```

### 토글 박스

```tsx
import React, { useState } from 'react';
import { useOutsideClick } from './useOutsideClick';

function ToggleBox() {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick(() => {
    setOpen(false);
  });

  return (
    <div>
      <button onClick={() => setOpen((prev) => !prev)} type="button">
        Toggle
      </button>
      {open && (
        <div ref={ref} style={{ border: '1px solid black', padding: 20 }}>
          클릭 시 바깥 클릭을 감지합니다
        </div>
      )}
    </div>
  );
}
```

## 📋 주의사항

- 조건부 렌더링되는 요소에 ref를 연결할 때는 요소가 마운트된 후에 외부 클릭 감지가 시작됩니다.
- 컴포넌트가 언마운트되면 자동으로 이벤트 리스너가 정리됩니다.
