import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean;
export function useMediaQuery(query: string[]): boolean[];

export function useMediaQuery(query: string | string[]): boolean | boolean[] {
  const [matches, setMatches] = useState(() => {
    if (Array.isArray(query)) return Array<boolean>(query.length).fill(false);
    return false;
  });

  useEffect(() => {
    const listener = () => {
      if (Array.isArray(query)) {
        const queryMatches = query.map((eachQuery) => window.matchMedia(eachQuery).matches);
        setMatches(queryMatches);
      } else {
        const media = window.matchMedia(query);
        setMatches(media.matches);
      }
    };

    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [query]);

  return matches;
}
