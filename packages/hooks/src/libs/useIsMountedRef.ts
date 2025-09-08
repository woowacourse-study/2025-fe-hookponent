import { useEffect, useRef } from 'react';

type IsMountedRefReturn = {
  isMount: boolean;
};

export function useIsMountedRef(): IsMountedRefReturn {
  const ref = useRef({ isMount: false }).current;

  useEffect(() => {
    ref.isMount = true;
    return () => {
      ref.isMount = false;
    };
  }, [ref]);

  return ref;
}
