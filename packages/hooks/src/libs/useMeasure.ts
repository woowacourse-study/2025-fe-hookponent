import { RefObject, useEffect, useRef, useState } from 'react';

type useMeasureReturn<T> = { ref: RefObject<T>; size: { width: number; height: number } };

/**
 * `useMeasure` 훅은 요소의 크기(`width`, `height`)를 측정하고,
 * 해당 요소의 크기가 변경될 때마다 자동으로 업데이트되는 값을 제공합니다.
 *
 * - `ref`를 연결한 DOM 요소의 크기를 `ResizeObserver`를 통해 감지합니다.
 * - `ref를 사용하지 않는 경우엔, `window.innerWidth`와 `window.innerHeight`를 사용하여
 *   뷰포트 크기를 반환하며, 윈도우 리사이즈 이벤트를 구독합니다.
 * - 크기가 변경되지 않은 경우에는 불필요한 상태 업데이트를 방지합니다.
 *
 * @template T - 크기를 측정할 HTML 요소 타입 (예: HTMLDivElement, HTMLTextAreaElement 등)
 *
 * @returns {{ref:RefObject<T>, size:{ width: number; height: number }}}
 * - `ref`: 크기를 측정할 DOM 요소에 연결할 `ref` 객체
 * - `size`: 해당 요소 또는 윈도우의 현재 `{ width, height }` 정보
 *
 * @example
 * const {ref, size} = useMeasure<HTMLDivElement>();
 * return <div ref={ref}>너비: {size.width}px</div>;
 *
 * @example
 * // ref를 연결하지 않으면 window 크기를 추적합니다.
 * const {size} = useMeasure();
 * console.log(size.width); // window.innerWidth
 */

const useMeasure = <T extends HTMLElement>(): useMeasureReturn<T> => {
  const [state, setState] = useState({ width: 0, height: 0 });
  const ref = useRef<T | null>(null);

  useEffect(() => {
    let observer: ResizeObserver | null = null;

    const updateWindowSize = () => {
      setState({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if (ref.current) {
      observer = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        setState((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
      });
      observer.observe(ref.current);
    } else {
      updateWindowSize();
      window.addEventListener('resize', updateWindowSize);
    }

    return () => {
      if (observer) observer.disconnect();
      else window.removeEventListener('resize', updateWindowSize);
    };
  }, []);

  return { ref, size: state };
};

export default useMeasure;
