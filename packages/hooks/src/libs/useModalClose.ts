import { useEffect } from 'react';

interface useModalCloseTriggerProps {
  ref: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}

function useModalCloseTrigger({ ref, onClose }: useModalCloseTriggerProps) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [ref, onClose]);
}

export default useModalCloseTrigger;
