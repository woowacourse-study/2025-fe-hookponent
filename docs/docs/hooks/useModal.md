# useModalClose

모달 닫기와 스크롤 방지를 간단하게 처리할 수 있는 커스텀 React Hook입니다.

모달 바깥 영역 클릭 시, esc 키를 누를 시 모달이 닫힙니다.

모달 바깥 영역 스크롤이 방지됩니다.

## 🔗 사용법

```
useModal({onClose});
```

### 매개변수

| 이름      | 타입         | 설명                              |
| --------- | ------------ | --------------------------------- |
| `onClose` | `() => void` | ESC 또는 외부 클릭 시 실행할 콜백 |

## ✅ 예시

```tsx
import { useState } from 'react';
import useModal from '../../packages/hooks/src/libs/useModal';
import './Modal.css';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => {
    setIsOpen(false);
  };

  const modalRef = useModal({ onClose });

  return (
    <>
      <button onClick={() => setIsOpen(true)}>모달 열기</button>

      {isOpen && (
        <div className="modal-overlay">
          <div ref={modalRef} className="modal-content">
            <h2>모달 제목</h2>
            <p>이곳은 모달 콘텐츠 영역입니다.</p>
            <button onClick={onClose}>모달 닫기</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
```
