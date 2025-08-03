# useDarkMode

다크 모드 상태를 관리하는 커스텀 React Hook입니다.

로컬 스토리지에 사용자 설정을 저장하고, 시스템 다크 모드 설정을 자동으로 감지하여 초기값을 설정합니다. 또한 HTML 문서에 `dark` 클래스를 자동으로 추가/제거하여 CSS와 연동할 수 있습니다.

## 🔗 사용법

```tsx
const [darkMode, toggleDarkMode] = useDarkMode();
```

### 매개변수

이 Hook은 매개변수를 받지 않습니다.

### 반환값

`[darkMode, toggleDarkMode]`

| 인덱스 | 이름             | 타입         | 설명                           |
| ------ | ---------------- | ------------ | ------------------------------ |
| `0`    | `darkMode`       | `boolean`    | 현재 다크 모드 상태            |
| `1`    | `toggleDarkMode` | `() => void` | 다크 모드 상태를 토글하는 함수 |

## ✅ 예시

```tsx
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    <div className={darkMode ? 'dark-theme' : 'light-theme'}>
      <header>
        <h1>My App</h1>
        <button onClick={toggleDarkMode}>{darkMode ? '🌞 라이트 모드' : '🌙 다크 모드'}</button>
      </header>
      <main>
        <p>현재 테마: {darkMode ? '다크' : '라이트'}</p>
      </main>
    </div>
  );
}
```

## 🎨 CSS 연동

Hook이 자동으로 `html` 요소에 `dark` 클래스를 추가하므로, CSS에서 다크 모드 스타일을 쉽게 적용할 수 있습니다:

```css
/* 라이트 모드 (기본) */
body {
  background-color: white;
  color: black;
}

/* 다크 모드 */
html.dark body {
  background-color: #1a1a1a;
  color: white;
}
```
