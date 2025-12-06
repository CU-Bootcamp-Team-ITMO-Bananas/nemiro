import { useHub } from '@/shared/context/hub.context';

export const Canvas = () => {
  const { connection, connectionStarted } = useHub();

  return (
    <div className='relative w-full h-screen bg-gray-100'>
      <canvas
        // ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className='absolute top-0 left-0'
      />
    </div>
  );
};
