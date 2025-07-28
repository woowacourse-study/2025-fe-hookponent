import { renderHook, act } from '@testing-library/react';
import { useArrayState } from './useArrayState';

describe('useArrayState', () => {
  it('should initialize with initial array', () => {
    const { result } = renderHook(() => useArrayState<number>([1, 2, 3]));
    const [value] = result.current;
    expect(value).toEqual([1, 2, 3]);
  });

  it('should set new array with set()', () => {
    const { result } = renderHook(() => useArrayState<number>([1, 2, 3]));

    act(() => {
      const [, actions] = result.current;
      actions.set([4, 5, 6]);
    });

    const [value] = result.current;
    expect(value).toEqual([4, 5, 6]);
  });

  it('should push new elements', () => {
    const { result } = renderHook(() => useArrayState<number>([1, 2]));

    act(() => {
      const [, actions] = result.current;
      actions.push(3, 4);
    });

    const [value] = result.current;
    expect(value).toEqual([1, 2, 3, 4]);
  });

  it('should pop last element', () => {
    const { result } = renderHook(() => useArrayState<number>([1, 2, 3]));

    act(() => {
      const [, actions] = result.current;
      actions.pop();
    });

    const [value] = result.current;
    expect(value).toEqual([1, 2]);
  });

  it('should clear array', () => {
    const { result } = renderHook(() => useArrayState<number>([1, 2, 3]));

    act(() => {
      const [, actions] = result.current;
      actions.clear();
    });

    const [value] = result.current;
    expect(value).toEqual([]);
  });

  it('should shift array', () => {
    const { result } = renderHook(() => useArrayState<number>([1, 2, 3]));

    act(() => {
      const [, actions] = result.current;
      actions.shift();
    });

    const [value] = result.current;
    expect(value).toEqual([2, 3]);
  });

  it('should unshift array', () => {
    const { result } = renderHook(() => useArrayState<number>([2, 3]));

    act(() => {
      const [, actions] = result.current;
      actions.unshift(1);
    });

    const [value] = result.current;
    expect(value).toEqual([1, 2, 3]);
  });

  it('should splice array', () => {
    const { result } = renderHook(() => useArrayState<number>([1, 2, 3, 4]));

    act(() => {
      const [, actions] = result.current;
      actions.splice(1, 2, 9, 8);
    });

    const [value] = result.current;
    expect(value).toEqual([1, 9, 8, 4]);
  });

  it('should insertAt array', () => {
    const { result } = renderHook(() => useArrayState<number>([1, 3]));

    act(() => {
      const [, actions] = result.current;
      actions.insertAt(1, 2);
    });

    const [value] = result.current;
    expect(value).toEqual([1, 2, 3]);
  });

  it('should removeAt array', () => {
    const { result } = renderHook(() => useArrayState<number>([1, 2, 3]));

    act(() => {
      const [, actions] = result.current;
      actions.removeAt(1);
    });

    const [value] = result.current;
    expect(value).toEqual([1, 3]);
  });

  it('should updateAt array', () => {
    const { result } = renderHook(() => useArrayState<number>([1, 2, 3]));

    act(() => {
      const [, actions] = result.current;
      actions.updateAt(1, 5);
    });

    const [value] = result.current;
    expect(value).toEqual([1, 5, 3]);
  });
});
