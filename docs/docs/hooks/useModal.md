# useModalClose

모달 닫기와 스크롤 방지를 간단하게 처리할 수 있는 커스텀 React Hook입니다.

모달 바깥 영역 클릭 시, esc 키를 누를 시 모달이 닫힙니다.

모달 바깥 영역 스크롤이 방지됩니다.

## 🔗 사용법

```
const { isOpen, openModal, closeModal } = useModal(modalRef);
```

### 매개변수

| 이름        | 타입                                | 설명                              |
| ----------- | ----------------------------------- | --------------------------------- |
| `targetRef` | `RefObject<HTMLDivElement \| null>` | 모달 DOM 요소를 가리키는 ref 객체 |

### 반환값

| 이름         | 타입         | 설명                             |
| ------------ | ------------ | -------------------------------- |
| `isOpen`     | `boolean`    | 모달이 열려 있는지 여부          |
| `openModal`  | `() => void` | 모달을 열고 이벤트 리스너를 등록 |
| `closeModal` | `() => void` | 모달을 닫고 이벤트 리스너를 해제 |

## ✅ 예시

```tsx
import { useRef } from 'react';
import useModal from '../../packages/hooks/src/libs/useModal';
import './Modal.css';

function App() {
  const modalRef = useRef<HTMLDivElement>(null);
  const { isOpen, openModal, closeModal } = useModal(modalRef);

  return (
    <>
      <button onClick={openModal}>모달 열기</button>

      {isOpen && (
        <div className="modal-overlay">
          <div ref={modalRef} className="modal-content">
            <h2>모달 제목</h2>
            <p>이곳은 모달 콘텐츠 영역입니다.</p>
            <button onClick={closeModal}>모달 닫기</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
```
