import { useState, useRef, useEffect, useCallback } from 'react';
import { Group, Rect, Text } from 'react-konva';
import Konva from 'konva';
import { StickerElement } from '@/shared/interfaces/board/tools/sticker-element.interface';
import { STICKER_COLORS } from './sticker-config-menu';

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
  const [text, setText] = useState<string>(element.content?.text || '');
  const [tempText, setTempText] = useState<string>(element.content?.text || '');

  const groupRef = useRef<Konva.Group>(null);
  const textNodeRef = useRef<Konva.Text>(null);

  const content = element.content || { text: '' };
  const width = content.width ?? 200;
  const height = content.height ?? 200;
  const colorIndex = element.content.color ?? 0;
  const backgroundColor = STICKER_COLORS[colorIndex % STICKER_COLORS.length];
  const fontSize = Math.max(14, 14 / stageScale);

  // Синхронизация текста с элементом
  useEffect(() => {
    if (element.content?.text !== undefined) {
      setText(element.content.text);
      setTempText(element.content.text);
    }
  }, [element.content?.text]);

  // Автоматический размер текста
  useEffect(() => {
    if (textNodeRef.current && !isEditing) {
      textNodeRef.current.width(width - 24); // Отступы по 12px с каждой стороны
    }
  }, [width, isEditing, text]);

  const handleTextChange = useCallback(
    (newText: string) => {
      if (onUpdate) {
        onUpdate({
          id: element.id,
          content: {
            ...content,
            text: newText,
          },
        });
      }
    },
    [onUpdate, element.id, content]
  );

  const handleDrag = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      if (!onUpdate) return;

      const node = e.target;
      onUpdate({
        id: element.id,
        content: {
          ...content,
          x: node.x(),
          y: node.y(),
        },
      });
    },
    [onUpdate, element.id, content]
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

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (tempText !== text) {
      handleTextChange(tempText);
    }
  }, [tempText, text, handleTextChange]);

  // Обработка нажатий клавиш в режиме редактирования
  useEffect(() => {
    if (!isEditing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setTempText(text);
        setIsEditing(false);
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleBlur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, text, handleBlur]);

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
        draggable
        onClick={handleClick}
        onDblClick={handleDblClick}
        onDragMove={handleDrag}
      >
        {/* Фон стикера */}
        <Rect
          width={width}
          height={height}
          fill={backgroundColor}
          cornerRadius={8}
          shadowColor='rgba(0, 0, 0, 0.1)'
          shadowBlur={5}
          shadowOffset={{ x: 0, y: 2 }}
          shadowOpacity={0.8}
          stroke={isSelected ? '#3b82f6' : undefined}
          strokeWidth={isSelected ? 2 : 0}
        />

        {/* Текст стикера */}
        {isEditing ? (
          // Поле ввода для редактирования
          <Rect
            width={width - 24}
            height={height - 24}
            x={12}
            y={12}
            fill='transparent'
          />
        ) : (
          <Text
            ref={textNodeRef}
            x={12}
            y={12}
            width={width - 24}
            height={height - 24}
            text={text || 'Дважды кликните для редактирования'}
            fill={text ? '#1f2937' : '#6b7280'}
            fontSize={fontSize}
            fontStyle={!text ? 'italic' : 'normal'}
            fontFamily='Inter, system-ui, sans-serif'
            fontWeight='500'
            align='center'
            verticalAlign='middle'
            wrap='word'
            lineHeight={1.4}
            padding={8}
          />
        )}
      </Group>

      {/* Скрытый textarea для редактирования текста */}
      {isEditing && (
        <textarea
          value={tempText}
          onChange={(e) => setTempText(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          style={{
            position: 'absolute',
            left: `${content.x * stageScale + 12 * stageScale}px`,
            top: `${content.y * stageScale + 12 * stageScale}px`,
            width: `${(width - 24) * stageScale}px`,
            height: `${(height - 24) * stageScale}px`,
            fontSize: `${fontSize * stageScale}px`,
            lineHeight: 1.4,
            padding: `${8 * stageScale}px`,
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 500,
            textAlign: 'center',
            backgroundColor: 'transparent',
            border: '1px solid #3b82f6',
            borderRadius: '4px',
            outline: 'none',
            resize: 'none',
            zIndex: 9999,
            transformOrigin: 'top left',
            transform: `scale(${1 / stageScale})`,
          }}
        />
      )}
    </>
  );
};
