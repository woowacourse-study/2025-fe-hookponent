import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

type UseQRCodeOptions = {
  size?: number; // QR Code 크기 (기본: 256)
  margin?: number; // QR Code 마진 (기본: 2)
  color?: string; // QR Code 색상 (기본: '#000000')
  backgroundColor?: string; // QR Code 배경색 (기본: '#ffffff')
};

type UseQRCodeReturn = {
  qrCodeUrl: string | null;
  isLoading: boolean;
  errorMessage: string | null;
};

/**
 * QR 코드를 생성하는 React 훅
 * @param url - QR 코드로 변환할 URL 또는 텍스트
 * @param options - QR 코드 생성 옵션
 * @param options.size - QR 코드 크기 (픽셀, 기본값: 256)
 * @param options.margin - QR 코드 주변 여백 (기본값: 2)
 * @param options.color - QR 코드 전경색 (기본값: '#000000')
 * @param options.backgroundColor - QR 코드 배경색 (기본값: '#ffffff')
 *
 * @returns
 * - qrCodeUrl: 생성된 QR 코드의 Data URL (img src에 바로 사용 가능)
 * - isLoading: QR 코드 생성 중 여부
 * - errorMessage: 에러 발생 시 에러 메시지
 */
export function useQRCode(url: string, options?: UseQRCodeOptions): UseQRCodeReturn {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // URL이 없으면 QR 코드 초기화
    if (!url) {
      setQrCodeUrl(null);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    // QR 코드 생성 옵션 설정
    const qrOptions = {
      width: options?.size || 256,
      margin: options?.margin || 2,
      color: {
        dark: options?.color || '#000000',
        light: options?.backgroundColor || '#ffffff',
      },
      errorCorrectionLevel: 'H' as const, // 높은 오류 정정 레벨로 손상에 강한 QR 코드 생성
    };

    // QR 코드를 Data URL 형태로 생성
    QRCode.toDataURL(url, qrOptions)
      .then((dataUrl) => {
        setQrCodeUrl(dataUrl);
        setIsLoading(false);
      })
      .catch((err) => {
        setErrorMessage(err.message || 'QR 코드 생성에 실패했습니다.');
        setIsLoading(false);
      });
  }, [url, options?.size, options?.margin, options?.color, options?.backgroundColor]);

  return { qrCodeUrl, isLoading, errorMessage };
}
