import { useEffect, useState } from 'react';

/**
 * WidthQuery 타입
 * - '(max-width: 768px)' 또는 '(min-width: 1024px)'와 같은 문자열만 허용
 */
type WidthQuery = `(max-width: ${number}px)` | `(min-width: ${number}px)`;

/**
 * 쿼리 유효성 검사 함수
 * - 전달된 쿼리 문자열이 `(max-width: --px)` 또는 `(min-width: --px)` 형식과 일치하는지 검사합니다.
 * - 형식이 잘못되면 개발 모드에서 경고 메시지를 출력합니다.
 *
 * @param {string | string[]} query - 검사할 CSS 미디어 쿼리 문자열 또는 문자열 배열
 */
function validateQuery(query: string | string[]) {
  const pattern = /^\((max|min)-width:\s*\d+px\)$/;
  const queries = Array.isArray(query) ? query : [query];

  queries.forEach((q) => {
    if (!pattern.test(q)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[useMediaQuery] 잘못된 쿼리 형식입니다: "${q}". 올바른 형식 예: '(max-width: 768px)'`);
      }
    }
  });
}

export function useMediaQuery(query: WidthQuery): boolean;
export function useMediaQuery(query: WidthQuery[]): boolean[];

/**
 * `useMediaQuery` 훅은 브라우저의 `matchMedia` API를 사용하여
 * 특정 CSS 미디어 쿼리(또는 여러 쿼리)의 일치 여부를 감지하고,
 * 해당 상태가 변경될 때마다 React 상태를 자동으로 업데이트합니다.
 *
 * ### 추가된 기능
 * 1. **쿼리 형식 제한**:
 *    - TypeScript `WidthQuery` 타입을 사용하여 `(max-width: ${number}px)` 또는 `(min-width: ${number}px)` 형식만 허용합니다.
 * 2. **런타임 유효성 검사**:
 *    - `validateQuery` 함수를 사용해 잘못된 형식의 쿼리가 전달되면 개발 모드에서 경고 메시지를 출력합니다.
 *
 * ### 반환 값
 * - **단일 쿼리 문자열** → 해당 쿼리의 일치 여부를 나타내는 `boolean`
 * - **쿼리 배열** → 각 쿼리의 일치 여부를 순서대로 담은 `boolean[]`
 *
 * ### SSR 안전성
 * - 서버사이드 렌더링 환경에서는 `window` 객체가 없으므로 기본값(`false` 또는 `false[]`)으로 초기화합니다.
 *
 * @param {WidthQuery | WidthQuery[]} query - 감시할 CSS 미디어 쿼리 문자열 또는 문자열 배열
 *
 * @returns {boolean | boolean[]}
 * - **단일 쿼리**: 현재 뷰포트가 해당 조건에 일치하면 `true`, 아니면 `false`
 * - **쿼리 배열**: 각 조건별 일치 여부를 담은 배열
 *
 * @example
 * // 단일 미디어 쿼리 사용
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * return <div>{isMobile ? '모바일 화면' : '데스크톱 화면'}</div>;
 *
 * @example
 * // 여러 미디어 쿼리 사용
 * const [isSmall, isMedium] = useMediaQuery([
 *   '(max-width: 640px)',
 *   '(max-width: 1024px)',
 * ]);
 * console.log(isSmall, isMedium);
 */
export function useMediaQuery(query: WidthQuery | WidthQuery[]): boolean | boolean[] {
  const getInitialMatches = () => {
    if (typeof window === 'undefined') {
      return Array.isArray(query) ? Array<boolean>(query.length).fill(false) : false;
    }

    if (Array.isArray(query)) {
      return query.map((q) => window.matchMedia(q).matches);
    }
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState<boolean | boolean[]>(getInitialMatches);

  useEffect(() => {
    validateQuery(query);

    if (Array.isArray(query)) {
      const mediaList = query.map((q) => window.matchMedia(q));
      const listener = () => {
        const results = mediaList.map((media) => media.matches);
        setMatches(results);
      };

      mediaList.forEach((media) => media.addEventListener('change', listener));
      return () => {
        mediaList.forEach((media) => media.removeEventListener('change', listener));
      };
    } else {
      const media = window.matchMedia(query);
      const listener = (e: MediaQueryListEvent) => {
        setMatches(e.matches);
      };

      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(query)]);

  return matches;
}
