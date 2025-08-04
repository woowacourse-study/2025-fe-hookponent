import { renderHook } from '@testing-library/react';
import { useIsMountedRef } from './useIsMountedRef';

describe('useIsMountedRef', () => {
  it('마운트 시 isMount가 true여야한다', () => {
    const { result } = renderHook(() => useIsMountedRef());

    expect(result.current.isMount).toBe(true);
  });

  it('언마운트 시 isMount가 false로 변경되어야한다', () => {
    const { result, unmount } = renderHook(() => useIsMountedRef());

    expect(result.current.isMount).toBe(true);

    unmount();

    expect(result.current.isMount).toBe(false);
  });
});
