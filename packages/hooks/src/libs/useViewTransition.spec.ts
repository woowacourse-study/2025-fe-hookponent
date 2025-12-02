import { act, renderHook } from '@testing-library/react';
import { useViewTransition } from './useViewTransition';

const mockStartViewTransition = jest.fn();
const mockTransition = {
  ready: Promise.resolve(),
  finished: Promise.resolve(),
  updateCallbackDone: Promise.resolve(),
  skipTransition: jest.fn(),
};

const createMockElement = (name = null) => {
  const element = document.createElement('div');
  if (name) {
    element.style.viewTransitionName = name;
  }
  return element;
};

describe('useViewTransition 훅 검증 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStartViewTransition.mockReturnValue(mockTransition);
    
    Object.defineProperty(document, 'startViewTransition', {
      value: mockStartViewTransition,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    delete (document as Document & { startViewTransition?: unknown }).startViewTransition;
  });

  describe('기본 반환값 검증', () => {
    it('startTransition과 bindRef 함수를 반환해야 한다', () => {
      const { result } = renderHook(() => useViewTransition());

      expect(result.current).toHaveProperty('startTransition');
      expect(result.current).toHaveProperty('bindRef');
      expect(typeof result.current.startTransition).toBe('function');
      expect(typeof result.current.bindRef).toBe('function');
    });

    it('bindRef는 함수를 반환해야 한다', () => {
      const { result } = renderHook(() => useViewTransition());
      const refCallback = result.current.bindRef('test-element');

      expect(typeof refCallback).toBe('function');
    });
  });

  describe('bindRef 기능 테스트', () => {
    it('요소에 view-transition-name을 설정해야 한다', () => {
      const { result } = renderHook(() => useViewTransition());
      const element = createMockElement();
      const refCallback = result.current.bindRef('test-name');

      act(() => {
        refCallback(element);
      });

      expect(element.style.viewTransitionName).toBe('test-name');
    });

    it('null이 전달되면 요소의 view-transition-name을 제거해야 한다', () => {
      const { result } = renderHook(() => useViewTransition());
      const element = createMockElement('existing-name');
      const refCallback = result.current.bindRef('test-name');

      act(() => {
        refCallback(element);
      });

      act(() => {
        refCallback(null);
      });

      expect(element.style.viewTransitionName).toBe('');
    });

    it('같은 이름으로 여러 요소를 바인딩할 수 있어야 한다', () => {
      const { result } = renderHook(() => useViewTransition());
      const element1 = createMockElement();
      const element2 = createMockElement();
      const refCallback = result.current.bindRef('shared-name');

      act(() => {
        refCallback(element1);
      });

      act(() => {
        refCallback(element2);
      });

      expect(element1.style.viewTransitionName).toBe('shared-name');
      expect(element2.style.viewTransitionName).toBe('shared-name');
    });
  });

  describe('startTransition 기능 테스트 - View Transition API 지원', () => {
    it('document.startViewTransition이 호출되어야 한다', () => {
      const { result } = renderHook(() => useViewTransition());
      const updateFn = jest.fn();

      act(() => {
        result.current.startTransition(updateFn);
      });

      expect(mockStartViewTransition).toHaveBeenCalledWith(updateFn);
      expect(mockStartViewTransition).toHaveBeenCalledTimes(1);
    });

    it('onReady 콜백이 transition.ready Promise와 연결되어야 한다', async () => {
      const { result } = renderHook(() => useViewTransition());
      const updateFn = jest.fn();
      const onReady = jest.fn();

      act(() => {
        result.current.startTransition(updateFn, { onReady });
      });

      await act(async () => {
        await mockTransition.ready;
      });

      expect(onReady).toHaveBeenCalledTimes(1);
    });

    it('onFinish 콜백이 transition.finished Promise와 연결되어야 한다', async () => {
      const { result } = renderHook(() => useViewTransition());
      const updateFn = jest.fn();
      const onFinish = jest.fn();

      act(() => {
        result.current.startTransition(updateFn, { onFinish });
      });

      await act(async () => {
        await mockTransition.finished;
      });

      expect(onFinish).toHaveBeenCalledTimes(1);
    });

    it('onReady와 onFinish 콜백이 모두 정상 작동해야 한다', async () => {
      const { result } = renderHook(() => useViewTransition());
      const updateFn = jest.fn();
      const onReady = jest.fn();
      const onFinish = jest.fn();

      act(() => {
        result.current.startTransition(updateFn, { onReady, onFinish });
      });

      await act(async () => {
        await Promise.all([mockTransition.ready, mockTransition.finished]);
      });

      expect(onReady).toHaveBeenCalledTimes(1);
      expect(onFinish).toHaveBeenCalledTimes(1);
    });
  });

  describe('startTransition 기능 테스트 - View Transition API 미지원', () => {
    beforeEach(() => {
      // document.startViewTransition 제거
      delete (document as Document & { startViewTransition?: unknown }).startViewTransition;
    });

    it('View Transition API가 없을 때 폴백 모드로 동작해야 한다', () => {
      const { result } = renderHook(() => useViewTransition());
      const updateFn = jest.fn();
      const onReady = jest.fn();
      const onFinish = jest.fn();

      act(() => {
        result.current.startTransition(updateFn, { onReady, onFinish });
      });

      expect(updateFn).toHaveBeenCalledTimes(1);
      expect(onReady).toHaveBeenCalledTimes(1);
      expect(onFinish).toHaveBeenCalledTimes(1);
      expect(mockStartViewTransition).not.toHaveBeenCalled();
    });

    it('폴백 모드에서 콜백 없이도 정상 동작해야 한다', () => {
      const { result } = renderHook(() => useViewTransition());
      const updateFn = jest.fn();

      act(() => {
        result.current.startTransition(updateFn);
      });

      expect(updateFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('startTransition 에러 처리 테스트', () => {
    it('document.startViewTransition에서 에러 발생 시 폴백으로 동작해야 한다', () => {
      const { result } = renderHook(() => useViewTransition());
      const updateFn = jest.fn();
      const onReady = jest.fn();
      const onFinish = jest.fn();

      // startViewTransition이 에러를 던지도록 설정
      mockStartViewTransition.mockImplementation(() => {
        throw new Error('View Transition failed');
      });

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      act(() => {
        result.current.startTransition(updateFn, { onReady, onFinish });
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith('View transition failed:', expect.any(Error));
      expect(updateFn).toHaveBeenCalledTimes(1);
      expect(onReady).toHaveBeenCalledTimes(1);
      expect(onFinish).toHaveBeenCalledTimes(1);

      consoleWarnSpy.mockRestore();
    });

    it('transition.ready Promise가 reject되어도 onReady 콜백이 호출되어야 한다', async () => {
      const { result } = renderHook(() => useViewTransition());
      const updateFn = jest.fn();
      const onReady = jest.fn();

      const failedTransition = {
        ...mockTransition,
        ready: Promise.reject(new Error('Ready failed')),
      };

      mockStartViewTransition.mockReturnValue(failedTransition);

      act(() => {
        result.current.startTransition(updateFn, { onReady });
      });

      // Promise rejection 처리 대기
      await act(async () => {
      try {
        await failedTransition.ready;
      } catch {
        // 에러는 catch되지만 onReady는 여전히 호출되어야 함
      }
      });

      expect(onReady).toHaveBeenCalledTimes(1);
    });

    it('transition.finished Promise가 reject되어도 onFinish 콜백이 호출되어야 한다', async () => {
      const { result } = renderHook(() => useViewTransition());
      const updateFn = jest.fn();
      const onFinish = jest.fn();

      const failedTransition = {
        ...mockTransition,
        finished: Promise.reject(new Error('Finished failed')),
      };

      mockStartViewTransition.mockReturnValue(failedTransition);

      act(() => {
        result.current.startTransition(updateFn, { onFinish });
      });

      // Promise rejection 처리 대기
      await act(async () => {
      try {
        await failedTransition.finished;
      } catch {
        // 에러는 catch되지만 onFinish는 여전히 호출되어야 함
      }
      });

      expect(onFinish).toHaveBeenCalledTimes(1);
    });
  });

  describe('함수 참조 안정성 테스트', () => {
    it('bindRef 함수는 같은 이름에 대해 일관된 동작을 해야 한다', () => {
      const { result } = renderHook(() => useViewTransition());
      const element1 = createMockElement();
      const element2 = createMockElement();

      const refCallback1 = result.current.bindRef('test-name');
      const refCallback2 = result.current.bindRef('test-name');

      act(() => {
        refCallback1(element1);
      });

      act(() => {
        refCallback2(element2);
      });

      expect(element1.style.viewTransitionName).toBe('test-name');
      expect(element2.style.viewTransitionName).toBe('test-name');
    });

    it('startTransition 함수는 리렌더링 시에도 동일한 참조를 유지해야 한다', () => {
      const { result, rerender } = renderHook(() => useViewTransition());

      const startTransition1 = result.current.startTransition;
      
      rerender();
      
      const startTransition2 = result.current.startTransition;

      expect(startTransition1).toBe(startTransition2);
    });

    it('bindRef 함수는 리렌더링 시에도 동일한 참조를 유지해야 한다', () => {
      const { result, rerender } = renderHook(() => useViewTransition());

      const bindRef1 = result.current.bindRef;
      
      rerender();
      
      const bindRef2 = result.current.bindRef;

      expect(bindRef1).toBe(bindRef2);
    });
  });
});
