import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

type UseQRCodeWithLogoOptions = {
  size?: number; // QR Code 크기 (기본: 256)
  margin?: number; // QR Code 마진 (기본: 2)
  color?: string; // QR Code 색상 (기본: '#000000')
  backgroundColor?: string; // QR Code 배경색 (기본: '#ffffff')
  logoUrl: string; // 로고 이미지 URL (필수)
  logoSize?: number; // 로고 크기 비율 (기본: 0.2, 즉 QR 코드의 20%)
  logoBackgroundColor?: string; // 로고 배경색 (기본: 투명)
  logoBorderRadius?: number; // 로고 테두리 둥글기 (기본: 0)
};

type UseQRCodeWithLogoReturn = {
  qrCodeUrl: string | null;
  isLoading: boolean;
  errorMessage: string | null;
};

/**
 * 로고가 포함된 QR 코드를 생성하는 React 훅
 *
 * @param url - QR 코드로 변환할 URL 또는 텍스트
 * @param options - QR 코드 및 로고 생성 옵션
 * @param options.size - QR 코드 크기 (픽셀, 기본값: 256)
 * @param options.margin - QR 코드 주변 여백 (기본값: 2)
 * @param options.color - QR 코드 전경색 (기본값: '#000000')
 * @param options.backgroundColor - QR 코드 배경색 (기본값: '#ffffff')
 * @param options.logoUrl - 로고 이미지 URL (필수)
 * @param options.logoSize - 로고 크기 비율 (기본값: 0.2, 즉 QR 코드의 20%)
 * @param options.logoBackgroundColor - 로고 배경색 (기본값: 투명)
 * @param options.logoBorderRadius - 로고 테두리 둥글기 (기본값: 0)
 *
 * @returns
 * - qrCodeUrl: 생성된 QR 코드의 Data URL (img src에 바로 사용 가능)
 * - isLoading: QR 코드 생성 중 여부
 * - errorMessage: 에러 발생 시 에러 메시지
 */
export function useQRCodeWithLogo(url: string, options: UseQRCodeWithLogoOptions): UseQRCodeWithLogoReturn {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // URL이나 로고 URL이 없으면 QR 코드 초기화
    if (!url || !options.logoUrl) {
      setQrCodeUrl(null);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    // QR 코드와 로고 크기 계산
    const qrSize = options.size || 256;
    const logoSizeRatio = options.logoSize || 0.2; // 기본값: QR 코드의 20%
    const logoSize = Math.floor(qrSize * logoSizeRatio);

    // QR 코드 생성 옵션 설정 (로고 손실 보정을 위해 높은 오류 정정 레벨 사용)
    const qrOptions = {
      width: qrSize,
      margin: options.margin || 2,
      color: {
        dark: options.color || '#000000',
        light: options.backgroundColor || '#ffffff',
      },
      errorCorrectionLevel: 'H' as const, // 로고로 인한 데이터 손실을 보정하기 위해 높은 오류 정정 레벨 사용
    };

    // 1. 기본 QR 코드 생성 (toDataURL 방식 사용)
    QRCode.toDataURL(url, qrOptions)
      .then((qrDataUrl) => {
        // 2. Canvas 생성 및 QR 코드 그리기
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Canvas context를 생성할 수 없습니다.');
        }

        // Canvas 크기를 QR 코드 크기에 맞춤
        canvas.width = qrSize;
        canvas.height = qrSize;

        // QR 코드 이미지 로드
        const qrImage = new Image();
        qrImage.onload = () => {
          // QR 코드를 Canvas에 그리기
          ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);

          // 3. 로고 이미지 로드 및 중앙에 합성
          const logoImage = new Image();
          logoImage.crossOrigin = 'anonymous'; // CORS 문제 방지 (외부 이미지 로딩 지원)

          logoImage.onload = () => {
            // 로고를 QR 코드 중앙에 배치하기 위한 좌표 계산
            const logoX = (qrSize - logoSize) / 2;
            const logoY = (qrSize - logoSize) / 2;

            // 4. 로고 배경 그리기 (선택사항 - 가독성 향상)
            if (options.logoBackgroundColor) {
              ctx.fillStyle = options.logoBackgroundColor;
              if (options.logoBorderRadius) {
                // 둥근 배경 (로고보다 4px씩 크게)
                ctx.beginPath();
                ctx.roundRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8, options.logoBorderRadius);
                ctx.fill();
              } else {
                // 사각형 배경 (로고보다 4px씩 크게)
                ctx.fillRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8);
              }
            }

            // 5. 로고 이미지 그리기
            if (options.logoBorderRadius) {
              // 둥근 로고: 클리핑 패스를 사용하여 둥근 모양으로 자르기
              ctx.save();
              ctx.beginPath();
              ctx.roundRect(logoX, logoY, logoSize, logoSize, options.logoBorderRadius);
              ctx.clip(); // 클리핑 패스 적용
              ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
              ctx.restore(); // 클리핑 패스 해제
            } else {
              // 사각형 로고: 일반적인 이미지 그리기
              ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
            }

            // 6. 최종 결과를 Data URL로 변환하여 React 상태에 저장
            setQrCodeUrl(canvas.toDataURL());
            setIsLoading(false);
          };

          // 로고 이미지 로딩 실패 시 에러 처리
          logoImage.onerror = () => {
            setErrorMessage('로고 이미지를 불러올 수 없습니다.');
            setIsLoading(false);
          };

          // 로고 이미지 소스 설정
          logoImage.src = options.logoUrl;
        };

        // QR 코드 이미지 로딩 실패 시 에러 처리
        qrImage.onerror = () => {
          setErrorMessage('QR 코드 생성에 실패했습니다.');
          setIsLoading(false);
        };

        // QR 코드 이미지 소스 설정
        qrImage.src = qrDataUrl;
      })
      .catch((err) => {
        // QR 코드 생성 과정에서 발생한 에러 처리
        setErrorMessage(err.message || 'QR 코드 생성에 실패했습니다.');
        setIsLoading(false);
      });
  }, [
    url,
    options.logoUrl,
    options.size,
    options.margin,
    options.color,
    options.backgroundColor,
    options.logoSize,
    options.logoBackgroundColor,
    options.logoBorderRadius,
  ]);

  return { qrCodeUrl, isLoading, errorMessage };
}
