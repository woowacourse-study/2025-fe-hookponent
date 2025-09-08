import { useCallback, useState } from 'react';

interface UseClipBoardReturns {
  isCopied: boolean;
  clipboardText: string | null;
  error: Error | null;

  copy: (text: string) => Promise<void>;
  paste: () => Promise<string | null>;
  reset: () => void;
}

export function useClipboard(timeout: number = 2000): UseClipBoardReturns {
  const [isCopied, setIsCopied] = useState(false);
  const [clipboardText, setClipboardText] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(
    async (text: string) => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard API not supported');
        return;
      }

      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setClipboardText(text);
        setError(null);

        setTimeout(() => {
          setIsCopied(false);
        }, timeout);
      } catch (error) {
        console.error('Failed to copy text: ', error);
        setIsCopied(false);
        setClipboardText(null);
        setError(error as Error);
      }
    },
    [timeout]
  );

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

  return { isCopied, clipboardText, error, copy, paste, reset };
}
