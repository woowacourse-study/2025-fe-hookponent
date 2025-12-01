import { renderHook, act } from '@testing-library/react';
import { useCycleList } from './useCycleList';

describe('useCycleList', () => {
  const mockList = ['a', 'b', 'c', 'd', 'e'];
  const numberList = [1, 2, 3, 4, 5];
  const objectList = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ];

  describe('기본 동작', () => {
    it('초기 상태가 올바르게 설정되어야 함', () => {
      const { result } = renderHook(() => useCycleList({ list: mockList }));

      expect(result.current.state).toBe('a');
      expect(result.current.currentIndex).toBe(0);
    });

    it('next 호출 시 다음 항목으로 이동해야 함', () => {
      const { result } = renderHook(() => useCycleList({ list: mockList }));

      act(() => {
        result.current.next();
      });

      expect(result.current.state).toBe('b');
      expect(result.current.currentIndex).toBe(1);
    });

    it('prev 호출 시 이전 항목으로 이동해야 함', () => {
      const { result } = renderHook(() => useCycleList({ list: mockList }));

      act(() => {
        result.current.next();
        result.current.next();
        result.current.prev();
      });

      expect(result.current.state).toBe('b');
      expect(result.current.currentIndex).toBe(1);
    });
  });

  describe('순환 동작', () => {
    it('마지막 항목에서 next 호출 시 첫 번째 항목으로 순환해야 함', () => {
      const { result } = renderHook(() => useCycleList({ list: mockList }));

      // 마지막 항목까지 이동
      act(() => {
        for (let i = 0; i < 4; i++) {
          result.current.next();
        }
      });

      expect(result.current.state).toBe('e');

      // 한 번 더 next 호출
      act(() => {
        result.current.next();
      });

      expect(result.current.state).toBe('a');
      expect(result.current.currentIndex).toBe(0);
    });

    it('첫 번째 항목에서 prev 호출 시 마지막 항목으로 순환해야 함', () => {
      const { result } = renderHook(() => useCycleList({ list: mockList }));

      act(() => {
        result.current.prev();
      });

      expect(result.current.state).toBe('e');
      expect(result.current.currentIndex).toBe(4);
    });
  });

  describe('초기값 설정', () => {
    it('유효한 초기값으로 시작해야 함', () => {
      const { result } = renderHook(() =>
        useCycleList({
          list: mockList,
          options: { initialValue: 'c' },
        })
      );

      expect(result.current.state).toBe('c');
      expect(result.current.currentIndex).toBe(2);
    });

    it('존재하지 않는 초기값의 경우 첫 번째 항목으로 시작해야 함', () => {
      const { result } = renderHook(() =>
        useCycleList({
          list: mockList,
          options: { initialValue: 'z' },
        })
      );

      expect(result.current.state).toBe('a');
      expect(result.current.currentIndex).toBe(0);
    });

    it('객체 배열에서 초기값이 올바르게 동작해야 함', () => {
      const targetObject = objectList[1];
      const { result } = renderHook(() =>
        useCycleList({
          list: objectList,
          options: { initialValue: targetObject },
        })
      );

      expect(result.current.state).toBe(targetObject);
      expect(result.current.currentIndex).toBe(1);
    });
  });

  describe('goTo 기능', () => {
    it('특정 값으로 이동해야 함', () => {
      const { result } = renderHook(() => useCycleList({ list: mockList }));

      act(() => {
        result.current.goTo('d');
      });

      expect(result.current.state).toBe('d');
      expect(result.current.currentIndex).toBe(3);
    });

    it('존재하지 않는 값으로 이동 시도 시 현재 상태 유지해야 함', () => {
      const { result } = renderHook(() => useCycleList({ list: mockList }));
      const initialState = result.current.state;
      const initialIndex = result.current.currentIndex;

      act(() => {
        result.current.goTo('z');
      });

      expect(result.current.state).toBe(initialState);
      expect(result.current.currentIndex).toBe(initialIndex);
    });

    it('숫자 배열에서 goTo가 올바르게 동작해야 함', () => {
      const { result } = renderHook(() => useCycleList({ list: numberList }));

      act(() => {
        result.current.goTo(4);
      });

      expect(result.current.state).toBe(4);
      expect(result.current.currentIndex).toBe(3);
    });
  });

  describe('goToIndex 기능', () => {
    it('유효한 인덱스로 이동해야 함', () => {
      const { result } = renderHook(() => useCycleList({ list: mockList }));

      act(() => {
        result.current.goToIndex(2);
      });

      expect(result.current.state).toBe('c');
      expect(result.current.currentIndex).toBe(2);
    });

    it('음수 인덱스를 순환적으로 처리해야 함', () => {
      const { result } = renderHook(() => useCycleList({ list: mockList }));

      act(() => {
        result.current.goToIndex(-1);
      });

      expect(result.current.state).toBe('e');
      expect(result.current.currentIndex).toBe(4);
    });

    it('배열 길이를 초과하는 인덱스를 순환적으로 처리해야 함', () => {
      const { result } = renderHook(() => useCycleList({ list: mockList }));

      act(() => {
        result.current.goToIndex(7); // 5 + 2 = index 2
      });

      expect(result.current.state).toBe('c');
      expect(result.current.currentIndex).toBe(2);
    });
  });

  describe('steps 기능', () => {
    it('기본 steps [-1, 1]에 대해 getStepValues가 올바르게 동작해야 함', () => {
      const { result } = renderHook(() =>
        useCycleList({
          list: mockList,
          options: { steps: [-1, 1] },
        })
      );

      // 인덱스 2 (c)로 이동
      act(() => {
        result.current.goToIndex(2);
      });

      const stepValues = result.current.getStepValues();
      expect(stepValues).toEqual(['b', 'd']); // -1: b, +1: d
    });

    it('사용자 정의 steps에 대해 올바르게 동작해야 함', () => {
      const { result } = renderHook(() =>
        useCycleList({
          list: mockList,
          options: { steps: [-2, 0, 2] },
        })
      );

      // 인덱스 2 (c)로 이동
      act(() => {
        result.current.goToIndex(2);
      });

      const stepValues = result.current.getStepValues();
      expect(stepValues).toEqual(['a', 'c', 'e']); // -2: a, 0: c, +2: e
    });

    it('순환 범위에서 steps가 올바르게 동작해야 함', () => {
      const { result } = renderHook(() =>
        useCycleList({
          list: mockList,
          options: { steps: [-1, 0, 1] },
        })
      );

      // 첫 번째 인덱스에서 테스트
      const stepValues = result.current.getStepValues();
      expect(stepValues).toEqual(['e', 'a', 'b']); // -1: e (순환), 0: a, +1: b
    });
  });

  describe('extendedArray 기능', () => {
    it('기본 steps에 대해 extendedArray가 올바르게 생성되어야 함', () => {
      const { result } = renderHook(() =>
        useCycleList({
          list: mockList,
          options: { steps: [-1, 1] },
        })
      );

      // 인덱스 2로 이동
      act(() => {
        result.current.goToIndex(2);
      });

      const extendedArray = result.current.extendedArray;
      expect(extendedArray).toEqual(['b', 'c', 'd']); // -1부터 +1까지
    });

    it('steps가 없을 때 현재 값만 포함해야 함', () => {
      const { result } = renderHook(() =>
        useCycleList({
          list: mockList,
          options: { steps: [] },
        })
      );

      const extendedArray = result.current.extendedArray;
      expect(extendedArray).toEqual(['a']);
    });
  });

  describe('엣지 케이스', () => {
    it('단일 항목 배열에서 올바르게 동작해야 함', () => {
      const singleItemList = ['only'];
      const { result } = renderHook(() => useCycleList({ list: singleItemList }));

      expect(result.current.state).toBe('only');

      act(() => {
        result.current.next();
      });

      expect(result.current.state).toBe('only');
      expect(result.current.currentIndex).toBe(0);

      act(() => {
        result.current.prev();
      });

      expect(result.current.state).toBe('only');
      expect(result.current.currentIndex).toBe(0);
    });

    it('두 개 항목 배열에서 올바르게 순환해야 함', () => {
      const twoItemList = ['first', 'second'];
      const { result } = renderHook(() => useCycleList({ list: twoItemList }));

      expect(result.current.state).toBe('first');

      act(() => {
        result.current.next();
      });

      expect(result.current.state).toBe('second');

      act(() => {
        result.current.next();
      });

      expect(result.current.state).toBe('first');

      act(() => {
        result.current.prev();
      });

      expect(result.current.state).toBe('second');
    });
  });

  describe('타입 안전성', () => {
    it('다양한 타입의 배열에서 올바르게 동작해야 함', () => {
      // 문자열 배열
      const { result: stringResult } = renderHook(() => useCycleList({ list: ['a', 'b', 'c'] }));
      expect(typeof stringResult.current.state).toBe('string');

      // 숫자 배열
      const { result: numberResult } = renderHook(() => useCycleList({ list: [1, 2, 3] }));
      expect(typeof numberResult.current.state).toBe('number');

      // 객체 배열
      const { result: objectResult } = renderHook(() => useCycleList({ list: objectList }));
      expect(typeof objectResult.current.state).toBe('object');
      expect(objectResult.current.state).toHaveProperty('id');
      expect(objectResult.current.state).toHaveProperty('name');
    });
  });

  describe('성능 및 안정성', () => {
    it('큰 배열에서도 올바르게 동작해야 함', () => {
      const largeList = Array.from({ length: 1000 }, (_, i) => i);
      const { result } = renderHook(() => useCycleList({ list: largeList }));

      expect(result.current.state).toBe(0);

      act(() => {
        result.current.goToIndex(999);
      });

      expect(result.current.state).toBe(999);

      act(() => {
        result.current.next();
      });

      expect(result.current.state).toBe(0);
    });
  });
});
