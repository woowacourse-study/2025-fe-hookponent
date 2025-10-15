import { render, fireEvent, waitFor } from '@testing-library/react';
import { useRef } from 'react';
import { useEnterKey } from './useEnterKey';

function TestComponent({ callback }: { callback: jest.Mock }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { targetRef } = useEnterKey<HTMLInputElement>({ callback, buttonRef });

  return (
    <div>
      <input ref={targetRef} data-testid="input" />
      <button ref={buttonRef} data-testid="button">
        Submit
      </button>
    </div>
  );
}

describe('useEnterKey', () => {
  it('입력 요소에 포커스된 상태에서 Enter 키를 누르면 callback이 실행된다', () => {
    const callback = jest.fn();
    const { getByTestId } = render(<TestComponent callback={callback} />);

    const input = getByTestId('input');
    input.focus();

    fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('입력 요소에 포커스된 상태에서 Enter 키를 누르면 버튼 클릭 이벤트가 발생한다', () => {
    const callback = jest.fn();
    const { getByTestId } = render(<TestComponent callback={callback} />);

    const input = getByTestId('input');
    const button = getByTestId('button');
    const buttonClick = jest.fn();
    button.onclick = buttonClick;

    input.focus();
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(buttonClick).toHaveBeenCalledTimes(1);
  });

  it('입력 요소에 포커스되지 않은 상태에서 Enter 키를 누르면 아무 동작도 하지 않는다', () => {
    const callback = jest.fn();
    render(<TestComponent callback={callback} />);

    fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });

    expect(callback).not.toHaveBeenCalled();
  });

  it('다른 키를 누르면 callback이나 버튼 클릭 이벤트가 발생하지 않는다', () => {
    const callback = jest.fn();
    const { getByTestId } = render(<TestComponent callback={callback} />);

    const input = getByTestId('input');
    input.focus();

    fireEvent.keyDown(input, { key: 'a', code: 'KeyA' });

    expect(callback).not.toHaveBeenCalled();
  });

  it('callback이 비동기 함수일 경우에도 정상적으로 실행된다', async () => {
    const callback = jest.fn(async () => Promise.resolve());
    const { getByTestId } = render(<TestComponent callback={callback} />);

    const input = getByTestId('input');
    input.focus();

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});
