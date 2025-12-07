import { Pointer } from '@/components/canvas/pointer';
import { useHub } from '@/shared/context/hub.context';
import { useStageZoomPan } from '@/shared/hooks/useStageZoomPan';
import { Board } from '@/shared/interfaces/board/board.interface';
import { PointerUpdateEvent } from '@/shared/interfaces/events/pointer-update-event.interface';
import { User } from '@/shared/interfaces/user.interface';
import { useBoardStore } from '@/shared/stores/board.store';
import { findRenderer } from '@/shared/renderers/element-renderer.registry';
import { useCallback, useEffect, useRef, Fragment, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { BoardElement } from '@/shared/interfaces/board/board-element.interface';
import { ElementEvent } from '@/shared/interfaces/events/element-update-event.interface';
import { useAuthStore } from '@/shared/stores/auth.store';
import Konva from 'konva';

export const Canvas = () => {
  const { user: localUser } = useAuthStore();
  const { board, updateBoard, updateElement, removeElement } = useBoardStore();
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
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

  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const checkSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', checkSize);

    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedElementId]);

  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.target === e.target.getStage()) {
        setSelectedElementId(null);
      }
    },
    []
  );

  const onUpdateElement = (element: BoardElement) => {
    emit<ElementEvent>('UpdateElement', element);
    updateElement(element);
  };

  const onDeleteElement = (element: BoardElement) => {
    emit<ElementEvent>('DeleteElement', element);
    removeElement(element.id);
  };

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      const { clientX, clientY } = event;

      const stage = stageRef.current;
      if (stage) {
        const container = stage.container();
        const rect = container.getBoundingClientRect();

        const containerX = clientX - rect.left;
        const containerY = clientY - rect.top;

        const stageX = (containerX - stage.x()) / stage.scaleX();
        const stageY = (containerY - stage.y()) / stage.scaleY();

        emit<PointerUpdateEvent>('UpdatePointer', {
          x: stageX,
          y: stageY,
        });
      } else {
        emit<PointerUpdateEvent>('UpdatePointer', { x: clientX, y: clientY });
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

  const selectedElement = board?.elements.find(
    (el) => el.id === selectedElementId
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA')
      ) {
        return;
      }

      // Backspace - удаляет выбранный элемент
      if (e.key === 'Backspace' && selectedElement) {
        e.preventDefault();
        e.stopPropagation();
        onDeleteElement(selectedElement);
        setSelectedElementId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedElementId, removeElement]);

  const getUserById = (userId: number): User | null => {
    return board?.users.find((u) => u.id == userId) ?? null;
  };

  const selectedElementRenderer = selectedElement
    ? findRenderer(selectedElement)
    : null;

  return (
    <div
      onMouseMove={handleMouseMove}
      className='relative w-full h-screen'
      style={{ touchAction: 'none' }}
    >
      {selectedElement &&
        selectedElementRenderer?.renderConfigPanel &&
        board &&
        selectedElementRenderer.renderConfigPanel({
          element: selectedElement,
          board,
          onUpdate: (updatedElement) => {
            onUpdateElement(updatedElement);
          },
        })}

      <Stage
        ref={stageRef}
        width={size.width}
        height={size.height}
        draggable
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleStageClick}
        x={stagePos.x}
        y={stagePos.y}
        scaleX={stageScale}
        scaleY={stageScale}
      >
        <Layer>
          {board?.elements.slice().map((element) => {
            const renderer = findRenderer(element);
            if (!renderer) {
              console.warn(`No renderer found for element: ${element.id}`);
              return null;
            }

            return (
              <Fragment key={element.id}>
                {renderer.render({
                  element,
                  isSelected: selectedElementId === element.id,
                  onSelect: () => {
                    onUpdateElement(element);
                    setSelectedElementId(element.id);
                  },
                  onUpdate: (updatedElement) => {
                    onUpdateElement(updatedElement);
                  },
                  onDelete: (element) => {
                    onDeleteElement(element);
                  },
                })}
              </Fragment>
            );
          })}
        </Layer>
        <Layer>
          {board?.pointers?.map((pointer) => {
            const user = getUserById(pointer.userId);
            if (user && user.id != localUser!.id) {
              return (
                <Fragment key={`user_pointer_${pointer.userId}`}>
                  <Pointer
                    key={`user_pointer_${pointer.userId}`}
                    user={user}
                    pointer={pointer}
                  />
                </Fragment>
              );
            }
          })}
        </Layer>
      </Stage>
    </div>
  );
};
