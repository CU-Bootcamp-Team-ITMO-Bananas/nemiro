import { useHub } from '@/shared/context/hub.context';
import { useStageZoomPan } from '@/shared/hooks/useStageZoomPan';
import { Board } from '@/shared/interfaces/board/board.interface';
import { PointerUpdateEvent } from '@/shared/interfaces/events/pointer-update-event.interface';
import { useBoardStore } from '@/shared/stores/board.store';
import { findRenderer } from '@/shared/renderers/element-renderer.registry';
import { useCallback, useEffect, useRef, Fragment } from 'react';
import { Stage, Layer, Circle, Group } from 'react-konva';

export const Canvas = () => {
  const { board, updateBoard, updateElement, removeElement } = useBoardStore();
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

        // Get the stage container's position relative to the viewport
        const stage = stageRef.current;
        if (stage) {
          const container = stage.container();
          const rect = container.getBoundingClientRect();

          // Convert window coordinates to stage coordinates
          // 1. First, get position relative to the container
          const containerX = clientX - rect.left;
          const containerY = clientY - rect.top;

          // 2. Then, convert to stage coordinates (accounting for pan and zoom)
          const stageX = (containerX - stage.x()) / stage.scaleX();
          const stageY = (containerY - stage.y()) / stage.scaleY();

          emit<PointerUpdateEvent>('UpdatePointer', {
            x: stageX,
            y: stageY,
          });
        } else {
          // Fallback to window coordinates if stage not available
          emit<PointerUpdateEvent>('UpdatePointer', { x: clientX, y: clientY });
        }
      }
    },
    [emit, stageRef]
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

  const getUserColor = (userId: number): string => {
    const colors = [
      '#FF6B6B', // Red
      '#4ECDC4', // Teal
      '#FFD166', // Yellow
      '#06D6A0', // Green
      '#118AB2', // Blue
      '#EF476F', // Pink
      '#073B4C', // Dark Blue
      '#7209B7', // Purple
    ];
    return colors[userId % colors.length];
  };


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
          {board?.pointers?.map((pointer) => {
            const color = getUserColor(pointer.userId);

            return (
              <Group
                key={`pointer-${pointer.userId}`}
                x={pointer.x}
                y={pointer.y}
              >
                {/* Pointer circle */}
                <Circle
                  radius={20}
                  fill={color}
                  opacity={0.8}
                  stroke='white'
                  strokeWidth={2}
                  shadowColor='black'
                  shadowBlur={5}
                  shadowOpacity={0.3}
                />

                {/* Pointer trail (optional visual effect) */}
                <Circle
                  radius={25}
                  fill={color}
                  opacity={0.3}
                  listening={false}
                />
              </Group>
            );
          })}
        </Layer>
      </Stage>

      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        <div 
          className='relative w-full h-full' 
          style={{ 
            pointerEvents: 'auto',
            transform: `translate(${stagePos.x}px, ${stagePos.y}px) scale(${stageScale})`,
            transformOrigin: '0 0',
          }}
        >
          {board?.elements
            .slice()
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((element) => {
              const renderer = findRenderer(element);
              if (!renderer) {
                console.warn(`No renderer found for element: ${element.id}`);
                return null;
              }

              return (
                <Fragment key={element.id}>
                  {renderer.render({
                    element,
                    isSelected: false,
                    onUpdate: (updatedElement) => {
                      updateElement(updatedElement);
                    },
                    onDelete: (elementId) => {
                      removeElement(elementId);
                    },
                  })}
                </Fragment>
              );
            })}
        </div>
      </div>
    </div>
  );
};
