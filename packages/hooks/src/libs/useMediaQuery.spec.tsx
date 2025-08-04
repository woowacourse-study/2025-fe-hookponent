import { renderHook } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';

describe('useMediaQuery', () => {
  let addEventListenerSpy: jest.SpyInstance;
  let removeEventListenerSpy: jest.SpyInstance;

  beforeEach(() => {
    // window.matchMedia를 Mock 처리
    (window.matchMedia as unknown) = jest.fn().mockImplementation((query) => ({
      matches: query.includes('max-width: 768px'), // 테스트 조건: 'max-width: 768px'이면 true 반환
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('단일 쿼리가 전달되면 boolean 값을 반환해야 한다', () => {
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    expect(typeof result.current).toBe('boolean');
    expect(result.current).toBe(true);
  });

  it('쿼리 배열이 전달되면 boolean[] 배열을 반환해야 한다', () => {
    const { result } = renderHook(() => useMediaQuery(['(max-width: 768px)', '(min-width: 1024px)']));
    expect(Array.isArray(result.current)).toBe(true);
    const values = result.current as boolean[];
    expect(values.length).toBe(2);
    expect(values[0]).toBe(true); // max-width: 768px → true (mock 조건)
    expect(values[1]).toBe(false); // min-width: 1024px → false (mock 조건)
  });

  it('개발 모드에서 잘못된 쿼리 형식이 전달되면 경고 메시지를 출력해야 한다', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderHook(() => useMediaQuery('(maxwidth: 768px)' as unknown as any)); // 잘못된 쿼리 - 타입 강제 우회

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[useMediaQuery] 잘못된 쿼리 형식입니다'));

    spy.mockRestore();
    process.env.NODE_ENV = originalNodeEnv;
  });
});
