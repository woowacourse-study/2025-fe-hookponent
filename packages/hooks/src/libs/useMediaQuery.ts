import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    const listener = () => {
      setMatches(media.matches);
    };

    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [query]);

  return matches;
}
