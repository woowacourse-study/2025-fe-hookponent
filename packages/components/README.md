# 🧩 Componentdle

> React 프로젝트에 바로 쓸 수 있는 실용적인 재사용 컴포넌트 모음

[![npm version](https://img.shields.io/npm/v/componentdle.svg)](https://www.npmjs.com/package/componentdle)
[![license](https://img.shields.io/npm/l/componentdle.svg)](https://github.com/woowacourse-study/2025-fe-hookponent/blob/main/LICENSE)

## 📦 설치

```bash
npm install componentdle

# or

yarn add componentdle

# or

pnpm add componentdle
```

## 🚀 빠른 시작 예시

```tsx
import { SwitchCase, DocumentTab, Motion } from 'componentdle';

function App() {
  return (
    <SwitchCase
      value={status}
      caseBy={{
        loading: <LoadingSpinner />,
        success: <SuccessMessage />,
        error: <ErrorMessage />,
      }}
    />
  );
}
```

## 📖 컴포넌트 목록

| 컴포넌트 이름 | 설명                                            |
| ------------- | ----------------------------------------------- |
| `SwitchCase`  | 조건부 렌더링을 선언적으로 처리하는 컴포넌트    |
| `DocumentTab` | 브라우저 탭 타이틀을 동적으로 관리하는 컴포넌트 |
| `Motion`      | 애니메이션을 간편하게 적용할 수 있는 컴포넌트   |

## 📋 요구사항

- **React**: ^18.0.0 이상
- **TypeScript**: ^5.0.0 이상 (선택사항, 타입 정의 포함)

> 💡 `componentdle`은 외부 의존성이 없으며, React만 있으면 바로 사용할 수 있습니다.

## 📚 상세 문서

전체 문서와 API 레퍼런스는 [Hookponent 공식 문서](https://hookponent.vercel.app/)에서 확인하세요.

## 🤝 기여

이 프로젝트는 [Hookponent 스터디](https://github.com/woowacourse-study/2025-fe-hookponent)에서 관리됩니다.
기여는 언제나 환영합니다!

## 📄 라이선스

MIT © Hookponent Team
