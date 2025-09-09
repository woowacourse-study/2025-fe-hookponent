# useProgress

`useProgress`는 프로그레스 바의 진행률을 부드럽게 애니메이션화하는 커스텀 훅입니다.

초기 진행률에서 목표 진행률까지 지정된 시간 동안 자연스럽게 증가하며, 필요할 때 즉시 100%로 완료할 수 있습니다.

## 🔗 사용법

```tsx
const { progress, complete } = useProgress({
  duration: 5000,
  initialProgress: 0,
  targetProgress: 90,
});
```

### 매개변수

| 이름              | 타입     | 기본값 | 설명                          |
| ----------------- | -------- | ------ | ----------------------------- |
| `duration`        | `number` | `5000` | 애니메이션 진행 시간 (밀리초) |
| `initialProgress` | `number` | `0`    | 시작 진행률 (0-100)           |
| `targetProgress`  | `number` | `90`   | 목표 진행률 (0-100)           |

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
function ProgressBar() {
  const { progress, complete } = useProgress({
    duration: 3000,
    initialProgress: 0,
    targetProgress: 90,
  });

  return (
    <div>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <button onClick={complete}>Complete</button>
    </div>
  );
}
```

### CSS 스타일링

```css
.progress-container {
  width: 500px;
  height: 10px;
  background-color: #eee;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #007bff;
  transition: width 0.3s ease;
}
```

### 특징

- 부드러운 애니메이션: CSS transition과 함께 사용하여 자연스러운 진행률 변화
- 자동 진행: 설정된 시간 동안 목표 진행률까지 자동으로 증가
- 수동 완료: `complete` 함수로 언제든지 100%로 완료 가능
- 커스터마이징: 진행 시간, 시작/목표 진행률을 자유롭게 설정 가능

### 활용 사례

- 파일 업로드 진행률 표시
- 페이지 로딩 인디케이터
- 단계별 프로세스 진행 상태 표시
- 게임 로딩 화면

### 스크린샷

![link](https://private-user-images.githubusercontent.com/74090200/487227624-a9dd7683-cff8-43df-8bb0-292989cd6291.gif?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTc0MTI5OTYsIm5iZiI6MTc1NzQxMjY5NiwicGF0aCI6Ii83NDA5MDIwMC80ODcyMjc2MjQtYTlkZDc2ODMtY2ZmOC00M2RmLThiYjAtMjkyOTg5Y2Q2MjkxLmdpZj9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA5MDklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwOTA5VDEwMTEzNlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWM1NzYxMDM4NDFjZDY2NTM2OWYzNjE5NWI2NGFkYmU0ZGFhNWY3NTMwZTNmNjA2ODUyZmIyYjVkYzY0YWFjYTgmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.WE2qeU9C2w2LcmslKgoaCW2sp9YGAT4XtK6l9CUjNQg)
