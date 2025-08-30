---
sidebar_position: 2
---

# hooks

React 애플리케이션에서 사용할 수 있는 커스텀 훅 라이브러리입니다.

## 설치

### npm으로 설치

```bash
npm install hookdle
```

### yarn으로 설치

```bash
yarn add hookdle
```

### pnpm으로 설치

```bash
pnpm add hookdle
```

## 패키지 정보

- **버전**: 1.0.9
- **TypeScript 지원**: ✅ 내장 타입 선언 포함
- **라이선스**: 없음 (None)
- **패키지 크기**: 88.1 kB (압축 해제 시)

## 사용법

### 기본 import

```typescript
import {} from /* 필요한 훅들 */ 'hookdle';
```

### TypeScript 지원

hookdle은 TypeScript로 작성되었으며 내장 타입 선언을 제공합니다. 별도의 `@types` 패키지 설치가 필요하지 않습니다.

```typescript
import {} from /* 훅 이름들 */ 'hookdle';
```

## 주요 특징

- ⚡ 가벼우면서도 강력한 React 훅 컬렉션
- 📘 완전한 TypeScript 지원
- 🔧 개발자 친화적인 API
- 🎯 React 함수형 컴포넌트에 최적화

## 요구사항

- React 16.8.0 이상 (Hooks를 지원하는 버전)
- Node.js (개발 환경)

## 개발 환경 설정

프로젝트에 hookdle을 추가한 후, React 컴포넌트에서 바로 사용할 수 있습니다:

```jsx
import React from 'react';
import {} from /* 사용할 훅 */ 'hookdle';

function MyComponent() {
  // hookdle의 훅들을 여기서 사용

  return <div>{/* 컴포넌트 JSX */}</div>;
}

export default MyComponent;
```

