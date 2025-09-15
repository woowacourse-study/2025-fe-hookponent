import { useCallback, useEffect, useReducer, useRef } from 'react';

interface State {
  isCopied: boolean;
  clipboardText: string | null;
  error: Error | null;
}

type Action =
  | { type: 'COPY_SUCCESS'; payload: string }
  | { type: 'COPY_ERROR'; payload: Error }
  | { type: 'PASTE_SUCCESS'; payload: string }
  | { type: 'PASTE_ERROR'; payload: Error }
  | { type: 'RESET' }
  | { type: 'CLEAR_COPY_FLAG' };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'COPY_SUCCESS':
      return { isCopied: true, clipboardText: action.payload, error: null };
    case 'COPY_ERROR':
      return { ...state, error: action.payload };
    case 'PASTE_SUCCESS':
      return { ...state, clipboardText: action.payload, error: null };
    case 'PASTE_ERROR':
      return { ...state, error: action.payload };
    case 'RESET':
      return { isCopied: false, clipboardText: null, error: null };
    case 'CLEAR_COPY_FLAG':
      return { ...state, isCopied: false };
    default:
      return state;
  }
};

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
  const [state, dispatch] = useReducer(reducer, { isCopied: false, clipboardText: null, error: null });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard API not supported');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      dispatch({ type: 'COPY_SUCCESS', payload: text });
    } catch (error) {
      console.error('Failed to copy text: ', error);
      dispatch({ type: 'COPY_ERROR', payload: error });
    }
  }, []);

  const paste = useCallback(async () => {
    if (!navigator?.clipboard) return null;

    try {
      const text = await navigator.clipboard.readText();
      dispatch({ type: 'PASTE_SUCCESS', payload: text });
      return text;
    } catch (error) {
      console.error('Failed to read clipboard: ', error);
      dispatch({ type: 'PASTE_ERROR', payload: error });

      return null;
    }
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  useEffect(() => {
    if (state.isCopied) {
      timerRef.current = setTimeout(() => {
        dispatch({ type: 'CLEAR_COPY_FLAG' });
      }, timeout);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state.isCopied, timeout]);

  return { ...state, copy, paste, reset };
}
