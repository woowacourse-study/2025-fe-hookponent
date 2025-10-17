import { useState, useCallback, useMemo } from 'react';

interface useCycleListParams<T> {
  list: T[];
  options?: {
    initialValue?: T;
    steps?: number[];
  };
}

export function useCycleList<T>({ list, options }: useCycleListParams<T>) {
  const { initialValue, steps = [1, -1] } = options ?? {};

  // 초기 인덱스 설정
  const getInitialIndex = () => {
    if (initialValue !== undefined) {
      const index = list.findIndex((item) => item === initialValue);
      return index >= 0 ? index : 0;
    }
    return 0;
  };

  const [currentIndex, setCurrentIndex] = useState(getInitialIndex);

  // 현재 값
  const state = list[currentIndex];

  // 인덱스를 순환적으로 계산하는 함수
  const getCircularIndex = useCallback((index: number, listLength: number) => {
    return ((index % listLength) + listLength) % listLength;
  }, []);

  // next 함수
  const next = useCallback(() => {
    setCurrentIndex((prevIndex) => getCircularIndex(prevIndex + 1, list.length));
  }, [list.length, getCircularIndex]);

  // prev 함수
  const prev = useCallback(() => {
    setCurrentIndex((prevIndex) => getCircularIndex(prevIndex - 1, list.length));
  }, [list.length, getCircularIndex]);

  // steps 기반으로 확장된 배열 생성
  const extendedArray = useMemo(() => {
    if (!steps || steps.length === 0) return [list[currentIndex]];
    const maxStep = Math.max(...steps.map(Math.abs));
    const minStep = Math.min(...steps.map(Math.abs)) * -1;

    const result = [];
    for (let i = minStep; i <= maxStep; i++) {
      const index = getCircularIndex(currentIndex + i, list.length);
      result.push(list[index]);
    }

    return result;
  }, [currentIndex, list, steps, getCircularIndex]);

  // steps 기반으로 특정 위치의 값들 가져오기
  const getStepValues = useCallback(() => {
    return steps.map((step) => {
      const index = getCircularIndex(currentIndex + step, list.length);
      return list[index];
    });
  }, [currentIndex, list, steps, getCircularIndex]);

  // 특정 값으로 직접 이동
  const goTo = useCallback(
    (value: T) => {
      const index = list.findIndex((item) => item === value);
      if (index >= 0) {
        setCurrentIndex(index);
      }
    },
    [list]
  );

  // 특정 인덱스로 직접 이동
  const goToIndex = useCallback(
    (index: number) => {
      const circularIndex = getCircularIndex(index, list.length);
      setCurrentIndex(circularIndex);
    },
    [list.length, getCircularIndex]
  );

  return {
    state,
    next,
    prev,
    extendedArray,
    getStepValues,
    goTo,
    goToIndex,
    currentIndex,
  };
}
