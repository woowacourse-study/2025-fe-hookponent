# useTextClipboard

클립보드에 텍스트를 복사, 붙여넣기, 초기화할 수 있는 커스텀 `React Hook`입니다.
복사 성공 여부(`isCopied`), 현재 클립보드 값(`clipboardText`), 에러(`error`)를 상태로 관리합니다.

## 🔗 사용법

```tsx
const { isCopied, clipboardText, error, copy, paste, reset } = useTextClipboard(timeout);
```

### 매개변수

| 이름      | 타입   | 설명                                                          |
| --------- | ------ | ------------------------------------------------------------- |
| `timeout` | number | 복사 성공 상태(`isCopied`)가 유지되는 시간(ms). 기본값 `2000` |

### 반환값

객체 형태로 상태와 메서드를 반환합니다.

| 이름            | 타입                              | 설명                                              |
| --------------- | --------------------------------- | ------------------------------------------------- |
| `isCopied`      | `boolean`                         | 복사 성공 여부                                    |
| `clipboardText` | `string \| null`                  | 클립보드의 현재 텍스트                            |
| `error`         | `Error \| null`                   | 복사/붙여넣기 시 발생한 에러                      |
| `copy`          | `(text: string) => Promise<void>` | 텍스트를 클립보드에 복사                          |
| `paste`         | `() => Promise<string \| null>`   | 클립보드에서 텍스트를 읽어 반환                   |
| `reset`         | `() => void`                      | 상태(`isCopied`, `clipboardText`, `error`) 초기화 |

## ✅ 예시

```tsx
import { useTextClipboard } from 'hookdle';

function ClipboardExample() {
  const { isCopied, clipboardText, error, copy, paste, reset } = useTextClipboard(3000);

  return (
    <div>
      <button onClick={() => copy('Hello World')}>{isCopied ? '✅ Copied!' : '📋 Copy'}</button>

      <button
        onClick={async () => {
          const text = await paste();
          console.log('Clipboard text:', text);
        }}
      >
        📥 Paste
      </button>

      <button onClick={reset}>Reset</button>

      <div>현재 클립보드: {clipboardText ?? '없음'}</div>
      {error && <div style={{ color: 'red' }}>에러: {error.message}</div>}
    </div>
  );
}
```
