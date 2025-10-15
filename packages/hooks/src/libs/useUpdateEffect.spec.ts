import { renderHook } from '@testing-library/react';
import type { EffectCallback } from 'react';
import { useUpdateEffect } from './useUpdateEffect';

describe('useUpdateEffect', () => {
  it('마운트 시에는 effect가 실행되지 않는다', () => {
    const spy = jest.fn<ReturnType<EffectCallback>, Parameters<EffectCallback>>();

    renderHook(({ dep }) => useUpdateEffect(spy, [dep]), {
      initialProps: { dep: 0 },
    });

    expect(spy).not.toHaveBeenCalled();
  });

  it('deps가 변경되면 effect가 실행된다', () => {
    const spy = jest.fn<ReturnType<EffectCallback>, Parameters<EffectCallback>>();

    const { rerender } = renderHook(({ dep }) => useUpdateEffect(spy, [dep]), {
      initialProps: { dep: 0 },
    });

    expect(spy).not.toHaveBeenCalled();

    rerender({ dep: 1 });
    expect(spy).toHaveBeenCalledTimes(1);

    rerender({ dep: 2 });
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('cleanup은 다음 업데이트 전에 호출된다', () => {
    const cleanup = jest.fn();
    const effect = jest.fn<ReturnType<EffectCallback>, Parameters<EffectCallback>>(() => cleanup);

    const { rerender } = renderHook(({ dep }) => useUpdateEffect(effect, [dep]), {
      initialProps: { dep: 0 },
    });

    expect(effect).not.toHaveBeenCalled();
    expect(cleanup).not.toHaveBeenCalled();

    rerender({ dep: 1 });
    expect(effect).toHaveBeenCalledTimes(1);
    expect(cleanup).not.toHaveBeenCalled();

    rerender({ dep: 2 });
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(effect).toHaveBeenCalledTimes(2);
  });

  it('언마운트 시 마지막 cleanup이 호출된다', () => {
    const cleanup = jest.fn();
    const effect = jest.fn<ReturnType<EffectCallback>, Parameters<EffectCallback>>(() => cleanup);

    const { rerender, unmount } = renderHook(({ dep }) => useUpdateEffect(effect, [dep]), {
      initialProps: { dep: 0 },
    });

    rerender({ dep: 1 });
    expect(effect).toHaveBeenCalledTimes(1);
    expect(cleanup).not.toHaveBeenCalled();

    unmount();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('deps가 여러 개인 경우에도 변경 시 1회 실행된다', () => {
    const spy = jest.fn<ReturnType<EffectCallback>, Parameters<EffectCallback>>();

    const { rerender } = renderHook(({ a, b }) => useUpdateEffect(spy, [a, b]), { initialProps: { a: 1, b: 'x' } });

    expect(spy).not.toHaveBeenCalled();

    rerender({ a: 2, b: 'x' });
    expect(spy).toHaveBeenCalledTimes(1);

    rerender({ a: 2, b: 'y' });
    expect(spy).toHaveBeenCalledTimes(2);

    rerender({ a: 3, b: 'z' });
    expect(spy).toHaveBeenCalledTimes(3);
  });
});
