import { useCallback, useEffect, useRef, useState } from 'react';

interface UseModal {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

function useModal(targetRef: React.RefObject<HTMLDivElement | null>): UseModal {
  const onCloseRef = useRef<() => void>(() => {});
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    onCloseRef.current?.();
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    },
    [closeModal]
  );

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (targetRef.current && !targetRef.current.contains(e.target as Node)) {
        closeModal();
      }
    },
    [targetRef, closeModal]
  );

  useEffect(() => {
    if (!isOpen) return;

    const prevScroll = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = prevScroll;
    };
  }, [isOpen, handleKeyDown, handleOutsideClick]);

  return {
    isOpen,
    openModal,
    closeModal,
  };
}

export default useModal;
