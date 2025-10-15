# useQRCodeWithLogo

로고가 포함된 QR 코드를 생성하는 React 훅입니다.

## 설명

`useQRCodeWithLogo`는 기본 QR 코드에 로고를 중앙에 합성하여 브랜딩된 QR 코드를 생성합니다. 로고는 둥근 모서리와 배경색 등 다양한 스타일링 옵션을 지원합니다.

## API

```typescript
function useQRCodeWithLogo(
  url: string,
  options: {
    size?: number; // QR 코드 크기 (픽셀, 기본값: 256)
    margin?: number; // QR 코드 주변 여백 (기본값: 2)
    color?: string; // QR 코드 전경색 (기본값: '#000000')
    backgroundColor?: string; // QR 코드 배경색 (기본값: '#ffffff')
    logoUrl: string; // 로고 이미지 URL (필수)
    logoSize?: number; // 로고 크기 비율 (기본값: 0.2, QR 코드의 20%)
    logoBackgroundColor?: string; // 로고 배경색 (기본값: 투명)
    logoBorderRadius?: number; // 로고 테두리 둥글기 (기본값: 0)
  }
): {
  qrCodeUrl: string | null; // 생성된 QR 코드의 Data URL
  isLoading: boolean; // 생성 중 여부
  errorMessage: string | null; // 에러 메시지
};
```

## 사용 예시

```tsx
import { useQRCodeWithLogo } from '@hookdle/hooks';

function BrandedQRCode() {
  const { qrCodeUrl, isLoading, errorMessage } = useQRCodeWithLogo('https://example.com', {
    size: 300,
    logoUrl: '/company-logo.png',
    logoSize: 0.25, // QR 코드의 25% 크기
    logoBackgroundColor: '#ffffff',
    logoBorderRadius: 8, // 둥근 모서리
  });

  if (isLoading) return <div>Loading...</div>;
  if (errorMessage) return <div>Error: {errorMessage}</div>;

  return qrCodeUrl ? <img src={qrCodeUrl} alt="Branded QR Code" /> : null;
}
```

## 특징

- **로고 합성**: QR 코드 중앙에 로고 이미지 자동 배치
- **스타일링 옵션**: 로고 크기, 배경색, 테두리 둥글기 등 커스터마이징
- **CORS 지원**: 외부 이미지 로드 시 CORS 문제 자동 처리
- **높은 오류 정정**: 로고로 인한 QR 코드 손실 보정
- **타입 안전성**: TypeScript로 작성되어 완벽한 타입 지원

## 주의사항

1. `logoUrl`은 필수 옵션입니다.
2. 로고 크기는 QR 코드 인식률에 영향을 줄 수 있습니다. 기본값인 20%를 권장합니다.
3. 로고 이미지가 로드되지 않으면 에러 메시지가 반환됩니다.
4. 외부 이미지 사용 시 CORS 정책을 확인하세요.

## 로고가 필요 없는 경우

단순한 QR 코드가 필요한 경우 [`useQRCode`](./useQRCode.md) 훅을 사용하세요.
