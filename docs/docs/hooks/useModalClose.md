# useModalClose

모달 닫기 동작을 간단하게 처리할 수 있는 커스텀 React Hook입니다.

모달 바깥 영역 클릭 시, esc 키를 누를 시 모달이 닫힙니다.

## 🔗 사용법

```
useModalCloseTrigger({ref,onClose});
```

### 매개변수

| 이름      | 타입                                   | 설명                              |
| --------- | -------------------------------------- | --------------------------------- |
| `ref`     | `React.RefObject<HTMLElement \| null>` | 모달 요소의 ref                   |
| `onClose` | `() => void`                           | ESC 또는 외부 클릭 시 실행할 콜백 |

## ✅ 예시

```tsx
import { useModalCloseTrigger } from 'hookdle';

interface ModalProps {
  onClose: () => void;
}

function Modal({ onClose }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useModalCloseTrigger({
    ref,
    onClose,
  });

  return (
    <div style={overlayStyle}>
      <div ref={ref} style={modalStyle}>
        <h2>모달입니다</h2>
        <p>ESC를 누르거나 바깥을 클릭하면 닫힙니다.</p>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}
```
