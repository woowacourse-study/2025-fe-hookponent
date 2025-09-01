import { useEffect, useRef, useState } from 'react';

export interface UseInfiniteScrollOptions {
  callback: () => void;
  options?: IntersectionObserverInit;
}

/**
 * IntersectionObserver를 이용해 무한 스크롤 기능을 제공하는 커스텀 훅
 *
 * @param {UseInfiniteScrollOptions} params 무한 스크롤 옵션
 * @param {() => void} params.callback 관찰 대상이 화면에 나타났을 때 실행할 콜백
 * @param {IntersectionObserverInit} [params.options] IntersectionObserver 설정 값 (선택)
 * @returns {React.RefObject<T>} 감시 대상에 연결할 ref 객체
 */

export function useInfiniteScroll<T extends HTMLElement>({
  callback,
  options = { root: null, rootMargin: '0px', threshold: 1.0 },
}: UseInfiniteScrollOptions): { targetRef: React.RefObject<T>; loading: boolean } {
  const targetRef = useRef<T | null>(null);

  const [loading, setLoading] = useState(false);

  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!targetRef.current) return;
    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting && !loading) {
        setLoading(true);
        try {
          await callbackRef.current(); // ref로 감싼 최신 callback 호출
        } finally {
          setLoading(false);
        }
      }
    }, options);

    observer.observe(targetRef.current);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return { targetRef, loading };
}
