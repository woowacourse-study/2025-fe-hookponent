import { render, fireEvent } from '@testing-library/react';
import { useRef } from 'react';
import useModalCloseTrigger from './useModalClose';

describe('useModalCloseTrigger', () => {
  const TestComponent = ({ onClose }: { onClose: () => void }) => {
    const ref = useRef<HTMLDivElement>(null);
    useModalCloseTrigger({ ref, onClose });

    return (
      <div data-testid="overlay">
        <div ref={ref} data-testid="modal">
          모달 내용
        </div>
      </div>
    );
  };

  it('ESC 키 누르면 onClose 호출됨', () => {
    const onClose = jest.fn();
    render(<TestComponent onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('모달 외부 클릭 시 onClose 호출됨', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(<TestComponent onClose={onClose} />);

    fireEvent.mouseDown(getByTestId('overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('모달 내부 클릭 시 onClose 호출되지 않음', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(<TestComponent onClose={onClose} />);

    fireEvent.mouseDown(getByTestId('modal'));
    expect(onClose).not.toHaveBeenCalled();
  });
});
