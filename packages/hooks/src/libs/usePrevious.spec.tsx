import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { usePrevious } from './usePrevious';

// 테스트용 컴포넌트
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p data-testid="current">current: {count}</p>
      <p data-testid="previous">previous: {String(prevCount)}</p>
      <button onClick={() => setCount((c) => c + 1)}>increment</button>
    </div>
  );
}

describe('usePrevious', () => {
  test('초기 렌더링 시 이전 값은 undefined이다.', () => {
    render(<Counter />);
    expect(screen.getByTestId('previous').textContent).toBe('previous: undefined');
  });

  test('값이 변경되면 이전 값이 추적된다.', () => {
    render(<Counter />);
    const current = screen.getByTestId('current');
    const previous = screen.getByTestId('previous');
    const button = screen.getByText('increment');

    // 첫 렌더링
    expect(current.textContent).toBe('current: 0');
    expect(previous.textContent).toBe('previous: undefined');

    // 첫 번째 클릭 → count = 1
    fireEvent.click(button);
    expect(current.textContent).toBe('current: 1');
    expect(previous.textContent).toBe('previous: 0');

    // 두 번째 클릭 → count = 2
    fireEvent.click(button);
    expect(current.textContent).toBe('current: 2');
    expect(previous.textContent).toBe('previous: 1');
  });
});
