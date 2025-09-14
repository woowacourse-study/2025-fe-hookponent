import { EffectCallback, useEffect } from 'react';

interface UseInitEffectParams {
  callback: EffectCallback; 
}

const useInitEffect = ({ callback }: UseInitEffectParams) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => callback(), []);
};

export default useInitEffect;
