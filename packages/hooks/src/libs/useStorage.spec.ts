import { act, renderHook } from '@testing-library/react';
import { useStorageState } from './useStorageState';

describe('`useStorageState`', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('초기값이 localStorage에 없을 경우 initialValue가 사용된다.', () => {
    const { result } = renderHook(() => useStorageState('key', 'default'));
    const [value] = result.current;

    expect(value).toBe('default');
  });

  it('초기값이 localStorage에 없고 autoInit이 true면 저장된다.', () => {
    renderHook(() => useStorageState('key', 'default', { autoInit: true }));
    expect(localStorage.getItem('key')).toBe(JSON.stringify('default'));
  });

  it('값을 setValue로 바꾸면 localStorage에도 반영된다.', () => {
    const { result } = renderHook(() => useStorageState('key', 'default'));
    const [, setValue] = result.current;

    act(() => {
      setValue('newValue');
    });

    expect(localStorage.getItem('key')).toBe(JSON.stringify('newValue'));
  });

  it('serializer/deserializer를 커스터마이징할 수 있다.', () => {
    const serializer = (v: number[]) => v.join(',');
    const deserializer = (v: string) => v.split(',').map(Number);

    const { result } = renderHook(() =>
      useStorageState('key', [1, 2, 3], {
        serializer,
        deserializer,
      })
    );

    const [value] = result.current;
    expect(value).toEqual([1, 2, 3]);
  });
});
