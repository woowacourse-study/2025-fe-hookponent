import { renderHook, act } from '@testing-library/react';
import qrcode from 'qrcode';
import { useQRCode } from './useQRCode';

// Mock QRCode.toDataURL
jest.mock('qrcode', () => ({
  toDataURL: jest.fn(),
}));

describe('useQRCode', () => {
  const mockUrl = 'https://example.com';
  const mockOptions = {
    size: 200,
    margin: 2,
    color: '#000000',
    backgroundColor: '#ffffff',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('URL이 없을 때 QR 코드를 생성하지 않아야 함', () => {
    const { result } = renderHook(() => useQRCode(''));

    expect(result.current.qrCodeUrl).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.errorMessage).toBeNull();
    expect(qrcode.toDataURL).not.toHaveBeenCalled();
  });

  it('QR 코드가 성공적으로 생성되어야 함', async () => {
    // Mock the QR code generation
    const mockQrCode = 'data:image/png;base64,mockedQRCode';
    (qrcode.toDataURL as jest.Mock).mockResolvedValue(mockQrCode);

    // Render the hook
    const { result } = renderHook(() => useQRCode(mockUrl, mockOptions));

    // Initial state check
    expect(result.current.isLoading).toBe(true);
    expect(result.current.qrCodeUrl).toBeNull();
    expect(result.current.errorMessage).toBeNull();

    // Wait for the async operation to complete
    await act(async () => {
      await Promise.resolve();
    });

    // Check the final state
    expect(result.current.qrCodeUrl).toBe(mockQrCode);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.errorMessage).toBeNull();

    // Verify the correct options were passed
    expect(qrcode.toDataURL).toHaveBeenCalledWith(
      mockUrl,
      expect.objectContaining({
        width: mockOptions.size,
        margin: mockOptions.margin,
        color: {
          dark: mockOptions.color,
          light: mockOptions.backgroundColor,
        },
        errorCorrectionLevel: 'H',
      })
    );
  });

  it('QR 코드 생성 실패 시 에러 메시지를 반환해야 함', async () => {
    // Mock the error
    const mockError = new Error('QR 코드 생성 실패');
    (qrcode.toDataURL as jest.Mock).mockRejectedValue(mockError);

    // Render the hook
    const { result } = renderHook(() => useQRCode(mockUrl));

    // Initial state check
    expect(result.current.isLoading).toBe(true);
    expect(result.current.qrCodeUrl).toBeNull();
    expect(result.current.errorMessage).toBeNull();

    // Wait for the async operation to complete
    await act(async () => {
      await Promise.resolve();
    });

    // Check the error state
    expect(result.current.qrCodeUrl).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.errorMessage).toBe(mockError.message);
  });

  it('옵션이 변경되면 QR 코드가 재생성되어야 함', async () => {
    const mockQrCode = 'data:image/png;base64,mockedQRCode';
    (qrcode.toDataURL as jest.Mock).mockResolvedValue(mockQrCode);

    const { result, rerender } = renderHook((props) => useQRCode(props.url, props.options), {
      initialProps: { url: mockUrl, options: mockOptions },
    });

    // Wait for initial render
    await act(async () => {
      await Promise.resolve();
    });

    // Change options
    const newOptions = { ...mockOptions, size: 300 };
    rerender({ url: mockUrl, options: newOptions });

    // Wait for rerender
    await act(async () => {
      await Promise.resolve();
    });

    // Verify QR code was regenerated with new options
    expect(qrcode.toDataURL).toHaveBeenCalledTimes(2);
    expect(qrcode.toDataURL).toHaveBeenLastCalledWith(
      mockUrl,
      expect.objectContaining({
        width: 300,
      })
    );
  });
});
