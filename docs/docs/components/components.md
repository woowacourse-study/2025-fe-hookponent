---
sidebar_position: 3
---

# components

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

## 지원 환경

- **Node.js**: 최신 LTS 버전 권장
- **React**: 16.8 이상
- **TypeScript**: 내장 타입 선언 지원

## 문제 해결

### 일반적인 문제들

1. **설치 오류 시**

   ```bash
   npm cache clean --force
   npm install componentdle
   ```

2. **TypeScript 오류 시**
   - 프로젝트의 `tsconfig.json`에서 `"moduleResolution": "node"` 설정 확인
   - `node_modules/@types` 폴더에서 충돌하는 타입 정의 확인

## 추가 리소스

- [NPM 패키지 페이지](https://www.npmjs.com/package/componentdle)
- React 공식 문서
- TypeScript 공식 문서
