import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { useToggleState } from './useToggleState';

const TestComponent = () => {
  const [bool, toggle] = useToggleState(false);

  return (
    <div>
      <p data-testid="paragraph">{`${bool}`}</p>
      <button onClick={toggle}>button</button>
    </div>
  );
};

describe('useToggleState', () => {
  describe('반환 값의 타입을 확인', () => {
    const { result } = renderHook(() => useToggleState());

    const [bool, toggle] = result.current;

    it('bool은 boolean 타입이어야 한다', () => {
      expect(typeof bool).toBe('boolean');
    });

    it('toggle은 함수 타입이어야 한다', () => {
      expect(typeof toggle).toBe('function');
    });
  });

  describe('초기값 확인', () => {
    it('기본값이 false일 때, bool은 false이어야 한다', () => {
      const { result } = renderHook(() => useToggleState());
      const [bool] = result.current;
      expect(bool).toBe(false);
    });

    it('주어진 값이 true일 때, bool은 true이어야 한다', () => {
      const { result } = renderHook(() => useToggleState(true));
      const [bool] = result.current;
      expect(bool).toBe(true);
    });

    it('주어진 값이 false일 때, bool은 false이어야 한다', () => {
      const { result } = renderHook(() => useToggleState(false));
      const [bool] = result.current;
      expect(bool).toBe(false);
    });
  });

  describe('toggle 함수 동작 확인', () => {
    it('toggle 함수를 호출하면 bool 값이 반전되어야 한다', () => {
      render(<TestComponent />);

      const button = screen.getByRole('button');
      const paragraph = screen.getByTestId('paragraph');

      expect(paragraph.textContent).toBe('false');

      fireEvent.click(button);

      expect(paragraph.textContent).toBe('true');

      fireEvent.click(button);

      expect(paragraph.textContent).toBe('false');

      fireEvent.click(button);

      expect(paragraph.textContent).toBe('true');
    });
  });
});
