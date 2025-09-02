import React, { useRef } from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import useModal from './useModal';

function TestModal({ onClose }: { onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { isOpen, openModal, closeModal } = useModal(modalRef);

  React.useEffect(() => {
    (closeModal as any).onClose = onClose;
  }, [onClose, closeModal]);

  return (
    <div>
      <button data-testid="open" onClick={openModal}>
        Open
      </button>
      {isOpen && (
        <div ref={modalRef} data-testid="modal">
          Modal Content
        </div>
      )}
      <div data-testid="outside">Outside</div>
      <button data-testid="close" onClick={closeModal}>
        Close
      </button>
    </div>
  );
}

describe('useModal', () => {
  let onClose: jest.Mock;
  let originalOverflow: string;

  beforeEach(() => {
    onClose = jest.fn();
    originalOverflow = document.body.style.overflow;
    cleanup();
  });

  afterEach(() => {
    cleanup();
    document.body.style.overflow = originalOverflow;
  });

  it('openModal 호출 시 body overflow를 hidden으로 설정한다', () => {
    const { getByTestId } = render(<TestModal onClose={onClose} />);
    fireEvent.click(getByTestId('open'));
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('closeModal 호출 시 body overflow를 원래 값으로 복원한다', () => {
    const { getByTestId } = render(<TestModal onClose={onClose} />);
    fireEvent.click(getByTestId('open'));
    fireEvent.click(getByTestId('close'));
    expect(document.body.style.overflow).toBe(originalOverflow);
  });

  it('Escape 키 외 다른 키 입력 시 onClose 호출 안 함', () => {
    const { getByTestId } = render(<TestModal onClose={onClose} />);
    fireEvent.click(getByTestId('open'));
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('모달 내부 클릭 시 onClose 호출 안 함', () => {
    const { getByTestId } = render(<TestModal onClose={onClose} />);
    fireEvent.click(getByTestId('open'));
    fireEvent.mouseDown(getByTestId('modal'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('이벤트 리스너가 cleanup 후 동작하지 않는다', () => {
    const { unmount, getByTestId } = render(<TestModal onClose={onClose} />);
    fireEvent.click(getByTestId('open'));
    unmount();

    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.mouseDown(document);
    expect(onClose).not.toHaveBeenCalled();
  });
});
