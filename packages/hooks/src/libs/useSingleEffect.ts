import { useEffect } from 'react';

interface Effect {
  callback: () => void | (() => void);
}

const useSingleEffect = ({ callback }: Effect) => {
  useEffect(() => callback(), []);
};

export default useSingleEffect;
