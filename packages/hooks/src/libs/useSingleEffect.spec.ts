// useSingleEffect.spec.ts
import { renderHook } from '@testing-library/react';
import useSingleEffect from './useSingleEffect';

describe('useSingleEffect', () => {
  it('마운트 시 콜백을 한 번만 실행한다', () => {
    const cb = jest.fn();

    renderHook(() => useSingleEffect({ callback: cb }));

    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('언마운트 시 cleanup 함수를 실행한다', () => {
    const cleanup = jest.fn();
    const cb = jest.fn().mockReturnValue(cleanup);

    const { unmount } = renderHook(() => useSingleEffect({ callback: cb }));

    expect(cb).toHaveBeenCalledTimes(1);

    unmount(); // 언마운트 시뮬레이션
    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});
