import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean;
export function useMediaQuery(query: string[]): boolean[];

export function useMediaQuery(query: string | string[]): boolean | boolean[] {
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
