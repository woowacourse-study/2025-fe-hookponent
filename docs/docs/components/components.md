---
sidebar_position: 3
---

# component

## componentdle

## 설치

### NPM을 사용한 설치

```bash
npm install componentdle
```

### Yarn을 사용한 설치

```bash
yarn add componentdle
```

### pnpm을 사용한 설치

```bash
pnpm add componentdle
```

## 사용법

### 기본 사용법

```javascript
import {} from /* 필요한 컴포넌트들 */ 'componentdle';

// 컴포넌트 사용 예제
function MyComponent() {
  return <div>{/* componentdle 컴포넌트 사용 */}</div>;
}
```

### TypeScript 사용법

이 패키지는 내장 TypeScript 선언을 포함하고 있어 별도의 `@types` 패키지 설치가 필요하지 않습니다.

```typescript
import type { /* 필요한 타입들 */ } from 'componentdle';
import { /* 필요한 컴포넌트들 */ } from 'componentdle';

// TypeScript 환경에서의 사용 예제
const MyTypedComponent: React.FC = () => {
  return (
    <div>
      {/* componentdle 컴포넌트 사용 */}
    </div>
  );
};
```
