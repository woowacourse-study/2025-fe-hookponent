# Progressbar

진행 상태를 시각적으로 표시하는 프로그레스바 컴포넌트입니다. `useProgress` 훅과 함께 사용하면 부드러운 애니메이션 효과를 구현할 수 있습니다.

## Props

| 속성            | 타입   | 기본값 | 설명                              |
| --------------- | ------ | ------ | --------------------------------- |
| progress        | number | -      | 진행률을 나타내는 값 (0-100)      |
| width           | number | 500    | 프로그레스바의 너비 (px)          |
| height          | number | 10     | 프로그레스바의 높이 (px)          |
| backgroundColor | string | '#999' | 프로그레스바 배경색               |
| barColor        | string | '#000' | 프로그래스 진행 상태바 표시 색상  |
| borderRadius    | number | 10     | 프로그레스바의 모서리 둥글기 (px) |

## 예제

### 기본 사용법

```tsx
import { Progressbar } from '@hookdle/components';
import { useProgress } from '@hookdle/hooks';

function BasicExample() {
  const { progress } = useProgress();

  return <Progressbar progress={progress} />;
}
```

### 커스텀 스타일링

```tsx
import { Progressbar } from '@hookdle/components';
import { useProgress } from '@hookdle/hooks';

function CustomExample() {
  const { progress } = useProgress();

  return (
    <Progressbar
      progress={progress}
      width={300}
      height={20}
      backgroundColor="#f0f0f0"
      barColor="#007bff"
      borderRadius={5}
    />
  );
}
```

### 수동 진행률 제어

```tsx
import { Progressbar } from '@hookdle/components';

function ManualExample() {
  const [progress, setProgress] = useState(0);

  return <Progressbar progress={progress} width={400} barColor="#28a745" />;
}
```

## 참고 사항

- `progress` 값은 0에서 100 사이의 숫자여야 합니다.
- 컴포넌트는 `memo`로 최적화되어 있어 불필요한 리렌더링을 방지합니다.
- `useProgress` 훅과 함께 사용하면 자동으로 부드러운 애니메이션이 적용됩니다.
- 모든 스타일 속성은 선택적이며, 기본값이 제공됩니다.
