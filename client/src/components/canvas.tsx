import { useHub } from '@/shared/context/hub.context';
import { useEffect } from 'react';

export const Canvas = () => {
  const { subscribe, emit } = useHub();

  useEffect(() => {
    const abortController = new AbortController();
    subscribe('board_event', (lo) => console.log(lo), abortController.signal);

    return () => {
      abortController.abort();
    };
  }, []);

  return <div className='relative w-full h-screen bg-gray-100'></div>;
};
