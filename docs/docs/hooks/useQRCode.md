# useQRCode

URL을 QR 코드로 변환하는 React 훅입니다.

## 설명

`useQRCode`는 URL이나 텍스트를 QR 코드 이미지로 변환하는 간단하고 직관적인 훅입니다. 생성된 QR 코드는 Data URL 형태로 제공되어 `<img>` 태그에서 바로 사용할 수 있습니다.

## API

```typescript
function useQRCode(
  url: string,
  options?: {
    size?: number; // QR 코드 크기 (픽셀, 기본값: 256)
    margin?: number; // QR 코드 주변 여백 (기본값: 2)
    color?: string; // QR 코드 전경색 (기본값: '#000000')
    backgroundColor?: string; // QR 코드 배경색 (기본값: '#ffffff')
  }
): {
  qrCodeUrl: string | null; // 생성된 QR 코드의 Data URL
  isLoading: boolean; // 생성 중 여부
  errorMessage: string | null; // 에러 메시지
};
```

## 사용 예시

```tsx
import { useQRCode } from '@hookdle/hooks';

function QRCodeExample() {
  const { qrCodeUrl, isLoading, errorMessage } = useQRCode('https://example.com', {
    size: 200,
    color: '#000000',
    backgroundColor: '#ffffff',
  });

  if (isLoading) return <div>Loading...</div>;
  if (errorMessage) return <div>Error: {errorMessage}</div>;

  return qrCodeUrl ? <img src={qrCodeUrl} alt="QR Code" /> : null;
}
```

## 특징

- **간단한 사용법**: URL만 제공하면 바로 QR 코드 생성
- **커스터마이징**: 크기, 색상, 여백 등 다양한 옵션 제공
- **타입 안전성**: TypeScript로 작성되어 완벽한 타입 지원
- **에러 처리**: 로딩 상태와 에러 메시지 제공
- **높은 오류 정정 레벨**: QR 코드 손상에 대한 내구성 확보

## 주의사항

1. URL이 없거나 빈 문자열인 경우 `qrCodeUrl`은 `null`을 반환합니다.
2. 옵션은 선택사항이며, 기본값이 제공됩니다.
3. 생성된 QR 코드는 Data URL 형식이므로 `<img>` 태그의 `src` 속성에 직접 사용할 수 있습니다.

## 로고가 필요한 경우

로고가 포함된 QR 코드가 필요한 경우 [`useQRCodeWithLogo`](./useQRCodeWithLogo.md) 훅을 사용하세요.
