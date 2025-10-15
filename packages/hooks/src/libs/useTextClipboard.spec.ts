import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useTextClipboard } from './useTextClipboard';

describe('useTextClipboard', () => {
  const originalClipboard = Object.getOwnPropertyDescriptor(window.navigator, 'clipboard');

  let writeTextMock: jest.Mock;
  let readTextMock: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    writeTextMock = jest.fn();
    readTextMock = jest.fn();

    // navigator.clipboard 모킹
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: writeTextMock,
        readText: readTextMock,
      },
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();

    // 모킹/스파이 초기화
    jest.restoreAllMocks();

    // navigator.clipboard 원복
    if (originalClipboard) {
      Object.defineProperty(window.navigator, 'clipboard', originalClipboard);
    } else {
      // 혹시 원래 없던 환경이었다면 제거
      // @ts-expect-error - allow delete in test env
      delete window.navigator.clipboard;
    }
  });

  test('copy: 성공 시 isCopied=true, clipboardText 설정되고 timeout 후 false로 복귀', async () => {
    writeTextMock.mockResolvedValue(void 0);

    const { result } = renderHook(() => useTextClipboard(100)); // 100ms로 단축
    expect(result.current.isCopied).toBe(false);
    expect(result.current.clipboardText).toBeNull();
    expect(result.current.error).toBeNull();

    await act(async () => {
      await result.current.copy('Hello');
    });

    expect(writeTextMock).toHaveBeenCalledWith('Hello');
    expect(result.current.isCopied).toBe(true);
    expect(result.current.clipboardText).toBe('Hello');
    expect(result.current.error).toBeNull();

    // 타임아웃 지나면 isCopied=false로 전환
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.isCopied).toBe(false);
    // clipboardText는 유지(설계에 따라 유지가 자연스러움)
    expect(result.current.clipboardText).toBe('Hello');
  });

  test('copy: 실패 시 isCopied=false, clipboardText=null, error 설정', async () => {
    const err = new Error('copy fail');
    writeTextMock.mockRejectedValue(err);

    const { result } = renderHook(() => useTextClipboard(100));

    await act(async () => {
      await result.current.copy('Oops');
    });

    expect(writeTextMock).toHaveBeenCalledWith('Oops');
    expect(result.current.isCopied).toBe(false);
    expect(result.current.clipboardText).toBeNull();
    expect(result.current.error).toBe(err);
  });

  test('paste: 성공 시 clipboardText에 반영되고 텍스트 반환', async () => {
    readTextMock.mockResolvedValue('Pasted!');

    const { result } = renderHook(() => useTextClipboard(100));

    let pasted: string | null = null;
    await act(async () => {
      pasted = await result.current.paste();
    });

    expect(readTextMock).toHaveBeenCalled();
    expect(pasted).toBe('Pasted!');
    expect(result.current.clipboardText).toBe('Pasted!');
    expect(result.current.error).toBeNull();
  });

  test('paste: 실패 시 clipboardText=null, error 설정, 반환값 null', async () => {
    const err = new Error('paste fail');
    readTextMock.mockRejectedValue(err);

    const { result } = renderHook(() => useTextClipboard(100));

    let pasted: string | null = 'init';
    await act(async () => {
      pasted = await result.current.paste();
    });

    expect(readTextMock).toHaveBeenCalled();
    expect(pasted).toBeNull();
    expect(result.current.clipboardText).toBeNull();
    expect(result.current.error).toBe(err);
  });

  test('reset: 상태를 초기화', async () => {
    writeTextMock.mockResolvedValue(void 0);
    const { result } = renderHook(() => useTextClipboard(100));

    await act(async () => {
      await result.current.copy('Hello');
    });
    expect(result.current.isCopied).toBe(true);
    expect(result.current.clipboardText).toBe('Hello');

    act(() => {
      result.current.reset();
    });

    expect(result.current.isCopied).toBe(false);
    expect(result.current.clipboardText).toBeNull();
    expect(result.current.error).toBeNull();
  });

  test('Clipboard API 미지원: copy/paste 호출 시 경고 및 상태 변화 없음', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    // Clipboard API 제거
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useTextClipboard(100));

    await act(async () => {
      await result.current.copy('Hello');
    });
    expect(warnSpy).toHaveBeenCalledWith('Clipboard API not supported');
    expect(result.current.isCopied).toBe(false);
    expect(result.current.clipboardText).toBeNull();
    expect(result.current.error).toBeNull();

    let pasted: string | null = 'init';
    await act(async () => {
      pasted = await result.current.paste();
    });
    expect(pasted).toBeNull();
    expect(result.current.clipboardText).toBeNull();
    expect(result.current.error).toBeNull();

    warnSpy.mockRestore();
  });

  test('언마운트 시 타이머 정리(메모리 누수/경고 없이 정리됨)', async () => {
    writeTextMock.mockResolvedValue(void 0);
    const { result, unmount } = renderHook(() => useTextClipboard(100));

    await act(async () => {
      await result.current.copy('Hello');
    });
    expect(result.current.isCopied).toBe(true);

    // 언마운트 시 등록된 타이머가 정리되어야 함
    unmount();

    // 타이머를 진행해도 setState 경고가 발생하지 않아야 함
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // 단정: 테스트가 경고 없이 통과하면 성공으로 간주
  });
});
