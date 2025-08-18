# useDarkMode

다크 모드 상태를 관리하는 커스텀 React Hook입니다.

로컬 스토리지에 사용자 설정을 저장하고, 시스템 다크 모드 설정을 자동으로 감지하여 초기값을 설정합니다. 또한 HTML 문서에 `dark` 클래스를 자동으로 추가/제거하여 CSS와 연동할 수 있습니다.

## 🔗 사용법

```tsx
const { darkMode, toggleDarkMode, setDarkMode } = useDarkMode(options);
```

### 매개변수(options)

- `key?: string`
  - 로컬 스토리지에 저장할 고유 키 (선택사항)
  - 기본값: `'darkMode'`
  - 여러 사이트나 앱에서 독립적인 다크모드 설정을 관리할 때 유용합니다

### 반환값

`{ darkMode, toggleDarkMode, setDarkMode }`

| 속성             | 타입                       | 설명                                |
| ---------------- | -------------------------- | ----------------------------------- |
| `darkMode`       | `boolean`                  | 현재 다크 모드 상태                 |
| `toggleDarkMode` | `() => void`               | 다크 모드 상태를 토글하는 함수      |
| `setDarkMode`    | `(value: boolean) => void` | 다크 모드 상태를 직접 설정하는 함수 |

## ✅ 예시

### 기본 사용법

```tsx
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const { darkMode, toggleDarkMode } = useDarkMode();

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

### 사이트별 고유 키 사용

```tsx
import { useDarkMode } from './hooks/useDarkMode';

function AdminPanel() {
  const { darkMode, toggleDarkMode } = useDarkMode({ key: 'admin-darkMode' });

  return (
    <div>
      <h1>관리자 패널</h1>
      <button onClick={toggleDarkMode}>테마 전환</button>
    </div>
  );
}

function UserDashboard() {
  const { darkMode, toggleDarkMode } = useDarkMode({ key: 'user-darkMode' });

  return (
    <div>
      <h1>사용자 대시보드</h1>
      <button onClick={toggleDarkMode}>테마 전환</button>
    </div>
  );
}
```

### 직접 값 설정

```tsx
import { useDarkMode } from './hooks/useDarkMode';

function ThemeSelector() {
  const { darkMode, setDarkMode } = useDarkMode();

  return (
    <div>
      <h2>테마 선택</h2>
      <div>
        <label>
          <input type="radio" name="theme" checked={!darkMode} onChange={() => setDarkMode(false)} />
          라이트 모드
        </label>
        <label>
          <input type="radio" name="theme" checked={darkMode} onChange={() => setDarkMode(true)} />
          다크 모드
        </label>
      </div>
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

html.dark .card {
  background-color: #2a2a2a;
  border-color: #404040;
}

html.dark button {
  background-color: #404040;
  color: white;
}
```

## 📋 주요 특징

- **시스템 설정 감지**: 사용자가 별도 설정을 하지 않은 경우 시스템 다크 모드 설정을 자동 감지
- **지속성**: 로컬 스토리지에 사용자 설정을 저장하여 페이지 새로고침 후에도 설정 유지
- **실시간 반응**: 시스템 다크 모드 설정이 변경되면 자동으로 반영 (사용자가 수동 설정하지 않은 경우)
- **CSS 자동 연동**: HTML 요소에 `dark` 클래스 자동 추가/제거
- **사이트별 독립 설정**: 고유 키를 통해 여러 사이트에서 각각 다른 설정 관리 가능

## ⚠️ 주의사항

- `localStorage`를 사용하므로 브라우저 환경에서만 동작합니다
- 여러 컴포넌트에서 동일한 키로 훅을 사용할 경우 상태가 동기화됩니다
