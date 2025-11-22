# useEnterKey

Enter 키 입력 시 콜백 함수 실행과 버튼 클릭을 처리하는 커스텀 React Hook입니다.

입력 요소에 포커스된 상태에서 Enter 키(또는 지정된 키)를 누르면 콜백 함수를 실행하고 연결된 버튼을 자동으로 클릭합니다. 한글 입력 중(IME 조합 중)에는 동작하지 않도록 처리되어 있어 안전합니다.

## 🔗 사용법

```tsx
const { targetRef } = useEnterKey<ElementType>(options);
```

### 매개변수(options)

- `callback: () => void | Promise<void>`
  - 키 입력 시 실행할 콜백 함수
  - 동기 함수와 비동기 함수 모두 지원

- `buttonRef?: RefObject<HTMLElement>`
  - 자동으로 클릭할 버튼의 ref (선택사항)
  - 키 입력 시 해당 버튼의 `click()` 메서드가 호출됩니다

### 반환값

`{ targetRef }`

| 속성        | 타입                               | 설명                             |
| ----------- | ---------------------------------- | -------------------------------- |
| `targetRef` | `RefObject<T extends HTMLElement>` | 키 입력을 감지할 대상 요소의 ref |

---

## ✅ 예시

### 기본 사용법 (Enter 키로 폼 제출)

```tsx
import { useEnterKey } from './hooks/useEnterKey';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = () => {
    console.log('로그인 시도:', { username, password });
  };

  const { targetRef: usernameRef } = useEnterKey<HTMLInputElement>({
    callback: handleSubmit,
    buttonRef,
  });

  const { targetRef: passwordRef } = useEnterKey<HTMLInputElement>({
    callback: handleSubmit,
    buttonRef,
  });

  return (
    <form>
      <input
        ref={usernameRef}
        type="text"
        placeholder="사용자명"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        ref={passwordRef}
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button ref={buttonRef} type="button" onClick={handleSubmit}>
        로그인
      </button>
    </form>
  );
}
```

## 📋 주요 특징

- **IME 조합 처리**: 한글 입력 중(`isComposing` 상태)에는 동작하지 않아 의도치 않은 실행을 방지합니다
- **포커스 기반 동작**: 대상 요소에 포커스된 상태에서만 키 입력을 감지합니다
- **비동기 지원**: 콜백 함수로 비동기 함수도 사용할 수 있습니다
- **이벤트 기본 동작 방지**: `preventDefault()`로 기본 키 동작을 차단합니다
