import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { useInfiniteScroll } from './useInfiniteScroll';

type MockEntry = Pick<IntersectionObserverEntry, 'isIntersecting'>;

declare global {
  interface GlobalThis {
    IntersectionObserver: typeof MockIntersectionObserver;
  }
}

class MockIntersectionObserver {
  callback: IntersectionObserverCallback;
  static lastInstance: MockIntersectionObserver | null = null;
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.lastInstance = this;
  }
  observe = jest.fn();
  disconnect = jest.fn();
  trigger(entries: MockEntry[]) {
    this.callback(entries as IntersectionObserverEntry[], this as unknown as IntersectionObserver);
  }
}

beforeAll(() => {
  globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
});

beforeEach(() => {
  jest.clearAllMocks();
  MockIntersectionObserver.lastInstance = null;
});

describe('useInfiniteScroll', () => {
  it('기본 반환값 확인', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useInfiniteScroll({ callback }));

    expect(result.current.targetRef).toBeDefined();
    expect(typeof result.current.loading).toBe('boolean');
    expect(result.current.loading).toBe(false);
  });

  it('IntersectionObserver 생성 및 observe 호출', async () => {
    const callback = jest.fn();
    const { result, rerender } = renderHook(() => useInfiniteScroll({ callback }));

    const mockElement = document.createElement('div');

    act(() => {
      result.current.targetRef.current = mockElement;
    });

    // 리렌더링을 통해 useEffect 트리거
    rerender();

    // useEffect가 실행되도록 대기
    await waitFor(() => {
      expect(MockIntersectionObserver.lastInstance).not.toBeNull();
    });

    expect(MockIntersectionObserver.lastInstance?.observe).toHaveBeenCalledWith(mockElement);
  });

  it('element가 intersect할 때 콜백 호출', async () => {
    const callback = jest.fn();
    const { result, rerender } = renderHook(() => useInfiniteScroll({ callback }));

    const mockElement = document.createElement('div');

    act(() => {
      result.current.targetRef.current = mockElement;
    });

    rerender();

    await waitFor(() => {
      expect(MockIntersectionObserver.lastInstance).not.toBeNull();
    });

    const observerInstance = MockIntersectionObserver.lastInstance!;

    act(() => {
      observerInstance.trigger([{ isIntersecting: true }]);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('element가 intersect하지 않을 때 콜백 호출하지 않음', async () => {
    const callback = jest.fn();
    const { result, rerender } = renderHook(() => useInfiniteScroll({ callback }));

    const mockElement = document.createElement('div');

    act(() => {
      result.current.targetRef.current = mockElement;
    });

    rerender();

    await waitFor(() => {
      expect(MockIntersectionObserver.lastInstance).not.toBeNull();
    });

    const observerInstance = MockIntersectionObserver.lastInstance!;

    act(() => {
      observerInstance.trigger([{ isIntersecting: false }]);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('아래로 스크롤 - 로딩 상태 관리', async () => {
    const callback = jest.fn(() => new Promise((res) => setTimeout(res, 1000)));
    const { result, rerender } = renderHook(() => useInfiniteScroll({ callback }));

    const mockElement = document.createElement('div');

    act(() => {
      result.current.targetRef.current = mockElement;
    });

    rerender();

    await waitFor(() => {
      expect(MockIntersectionObserver.lastInstance).not.toBeNull();
    });

    const observerInstance = MockIntersectionObserver.lastInstance!;

    act(() => {
      observerInstance.trigger([{ isIntersecting: true }]);
    });

    expect(result.current.loading).toBe(true); // 로딩 상태가 true여야 함

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false); // 로딩 상태가 false로 변경되어야 함
      },
      { timeout: 2000 }
    );

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('로딩 중일 때 추가 콜백 호출 방지', async () => {
    let resolveCallback: () => void;
    const callback = jest.fn(() => {
      return new Promise<void>((resolve) => {
        resolveCallback = resolve;
      });
    });

    const { result, rerender } = renderHook(() => useInfiniteScroll({ callback }));

    const mockElement = document.createElement('div');

    act(() => {
      result.current.targetRef.current = mockElement;
    });

    rerender();

    await waitFor(() => {
      expect(MockIntersectionObserver.lastInstance).not.toBeNull();
    });

    const observerInstance = MockIntersectionObserver.lastInstance!;

    // 첫 번째 intersection 트리거
    act(() => {
      observerInstance.trigger([{ isIntersecting: true }]);
    });

    expect(result.current.loading).toBe(true); // 로딩 중

    // loading 상태가 변경되면서 새로운 observer가 생성될 수 있음
    await waitFor(() => {
      expect(MockIntersectionObserver.lastInstance).not.toBeNull();
    });

    const currentObserverInstance = MockIntersectionObserver.lastInstance!;

    // 두 번째 intersection 트리거 (로딩 중이므로 무시되어야 함)
    act(() => {
      currentObserverInstance.trigger([{ isIntersecting: true }]);
    });

    // 로딩 중이므로 여전히 1번만 호출되어야 함
    expect(callback).toHaveBeenCalledTimes(1);

    // 첫 번째 콜백 완료
    await act(async () => {
      resolveCallback!();
    });

    expect(result.current.loading).toBe(false);
  });
  it('컴포넌트 언마운트 시 observer 정리', async () => {
    const callback = jest.fn();
    const { result, rerender, unmount } = renderHook(() => useInfiniteScroll({ callback }));

    const mockElement = document.createElement('div');

    act(() => {
      result.current.targetRef.current = mockElement;
    });

    rerender();

    await waitFor(() => {
      expect(MockIntersectionObserver.lastInstance).not.toBeNull();
    });

    const observerInstance = MockIntersectionObserver.lastInstance!;

    unmount();

    expect(observerInstance.disconnect).toHaveBeenCalledTimes(1);
  });
});
