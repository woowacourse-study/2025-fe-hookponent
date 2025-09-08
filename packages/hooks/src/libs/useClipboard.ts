import { useCallback, useEffect, useRef, useState } from 'react';

interface UseClipBoardReturns {
  isCopied: boolean;
  clipboardText: string | null;
  error: Error | null;

  copy: (text: string) => Promise<void>;
  paste: () => Promise<string | null>;
  reset: () => void;
}

/**
 * 클립보드 복사, 붙여넣기, 초기화 기능을 제공하는 커스텀 훅입니다.
 * 이 훅은 클립보드 상태(복사 여부, 현재 텍스트, 에러)를 관리하며,
 * copy, paste, reset 함수를 제공합니다.
 *
 * copy는 전달된 텍스트를 클립보드에 복사하고, 일정 시간 동안 isCopied 상태를 true로 유지합니다.
 * paste는 클립보드의 텍스트를 읽어와 clipboardText 상태에 저장하며, 호출 시 해당 텍스트를 반환합니다.
 * reset은 상태(isCopied, clipboardText, error)를 초기화합니다.
 *
 * @param {number} [timeout=2000] - 복사 성공 상태(isCopied)가 유지되는 시간(ms). 기본값은 2000ms입니다.
 * @returns {UseClipBoardReturns} - {isCopied, clipboardText, error, copy, paste, reset}
 *
 * @example
 * const { isCopied, clipboardText, copy, paste, reset } = useClipboard(3000);
 *
 * <button onClick={() => copy('Hello World')}>
 *   {isCopied ? '✅ Copied!' : '📋 Copy'}
 * </button>
 *
 * <button onClick={async () => {
 *   const text = await paste();
 *   console.log('Clipboard text:', text);
 * }}>
 *   📥 Paste
 * </button>
 *
 * <button onClick={reset}>Reset</button>
 */
export function useClipboard(timeout: number = 2000): UseClipBoardReturns {
  const [isCopied, setIsCopied] = useState(false);
  const [clipboardText, setClipboardText] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard API not supported');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setClipboardText(text);
      setError(null);
    } catch (error) {
      console.error('Failed to copy text: ', error);
      setIsCopied(false);
      setClipboardText(null);
      setError(error as Error);
    }
  }, []);

  const paste = useCallback(async () => {
    if (!navigator?.clipboard) return null;

    try {
      const text = await navigator.clipboard.readText();
      setClipboardText(text);
      setError(null);

      return text;
    } catch (error) {
      console.error('Failed to read clipboard: ', error);
      setClipboardText(null);
      setError(error as Error);

      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setIsCopied(false);
    setClipboardText(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (isCopied) {
      timerRef.current = setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isCopied, timeout]);

  return { isCopied, clipboardText, error, copy, paste, reset };
}
