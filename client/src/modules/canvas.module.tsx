// components/Canvas/index.tsx
import { useHub } from '@/shared/context/hub.context';
import { useStageZoomPan } from '@/shared/hooks/useStageZoomPan';
import { Board } from '@/shared/interfaces/board/board.interface';
import { PointerUpdateEvent } from '@/shared/interfaces/events/pointer-update-event.interface';
import { useBoardStore } from '@/shared/stores/board.store';
import { useCallback, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';

export const Canvas = () => {
  const { updateBoard } = useBoardStore();
  const { subscribe, emit, connection } = useHub();
  const {
    stageRef,
    stagePos,
    stageScale,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useStageZoomPan();

  const lastEmitTime = useRef(0);
  const emitThrottleMs = 100;

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      const now = Date.now();
      if (now - lastEmitTime.current > emitThrottleMs) {
        lastEmitTime.current = now;
        const { clientX, clientY } = event;
        emit<PointerUpdateEvent>('UpdatePointer', { x: clientX, y: clientY });
      }
    },
    [emit]
  );

  useEffect(() => {
    const abortController = new AbortController();

    subscribe<Board>(
      'BoardUpdate',
      (board) => updateBoard(board),
      abortController.signal
    );

    return () => {
      abortController.abort();
    };
  }, [connection, subscribe, updateBoard]);

  return (
    <div
      onMouseMove={handleMouseMove}
      className='relative w-full h-screen'
      style={{ touchAction: 'none' }}
    >
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        draggable
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        x={stagePos.x}
        y={stagePos.y}
        scaleX={stageScale}
        scaleY={stageScale}
      >
        <Layer>
          <Rect
            x={20}
            y={50}
            width={100}
            height={100}
            fill='red'
            shadowBlur={10}
            draggable
          />
          <Circle x={200} y={100} radius={50} fill='green' draggable />
        </Layer>
      </Stage>
    </div>
  );
};
