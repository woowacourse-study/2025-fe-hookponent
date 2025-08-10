# `useLockBodyScroll`

- 모달 등 **컴포넌트가 마운트된 동안 `document.body` 스크롤을 잠그고**, 언마운트 시 **원래 상태로 복원**하는 커스텀 Hook입니다.
- 여러 모달이 동시에 떠 있어도 **마지막 하나가 닫힐 때까진 잠금 유지**되도록 카운팅합니다.

---

## ✨ 특징

- 마운트 시 `body.style.overflow = 'hidden'` / 언마운트 시 **원래 값으로 복원**
- **다중 모달 안전**: 중첩 사용 시 마지막 언마운트에서만 복원
- 훅 네이밍 **명시적**: 훅 호출만으로 “이 컴포넌트가 떠 있는 동안 잠금” 의도 표현

---

## 🔗 시그니처

```tsx
useLockBodyScroll(): void
```

인자·반환값 없음. (컴포넌트 내부 (ex. 모달)에서 호출하면 끝)

---

## 🧩 사용법

```tsx
import { useLockBodyScroll } from 'hookdle';

function MyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  useLockBodyScroll(); // 모달이 떠 있는 동안만 body 스크롤 잠금

  return (
    <div className="modal">
      <h2>모달</h2>
      <button onClick={onClose}>닫기</button>
    </div>
  );
}
```

**다중 모달 예시**

```tsx
// 두 모달 모두 내부에서 useLockBodyScroll() 호출
{openA && <ModalA />}
{openB && <ModalB />}
```

A 열기 → B 열기 → B 닫기 → **(여전히 잠금)** → A 닫기 → 복원

---

## 💡 이 훅이 없으면?

모달마다 `overflow`를 직접 설정/복원하고, 다중 모달 충돌도 직접 처리해야 합니다.

```jsx
useEffect(() => {
  let savedOverflow = '';

  if (open) {
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  return () => {
    // 이 시점에서는 effect 실행 시점의 savedOverflow를 기억하고 있음
    document.body.style.overflow = savedOverflow || 'visible';
  };
}, [open]);
```
