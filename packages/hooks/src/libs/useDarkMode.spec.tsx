import { render, screen, fireEvent } from '@testing-library/react';
import { useDarkMode } from './useDarkMode';

const LOCAL_STORAGE_KEY = 'darkMode';

// 테스트용 컴포넌트
function DarkModeTestComponent() {
  const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    <div>
      <div>DarkMode: {darkMode ? 'true' : 'false'}</div>
      <button onClick={toggleDarkMode}>Toggle</button>
    </div>
  );
}

describe('useDarkMode', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('초기 상태는 시스템 설정을 따른다 (localStorage 없을 때)', () => {
    // 강제로 시스템 설정을 조작
    window.matchMedia = jest.fn().mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    render(<DarkModeTestComponent />);
    expect(screen.getByText(/DarkMode: true/)).toBeInTheDocument();
  });

  test('localStorage에 저장된 값이 있을 경우 저장된 값을 따른다.', () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'false');
    render(<DarkModeTestComponent />);
    expect(screen.getByText(/DarkMode: false/)).toBeInTheDocument();
  });

  test('toggleDarkMode가 호출되면 상태와 localStorage의 값이 바뀐다.', () => {
    render(<DarkModeTestComponent />);
    const button = screen.getByText('Toggle');

    expect(screen.getByText(/DarkMode: false|true/)).toBeInTheDocument();
    const initial = screen.getByText(/DarkMode: (true|false)/).textContent;

    fireEvent.click(button);

    const toggled = screen.getByText(/DarkMode: (true|false)/).textContent;
    expect(toggled).not.toBe(initial);

    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    expect(stored).toBe(toggled?.split(': ')[1]);
  });
});
