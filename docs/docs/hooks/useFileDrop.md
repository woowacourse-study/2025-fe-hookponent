# useFileDrop

`useFileDrop`은 지정한 영역에 파일을 드래그 앤 드롭하여 업로드할 수 있도록 도와주는 커스텀 훅입니다.  
파일 드롭 시 파일 목록과 드래그 상태를 관리하고, 확장자 제한, 최대 개수 제한, 에러 메시지 처리 기능도 제공합니다.

## 🔗 사용법

```ts
const { ref, isOver, files, error, getDropZoneProps } = useFileDrop({
  onDrop: (e, files) => console.log('dropped:', files),
  onEnter: () => console.log('drag enter'),
  onLeave: () => console.log('drag leave'),
  disabled: false,
  extensions: ['png', 'jpg'],
  maxFiles: 5,
});
```

### 매개변수 (options)

| 이름         | 타입                                                          | 설명                                                      |
| ------------ | ------------------------------------------------------------- | --------------------------------------------------------- |
| `onDrop`     | `(e: React.DragEvent<HTMLDivElement>, files: File[]) => void` | 파일 드롭 시 실행되는 콜백 (optional)                     |
| `onEnter`    | `() => void`                                                  | 드래그가 영역에 들어올 때 실행되는 콜백 (optional)        |
| `onLeave`    | `() => void`                                                  | 드래그가 영역을 벗어날 때 실행되는 콜백 (optional)        |
| `disabled`   | `boolean`                                                     | 드롭존 비활성화 여부 (optional)                           |
| `extensions` | `string[]`                                                    | 허용할 파일 확장자 목록 (예: `['png', 'jpg']`) (optional) |
| `maxFiles`   | `number`                                                      | 업로드 가능한 최대 파일 개수 (optional)                   |

### 반환값

`{ ref, isOver, files, getDropZoneProps, error }`

| 이름               | 타입                                                     | 설명                                          |
| ------------------ | -------------------------------------------------------- | --------------------------------------------- |
| `ref`              | `RefObject<HTMLDivElement>`                              | 드롭존으로 사용할 DOM 요소에 연결할 ref       |
| `isOver`           | `boolean`                                                | 현재 드래그 중인지 여부                       |
| `files`            | `File[]`                                                 | 드롭된 파일들의 목록                          |
| `getDropZoneProps` | `() => { onDragOver, onDrop, onDragEnter, onDragLeave }` | 드롭존에 필요한 이벤트 핸들러를 반환하는 함수 |
| `error`            | `Error \| null`                                          | 제약 위반 시 발생한 에러 (optional)           |

---

## ✅ 예시

```tsx
import { useFileDrop } from './hooks/useFileDrop';

function App() {
  const { ref, isOver, files, error, getDropZoneProps } = useFileDrop({
    extensions: ['png', 'jpg'],
    maxFiles: 3,
  });

  return (
    <div>
      <div ref={ref} {...getDropZoneProps()}>
        {isOver ? '여기에 파일을 놓으세요!' : '파일을 드래그 앤 드롭하세요'}
      </div>

      {error && <p style={{ color: 'red' }}>{error.message}</p>}

      <ul>
        {files.map((f) => (
          <li key={`${f.name}-${f.lastModified}`}>{f.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```
