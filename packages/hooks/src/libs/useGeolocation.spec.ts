import { renderHook, act } from '@testing-library/react';
import { useGeolocation } from './useGeolocation';

// 공통 mock 좌표
const mockCoords = {
  latitude: 37.5665,
  longitude: 126.978,
  accuracy: 10,
  altitude: null,
  altitudeAccuracy: null,
  heading: null,
  speed: null,
} as GeolocationCoordinates;

describe('useGeolocation', () => {
  let mockGetCurrentPosition: jest.Mock;
  let mockWatchPosition: jest.Mock;
  let mockClearWatch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetCurrentPosition = jest.fn();
    mockWatchPosition = jest.fn();
    mockClearWatch = jest.fn();

    // ✅ navigator.geolocation을 재정의 (readonly 속성 우회)
    Object.defineProperty(global.navigator, 'geolocation', {
      value: {
        getCurrentPosition: mockGetCurrentPosition,
        watchPosition: mockWatchPosition,
        clearWatch: mockClearWatch,
      },
      writable: true,
    });
  });

  it('브라우저에서 geolocation이 지원되지 않을 경우 isSupported가 false가 된다', () => {
    Object.defineProperty(global.navigator, 'geolocation', {
      value: undefined,
      writable: true,
    });

    const { result } = renderHook(() => useGeolocation());

    expect(result.current.isSupported).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.coords).toBeNull();
  });

  it('getCurrentPosition을 정상적으로 호출하고 위치를 설정한다', async () => {
    const successCallback = jest.fn();
    mockGetCurrentPosition.mockImplementation((success) => {
      success({ coords: mockCoords });
    });

    const { result } = renderHook(() => useGeolocation());

    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1);

    // act로 상태 반영
    await act(async () => {
      successCallback();
    });

    expect(result.current.coords).toEqual(mockCoords);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('watchPosition 옵션이 true일 경우 watchPosition을 호출하고 clearWatch가 호출된다', () => {
    const mockWatchId = 123;
    mockWatchPosition.mockReturnValue(mockWatchId);

    const { unmount } = renderHook(() => useGeolocation({ watch: true, enableHighAccuracy: true }));

    expect(mockWatchPosition).toHaveBeenCalledTimes(1);
    expect(mockWatchPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      expect.objectContaining({ enableHighAccuracy: true })
    );

    unmount();
    expect(mockClearWatch).toHaveBeenCalledWith(mockWatchId);
  });

  it('getCurrentPosition 호출 시 에러가 발생하면 error 상태로 설정된다', async () => {
    const mockError = { code: 1, message: 'User denied Geolocation' };
    mockGetCurrentPosition.mockImplementation((_success, error) => error(mockError));

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {});

    expect(result.current.coords).toBeNull();
    expect(result.current.error).toEqual(mockError);
  });

  it('watchPosition 콜백으로 위치가 업데이트되면 coords가 변경된다', async () => {
    let successCallback: (pos: GeolocationPosition) => void = jest.fn();
    mockWatchPosition.mockImplementation((success) => {
      successCallback = success;
      return 42;
    });

    const { result } = renderHook(() => useGeolocation({ watch: true }));

    await act(async () => {
      successCallback({ coords: mockCoords } as GeolocationPosition);
    });

    expect(result.current.coords).toEqual(mockCoords);
    expect(result.current.error).toBeNull();
  });
});
