# useProgress

`useProgress`는 프로그레스바의 진행률을 부드럽게 애니메이션화하는 커스텀 훅입니다. 주로 `@hookdle/components`의 `Progressbar` 컴포넌트와 함께 사용되어 로딩 상태나 진행 상태를 시각적으로 표현하는데 활용됩니다.

초기 진행률에서 목표 진행률까지 지정된 시간 동안 자연스럽게 증가하며, 필요할 때 complete 함수를 사용하여 즉시 100%로 완료할 수 있습니다. Cubic easing 함수를 사용하여 자연스러운 애니메이션 감속 효과를 구현하며, `requestAnimationFrame`을 통해 최적화된 애니메이션을 제공합니다.

## 🔗 사용법

```tsx
const { progress, complete } = useProgress({
  duration: 5000,
  initialProgress: 0,
  targetProgress: 100,
});
```

### 매개변수

| 이름              | 타입     | 기본값 | 설명                          |
| ----------------- | -------- | ------ | ----------------------------- |
| `duration`        | `number` | `5000` | 애니메이션 진행 시간 (밀리초) |
| `initialProgress` | `number` | `0`    | 시작 진행률 (0-100)           |
| `targetProgress`  | `number` | `100`  | 목표 진행률 (0-100)           |

### 반환값

`{ progress, complete }`

| 이름       | 타입         | 설명                              |
| ---------- | ------------ | --------------------------------- |
| `progress` | `number`     | 현재 진행률 (0-100)               |
| `complete` | `() => void` | 프로그레스를 100%로 완료하는 함수 |

---

## ✅ 예시

### 기본 사용법

```tsx
import { Progressbar } from '@hookdle/components';

function Example() {
  const { progress, complete } = useProgress({
    duration: 3000,
    initialProgress: 0,
    targetProgress : 90
  });

  return (
      <Progressbar value={progress} />
      <button onClick={complete}>complete</button>
  );
}
```

### 특징

- **최적화된 애니메이션**: `requestAnimationFrame`을 사용하여 브라우저의 렌더링 주기에 최적화된 애니메이션 구현
- **부드러운 감속 효과**: Cubic easing 함수 `(1-t)³`를 적용하여 자연스러운 감속 효과 제공
- **메모리 관리**: 컴포넌트 언마운트 시 자동으로 애니메이션 정리
- **성능 최적화**:
  - 소수점 3자리까지만 계산하여 성능과 정확도의 균형 유지
  - 불필요한 상태 업데이트 방지
- **자동 진행**: 설정된 시간 동안 목표 진행률까지 자동으로 증가
- **수동 완료**: `complete` 함수로 언제든지 100%로 완료 가능 (500ms 동안 애니메이션)
- **커스터마이징**: 진행 시간, 시작/목표 진행률을 자유롭게 설정 가능

### ✨ [tip] 프로그레스바 컴포넌트와 함께 사용하기

> `useProgress` 훅은 `@hookdle/components`의 `Progressbar` 컴포넌트와 함께 사용하면 더욱 편리합니다. 자세한 내용은 [Progressbar](/docs/components/progressbar) 문서를 참고해 주세요.

### 스크린샷

![link](https://private-user-images.githubusercontent.com/74090200/487232442-4a77ca0d-4cbb-4c45-bf90-a740e188d8b5.gif?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTc0MTM3MDYsIm5iZiI6MTc1NzQxMzQwNiwicGF0aCI6Ii83NDA5MDIwMC80ODcyMzI0NDItNGE3N2NhMGQtNGNiYi00YzQ1LWJmOTAtYTc0MGUxODhkOGI1LmdpZj9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA5MDklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwOTA5VDEwMjMyNlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTNkZmU0YmU4ZGZkMTRiOTUxNzFkYjYxZmRjMDQzM2U1ZmZiZDYzZjc0ZTIxNzFhZmM0NmJhOWU2ZDIzN2UyODcmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.adx-FbSaay4gxuiJ-PdaOdkF67T7_7wNGUd6xs7GO7M)
