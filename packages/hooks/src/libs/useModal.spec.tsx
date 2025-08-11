// src/libs/useModal.spec.tsx
import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import useModal from './useModal';

function TestModal({ onClose }: { onClose: () => void }) {
  const ref = useModal({ onClose });

  return (
    <div>
      <div ref={ref} data-testid="modal">
        Modal Content
      </div>
      <div data-testid="outside">Outside</div>
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

  it('Mount 시 body overflow를 hidden으로 설정한다', () => {
    render(<TestModal onClose={onClose} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('Unmount 시 body overflow를 원래 값으로 복원한다', () => {
    const { unmount } = render(<TestModal onClose={onClose} />);
    unmount();
    expect(document.body.style.overflow).toBe(originalOverflow);
  });

  it('Escape 키 입력 시 onClose 호출', () => {
    render(<TestModal onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Escape 키 외 다른 키 입력 시 onClose 호출 안 함', () => {
    render(<TestModal onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('모달 외부 클릭 시 onClose 호출', () => {
    const { getByTestId } = render(<TestModal onClose={onClose} />);
    fireEvent.mouseDown(getByTestId('outside'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('모달 내부 클릭 시 onClose 호출 안 함', () => {
    const { getByTestId } = render(<TestModal onClose={onClose} />);
    fireEvent.mouseDown(getByTestId('modal'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('이벤트 리스너가 cleanup 후 동작하지 않는다', () => {
    const { unmount } = render(<TestModal onClose={onClose} />);
    unmount();

    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.mouseDown(document);
    expect(onClose).not.toHaveBeenCalled();
  });
});
