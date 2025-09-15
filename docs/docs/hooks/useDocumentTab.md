# useDocumentTab

브라우저 **탭의 제목(title)** 과 **파비콘(favicon)** 을 동적으로 변경하고, 컴포넌트 언마운트 시 원래 상태로 복구해주는 커스텀 React 훅입니다.

- 페이지 별로 다른 제목과 파비콘을 손쉽게 적용할 수 있습니다.
- 라우팅 시 탭 제목과 아이콘을 함께 바꿔주어 UX를 개선할 수 있습니다.
- cleanup 시 원래 값으로 되돌려주므로, 다른 컴포넌트와 충돌하지 않습니다.

---

## 🔗 사용법

```tsx
useDocumentTab(options);
```

### 매개변수

| 이름      | 타입     | 설명                                                                   |
| --------- | -------- | ---------------------------------------------------------------------- |
| `options` | `object` | 설정 옵션 (`title`, `favicon`)                                         |
| `title`   | `string` | 브라우저 탭에 표시할 제목                                              |
| `favicon` | `string` | 브라우저 탭에 표시할 파비콘 이미지 URL (내부 경로 또는 외부 링크 가능) |

---

### 반환값

없음 (`void`)

> 이 훅은 단순히 전역 document 상태를 조작하기 때문에 반환값을 제공하지 않습니다.

---

## ✅ 예시

### 기본 예시

```tsx
import { useDocumentTab } from 'hookdle';

function HomePage() {
  useDocumentTab({
    title: '홈 | MyApp',
    favicon: 'https://cdn-icons-png.flaticon.com/512/25/25694.png',
  });

  return <h1>홈</h1>;
}
```

---

### 라우트별로 다르게 적용하기 (React Router)

```tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router';
import { useDocumentTab } from 'hookdle';

function Home() {
  useDocumentTab({ title: '홈 | MyApp', favicon: 'https://cdn-icons-png.flaticon.com/512/25/25694.png' });
  return <h1>홈</h1>;
}

function About() {
  useDocumentTab({ title: '소개 | MyApp', favicon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png' });
  return <h1>소개</h1>;
}

function Contact() {
  useDocumentTab({ title: '연락처 | MyApp', favicon: 'https://cdn-icons-png.flaticon.com/512/561/561127.png' });
  return <h1>연락처</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">홈</Link> | <Link to="/about">소개</Link> | <Link to="/contact">연락처</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 💡 만약 이 훅이 없다면?

직접 `document.title`과 `<link rel="icon">`을 제어해야 합니다.

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
  link.href = 'https://cdn-icons-png.flaticon.com/512/25/25694.png';

  return () => {
    document.title = prevTitle;
    if (prevFavicon && link) link.href = prevFavicon;
  };
}, []);
```

이처럼 직접 구현하면 **초기값 저장/복구, favicon 태그 생성, cleanup 관리**까지 모두 수동으로 처리해야 합니다.

`useDocumentTab`을 사용하면 이 과정을 간단하게 추상화할 수 있습니다.
