import { renderHook, act } from '@testing-library/react';
import { useAsyncLock } from './useAsyncLock';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('useAsyncLock 테스트', () => {
  test('동시에 두 번 호출해도 실제 실행은 1회만 된다', async () => {
    const { result } = renderHook(() => useAsyncLock());
    let runCount = 0;

    const task = async () => {
      runCount++;
      await sleep(30);
    };

    await act(async () => {
      const p1 = result.current.runWithLock(task); // 첫 번째 호출 시작
      const p2 = result.current.runWithLock(task); // 잠금 중 두 번째 호출(무시)
      await Promise.all([p1, p2]);
    });

    expect(runCount).toBe(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.isLockedRef.current).toBe(false);
  });

  test('실행 중에는 loading=true, 종료 후 false로 복귀', async () => {
    const { result } = renderHook(() => useAsyncLock());

    const task = async () => {
      // 실행 직후엔 loading true여야 함
      expect(result.current.loading).toBe(true);
      await sleep(10);
    };

    await act(async () => {
      const p = result.current.runWithLock(task);
      // 락이 걸렸는지 확인
      expect(result.current.isLockedRef.current).toBe(true);
      await p;
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.isLockedRef.current).toBe(false);
  });

  test('lock 중 재호출 시 runWithLock은 undefined를 반환한다', async () => {
    const { result } = renderHook(() => useAsyncLock());

    const slow = async () => sleep(20);

    // 첫 실행: 락 설정
    let first: Promise<unknown> | undefined;
    await act(async () => {
      first = result.current.runWithLock(slow);
    });

    // 두 번째 실행: 잠금 중 → undefined 반환
    let secondReturn: unknown;
    await act(async () => {
      secondReturn = await result.current.runWithLock(slow);
    });
    expect(secondReturn).toBeUndefined();

    // 첫 실행이 아직 안 끝났을 수 있으니, 여기서 끝날 때까지 기다림
    await act(async () => {
      await first;
    });
    expect(result.current.loading).toBe(false);
  });

  test('에러 발생 시 onError가 호출되고 상태가 복구된다', async () => {
    const { result } = renderHook(() => useAsyncLock());

    const err = new Error('boom');
    const failing = async () => {
      await sleep(5);
      throw err;
    };

    const onError = jest.fn();

    await act(async () => {
      await result.current.runWithLock(failing, onError);
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(err);
    // 에러 이후에도 상태 정상 복구되는지 확인
    expect(result.current.loading).toBe(false);
    expect(result.current.isLockedRef.current).toBe(false);
  });

  test('첫 실행이 끝난 뒤에는 다시 실행할 수 있다', async () => {
    const { result } = renderHook(() => useAsyncLock());
    let count = 0;
    const task = async () => {
      count++;
      await sleep(10);
    };

    await act(async () => {
      await result.current.runWithLock(task);
    });
    await act(async () => {
      await result.current.runWithLock(task);
    });

    expect(count).toBe(2);
  });
});
