import Konva from 'konva';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Group, Text } from 'react-konva';
import { StickerElement } from '@/shared/interfaces/board/tools/sticker-element.interface';
import { TextEditor } from './text-editor';

interface StickerProps {
  element: StickerElement;
  onUpdate?: (element: StickerElement) => void;
  onDelete?: (element: StickerElement) => void;
  isSelected?: boolean;
  onSelect?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  stageScale?: number;
}

export const Sticker = ({
  element,
  onUpdate,
  isSelected = false,
  onSelect,
  stageScale = 1,
}: StickerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const groupRef = useRef<Konva.Group>(null);
  const textNodeRef = useRef<Konva.Text>(null);

  const content = element.content || { text: '' };
  const width = content.width ?? 200;
  const height = content.height ?? 200;
  const fontSize = Math.max(14, 14 / stageScale);
  const text = content.text || '';

  const handleTextChange = useCallback(
    (newText: string) => {
      if (onUpdate) {
        onUpdate({
          ...element,
          content: {
            ...content,
            text: newText,
          },
        });
      }
    },
    [onUpdate, element, content]
  );

  const handleDrag = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      if (!onUpdate) return;

      const node = e.target;
      onUpdate({
        ...element,
        content: {
          ...content,
          x: node.x(),
          y: node.y(),
        },
      });
    },
    [onUpdate, element, content]
  );

  const handleClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      e.cancelBubble = true;

      if (onSelect) {
        onSelect(e);
      }
    },
    [onSelect]
  );

  const handleDblClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      e.cancelBubble = true;
      setIsEditing(true);
    },
    []
  );

  const handleCloseEditor = useCallback(() => {
    setIsEditing(false);
  }, []);

  useEffect(() => {
    if (isSelected == false) setIsEditing(false);
  }, [isSelected]);

  return (
    <>
      <Group
        ref={groupRef}
        x={content.x}
        y={content.y}
        width={width}
        height={height}
        rotation={content.rotation || 0}
        scaleX={content.scale || 1}
        scaleY={content.scale || 1}
        draggable={!isEditing}
        onClick={handleClick}
        onDblClick={handleDblClick}
        onDragMove={handleDrag}
      >
        {/* Текст стикера */}
        <Text
          ref={textNodeRef}
          x={12}
          y={12}
          width={width - 24}
          height={height - 24}
          text={
            isEditing || text != ''
              ? text
              : 'Кликните дважды для редактирования'
          }
          fill={text ? '#1f2937' : '#6b7280'}
          fontSize={fontSize}
          fontStyle={!text ? 'italic' : 'normal'}
          fontFamily='Inter, system-ui, sans-serif'
          fontWeight='500'
          align='center'
          wrap='word'
          lineHeight={1.4}
          padding={8}
          visible={!isEditing}
        />
      </Group>

      {/* Text Editor для редактирования */}
      {isEditing && textNodeRef.current && (
        <TextEditor
          textNode={textNodeRef.current}
          onChange={handleTextChange}
          onClose={handleCloseEditor}
          stageScale={stageScale}
        />
      )}
    </>
  );
};
