import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { useHover } from './useHover';

interface hoverHandlerOptions {
  onEnter?: (event: MouseEvent) => void;
  onLeave?: (event: MouseEvent) => void;
}

describe('useHover', () => {
  const TestComponent = ({ onEnter, onLeave }: hoverHandlerOptions) => {
    const { isHovered, hoverRef } = useHover<HTMLDivElement>({ onEnter, onLeave });
    return (
      <div ref={hoverRef} data-testid="hover-target">
        {isHovered ? 'hovered' : 'not-hovered'}
      </div>
    );
  };

  it('초기 상태는 hover 되지 않은 상태여야 한다', () => {
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('hover-target').textContent).toBe('not-hovered');
  });

  it('마우스를 올리면 isHovered가 true로 바뀌어야 한다', () => {
    const { getByTestId } = render(<TestComponent />);
    const target = getByTestId('hover-target');

    fireEvent.mouseEnter(target);
    expect(target.textContent).toBe('hovered');
  });

  it('마우스를 내리면 isHovered가 false로 바뀌어야 한다', () => {
    const { getByTestId } = render(<TestComponent />);
    const target = getByTestId('hover-target');

    fireEvent.mouseEnter(target);
    fireEvent.mouseLeave(target);

    expect(target.textContent).toBe('not-hovered');
  });

  it('onEnter 콜백이 호출되어야 한다', () => {
    const onEnter = jest.fn();
    const { getByTestId } = render(<TestComponent onEnter={onEnter} />);
    const target = getByTestId('hover-target');

    fireEvent.mouseEnter(target);
    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it('onLeave 콜백이 호출되어야 한다', () => {
    const onLeave = jest.fn();
    const { getByTestId } = render(<TestComponent onLeave={onLeave} />);
    const target = getByTestId('hover-target');

    fireEvent.mouseEnter(target);
    fireEvent.mouseLeave(target);

    expect(onLeave).toHaveBeenCalledTimes(1);
  });
});
