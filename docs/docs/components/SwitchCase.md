# SwitchCase

`value` 에 따라 조건 분기된 JSX를 렌더링할 수 있는 React 유틸리티 컴포넌트입니다.

`switch`문이나 `if`문을 반복 작성하지 않고도 간결하게 UI 분기를 구현할 수 있습니다.

## 🔗 사용법

```tsx
<SwitchCase
  value={currentTab}
  caseBy={{
    home: <HomePage />,
    about: <AboutPage />,
  }}
  defaultComponent={<NotFoundPage />}
/>
```

### 매개변수

| 이름               | 타입                                         | 설명                                                  |
| ------------------ | -------------------------------------------- | ----------------------------------------------------- |
| `value`            | `string \| number`                           | 렌더링할 컴포넌트를 결정하는 키 값                    |
| `caseBy`           | `Partial<Record<Case, JSX.Element \| null>>` | 각 `value`에 대응되는 컴포넌트 매핑                   |
| `defaultComponent` | `JSX.Element \| null`                        | 일치하는 `value`가 없을 경우 렌더링할 컴포넌트 (옵션) |

### 반환값

조건에 맞는 JSX 컴포넌트를 반환합니다. 일치하는 `value`가 없을 경우 `defaultComponent`를 반환합니다.

## ✅ 예시

```tsx
import { SwitchCase } from 'componentdle';

function PageContainer({ tab }: { tab: string }) {
  return (
    <SwitchCase
      value={tab}
      caseBy={{
        home: <HomePage />,
        about: <AboutPage />,
        contact: <ContactPage />,
      }}
      defaultComponent={<NotFoundPage />}
    />
  );
}
```
