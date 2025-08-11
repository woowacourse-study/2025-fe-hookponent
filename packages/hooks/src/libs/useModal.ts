import { useCallback, useEffect, useRef } from 'react';

interface UseModalProps {
  onClose: () => void;
}

function useModal({ onClose }: UseModalProps) {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (targetRef.current && !targetRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    const noScroll = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = noScroll;
    };
  }, [handleKeyDown, handleOutsideClick]);

  return targetRef;
}

export default useModal;
