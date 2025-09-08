# Motion

HTML 요소에 회전 애니메이션을 적용할 수 있는 React 컴포넌트입니다.

`requestAnimationFrame`을 사용하여 부드러운 회전 애니메이션을 구현하며, 반복 및 지연 시간 설정이 가능합니다.

## 🔗 사용법

```tsx
<Motion.div
  animate={{ rotate: 360 }}
  transition={{
    duration: 2,
    repeat: 'Infinity',
    ease: 'ease-in-out',
    repeatDelay: 0.5,
  }}
>
  회전하는 요소
</Motion.div>
```

### 매개변수

| 이름         | 타입                           | 설명                                         |
| ------------ | ------------------------------ | -------------------------------------------- |
| `animate`    | `AnimateProps`                 | 애니메이션 속성을 정의하는 객체              |
| `transition` | `TransitionProps`              | 애니메이션의 동작을 제어하는 설정 객체       |
| `ref`        | `React.RefObject<HTMLElement>` | DOM 요소에 접근하기 위한 ref 객체 (선택사항) |
| `style`      | `React.CSSProperties`          | 추가적인 스타일 속성 (선택사항)              |
| `...props`   | `React.ComponentPropsWithRef`  | 기타 HTML 속성들                             |

#### AnimateProps

| 이름     | 타입     | 설명                      |
| -------- | -------- | ------------------------- |
| `rotate` | `number` | 회전할 각도 (degree 단위) |

#### TransitionProps

| 이름          | 타입                                                             | 기본값     | 설명                             |
| ------------- | ---------------------------------------------------------------- | ---------- | -------------------------------- |
| `duration`    | `number`                                                         | `1`        | 애니메이션 지속 시간 (초 단위)   |
| `repeat`      | `number \| 'Infinity'`                                           | `1`        | 반복 횟수 (숫자 또는 'Infinity') |
| `ease`        | `'linear' \| 'ease' \| 'ease-in' \| 'ease-out' \| 'ease-in-out'` | `'linear'` | 가속도 타입                      |
| `repeatDelay` | `number`                                                         | `0`        | 반복 사이 지연 시간 (초 단위)    |

### 지원하는 컴포넌트

- `Motion.div`
- `Motion.span`
- `Motion.img`
- `Motion.p`
- `Motion.button`

## ✅ 예시

### 기본 회전

```tsx
<Motion.div animate={{ rotate: 180 }} transition={{ duration: 2 }}>
  180도 회전
</Motion.div>
```

### 무한 반복 회전

```tsx
<Motion.div
  animate={{ rotate: 360 }}
  transition={{
    duration: 2,
    repeat: 'Infinity',
    ease: 'ease-in-out',
  }}
>
  계속 회전
</Motion.div>
```

### 반복 회전 with 딜레이

```tsx
<Motion.div
  animate={{ rotate: 180 }}
  transition={{
    duration: 1,
    repeat: 3,
    repeatDelay: 0.5,
    ease: 'ease',
  }}
>
  3번 반복 회전 (회전 사이 0.5초 딜레이)
</Motion.div>
```

### ref 사용 예시

```tsx
function RotatingImage() {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // 이미지 로드 완료 시 처리
    if (imgRef.current) {
      console.log('이미지 크기:', {
        width: imgRef.current.width,
        height: imgRef.current.height,
      });
    }
  }, []);

  return <Motion.img ref={imgRef} src="/logo.png" animate={{ rotate: 360 }} transition={{ duration: 2 }} />;
}
```

### 스크린샷

![gif](https://private-user-images.githubusercontent.com/74090200/486781891-3a70f237-9005-46bb-aab9-cfaae8283205.gif?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTczMzc4MzAsIm5iZiI6MTc1NzMzNzUzMCwicGF0aCI6Ii83NDA5MDIwMC80ODY3ODE4OTEtM2E3MGYyMzctOTAwNS00NmJiLWFhYjktY2ZhYWU4MjgzMjA1LmdpZj9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA5MDglMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwOTA4VDEzMTg1MFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWE0ODQ2OGI3NmRjYTQ5MTkxMzkwZGI3NzViNWNkNGI3NGI4Yjg1NTBkMTNmMWNkNzUxMWQ1YzYwMTMyNjFhNTImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.yNWGoAt_90sermT3ysGvLAjLOYB9lmBW8ZrDMwVYBUk)
