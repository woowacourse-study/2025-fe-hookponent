import { act, renderHook, waitFor } from '@testing-library/react';
import { useStorageState } from './useStorageState';

describe('useStorageState', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('초기값이 localStorage에 없을 때 autoInit 이 true면 초기값이 저장된다', () => {
    const { result } = renderHook(() => useStorageState('hi', 'hello'));

    expect(result.current[0]).toBe('hello');
    expect(JSON.parse(localStorage.getItem('hi'))).toBe('hello');
  });

  it('localStorage에 값이 있을 경우 해당 값으로 초기화된다', () => {
    localStorage.setItem('hi', JSON.stringify('hellohello'));

    const { result } = renderHook(() => useStorageState('hi', 'hello'));

    expect(result.current[0]).toBe('hellohello');
  });

  it('setValue 호출 시 상태와 localStorage가 모두 업데이트된다', () => {
    const { result } = renderHook(() => useStorageState('hi', 'hello'));
    act(() => {
      const [, setValue] = result.current;
      setValue('hellohello');
    });
    expect(result.current[0]).toBe('hellohello');
    expect(JSON.parse(localStorage.getItem('hi'))).toBe('hellohello');
  });

  it('다른 탭에서 storage 이벤트 발생 시 상태가 갱신된다', async () => {
    const { result } = renderHook(() => useStorageState('theme', 'light'));

    act(() => {
      localStorage.setItem('theme', JSON.stringify('dark'));

      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'theme',
          newValue: JSON.stringify('dark'),
          oldValue: JSON.stringify('light'),
          storageArea: localStorage,
        })
      );
    });
    await waitFor(() => {
      expect(result.current[0]).toBe('dark');
    });
  });

  it('type이 session이면 sessionStorage를 사용한다', () => {
    const { result } = renderHook(() => useStorageState('theme', 'light', { type: 'session', autoInit: true }));

    expect(result.current[0]).toBe('light');
    expect(sessionStorage.getItem('theme')).toBe('"light"');
  });

  it('serializer/deserializer 옵션이 Date 객체에 대해 적용된다', () => {
    const serializer = (v: Date) => v.toISOString();
    const deserializer = (v: string) => new Date(v);

    const initialDate = new Date();

    const { result } = renderHook(() => useStorageState('date', initialDate, { serializer, deserializer }));

    expect(localStorage.getItem('date')).toBe(initialDate.toISOString());
    expect(result.current[0]).toEqual(initialDate);
    expect(result.current[0] instanceof Date).toBe(true);
  });
});
