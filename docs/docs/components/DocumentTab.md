# DocumentTab

브라우저 **탭의 제목(title)** 과 **파비콘(favicon)** 을 라우트(pathname)에 맞춰 동적으로 변경하고, 컴포넌트 언마운트 시 원래 상태로 복구해주는 React 컴포넌트입니다.

- 경로별로 다른 제목과 파비콘을 손쉽게 지정할 수 있습니다.
- 라우팅 시 자동으로 탭 제목과 아이콘이 바뀌어 UX를 개선할 수 있습니다.
- cleanup 시 원래 값으로 되돌려주므로, 다른 컴포넌트와 충돌하지 않습니다.

---

## 🔗 사용법

```tsx
<DocumentTab meta={meta} />
```

### props

| 이름   | 타입     | 설명                           |
| ------ | -------- | ------------------------------ |
| `meta` | `Meta[]` | 경로별로 적용할 메타 정보 배열 |

### `Meta` 구조

| 필드      | 타입     | 설명                                             |
| --------- | -------- | ------------------------------------------------ |
| `path`    | `string` | 경로 패턴 (예: `'/'`, `'/about'`, `'/user/:id'`) |
| `title`   | `string` | 브라우저 탭에 표시할 제목                        |
| `favicon` | `string` | 브라우저 탭에 표시할 파비콘 이미지 URL           |

---

### 반환값

없음 (`null` 렌더링)

> 이 컴포넌트는 전역 document 상태를 제어하는 사이드 이펙트 전용입니다.

---

## ✅ 예시

### 기본 예시

```tsx
import { DocumentTab } from 'componentdle';

const meta = [
  { path: '/', title: '홈 | MyApp', favicon: '/home.ico' },
  { path: '/about', title: '소개 | MyApp', favicon: '/about.ico' },
  { path: '/contact', title: '연락처 | MyApp', favicon: '/contact.ico' },
];

function App() {
  return (
    <>
      <DocumentTab meta={meta} />
      <div>앱 콘텐츠</div>
    </>
  );
}
```

---

### 라우트별로 다르게 적용하기 (React Router)

```tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { DocumentTab } from 'hookdle';

const meta = [
  { path: '/', title: '홈 | MyApp', favicon: 'https://cdn-icons-png.flaticon.com/512/25/25694.png' },
  { path: '/about', title: '소개 | MyApp', favicon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png' },
  { path: '/contact', title: '연락처 | MyApp', favicon: 'https://cdn-icons-png.flaticon.com/512/561/561127.png' },
  { path: '/user/:id', title: '사용자 상세 | MyApp', favicon: '/user.ico' },
];

export default function App() {
  return (
    <BrowserRouter>
      <DocumentTab meta={meta} />
      <nav>
        <Link to="/">홈</Link> | <Link to="/about">소개</Link> | <Link to="/contact">연락처</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1>홈</h1>} />
        <Route path="/about" element={<h1>소개</h1>} />
        <Route path="/contact" element={<h1>연락처</h1>} />
        <Route path="/user/:id" element={<h1>사용자 상세</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 💡 만약 이 컴포넌트가 없다면?

직접 `document.title`과 `<link rel="icon">`을 경로마다 관리해야 합니다.

```tsx
useEffect(() => {
  const prevTitle = document.title;
  document.title = '홈 | MyApp';

  let link = document.querySelector<HTMLLinkElement>('link[rel*="icon"]');
  const prevFavicon = link?.href;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = 'home.ico';

  return () => {
    document.title = prevTitle;
    if (prevFavicon && link) link.href = prevFavicon;
  };
}, []);
```

이처럼 직접 구현하면 **경로별 분기 처리, 초기값 저장/복구, favicon 태그 생성**까지 모두 수동으로 관리해야 합니다.

`<DocumentTab />`을 사용하면 이 과정을 단순화하여 한 곳에서 깔끔하게 관리할 수 있습니다.
