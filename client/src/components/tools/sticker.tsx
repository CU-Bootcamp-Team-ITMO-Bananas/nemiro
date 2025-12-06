import { useState, useRef, useEffect, useCallback } from 'react';
import { StickerElement } from '@/shared/interfaces/board/tools/sticker-element.interface';
import { cn } from '@/lib/utils';
import { STICKER_COLORS } from './sticker-config-menu';

interface StickerProps {
  element: StickerElement;
  onUpdate?: (element: StickerElement) => void;
  onDelete?: (elementId: string) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const Sticker = ({
  element,
  onUpdate,
  isSelected = false,
  onSelect,
}: StickerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState<string>(
    element.content?.text || ''
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const stickerRef = useRef<HTMLDivElement>(null);

  const content = element.content || { text: '' };
  const width = content.width ?? 200;
  const height = content.height ?? 200;
  const colorIndex = element.color ?? 0;
  const backgroundColor = STICKER_COLORS[colorIndex % STICKER_COLORS.length];

  // Автоматическое изменение размера textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  // Синхронизация текста с элементом при изменении
  useEffect(() => {
    if (element.content?.text !== undefined) {
      setText(element.content.text);
    }
  }, [element.content?.text]);

  // Фокус на textarea при начале редактирования
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);


  const handleTextChange = (newText: string) => {
    setText(newText);
    if (onUpdate) {
      onUpdate({
        id: element.id,
        x: element.x,
        y: element.y,
        scale: element.scale,
        rotation: element.rotation,
        zIndex: element.zIndex,
        color: element.color,
        content: {
          text: newText,
          width: content.width,
          height: content.height,
        },
      });
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Убеждаемся, что текст сохранен при выходе из редактирования
    if (onUpdate && text !== element.content?.text) {
      onUpdate({
        id: element.id,
        x: element.x,
        y: element.y,
        scale: element.scale,
        rotation: element.rotation,
        zIndex: element.zIndex,
        color: element.color,
        content: {
          text: text,
          width: content.width,
          height: content.height,
        },
      });
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (onSelect && !isDragging) {
      onSelect();
    }
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Не начинаем drag при клике на textarea
      if ((e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      
      setIsDragging(true);
      
      // Вычисляем смещение мыши относительно элемента в координатах stage
      const parent = stickerRef.current?.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const transform = getComputedStyle(parent).transform;
        let scale = 1;
        let translateX = 0;
        let translateY = 0;

        if (transform && transform !== 'none') {
          const matrix = transform.match(/matrix\(([^)]+)\)/);
          if (matrix) {
            const values = matrix[1].split(',').map(parseFloat);
            scale = values[0] || 1;
            translateX = values[4] || 0;
            translateY = values[5] || 0;
          }
        }

        const relativeX = e.clientX - parentRect.left;
        const relativeY = e.clientY - parentRect.top;
        
        // Координаты мыши в системе координат stage
        const stageMouseX = (relativeX - translateX) / scale;
        const stageMouseY = (relativeY - translateY) / scale;
        
        // Смещение относительно позиции элемента
        setDragStart({
          x: stageMouseX - element.x,
          y: stageMouseY - element.y,
        });
      }
    },
    [element.x, element.y]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!onUpdate || !stickerRef.current) return;

      // Получаем родительский контейнер с transform
      const parent = stickerRef.current.parentElement;
      if (!parent) return;

      const parentRect = parent.getBoundingClientRect();
      
      // Получаем transform матрицу родительского контейнера
      const transform = getComputedStyle(parent).transform;
      let scale = 1;
      let translateX = 0;
      let translateY = 0;

      if (transform && transform !== 'none') {
        const matrix = transform.match(/matrix\(([^)]+)\)/);
        if (matrix) {
          const values = matrix[1].split(',').map(parseFloat);
          scale = values[0] || 1;
          translateX = values[4] || 0;
          translateY = values[5] || 0;
        }
      }

      // Вычисляем новую позицию в координатах stage
      // Координаты мыши относительно родительского контейнера
      const relativeX = e.clientX - parentRect.left;
      const relativeY = e.clientY - parentRect.top;

      // Преобразуем в координаты stage (учитывая transform родителя)
      const newX = (relativeX - translateX) / scale - dragStart.x;
      const newY = (relativeY - translateY) / scale - dragStart.y;

      onUpdate({
        id: element.id,
        x: Math.max(0, newX),
        y: Math.max(0, newY),
        scale: element.scale,
        rotation: element.rotation,
        zIndex: element.zIndex,
        color: element.color,
        content: {
          text: element.content?.text ?? '',
          width: element.content?.width,
          height: element.content?.height,
        },
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, element, onUpdate]);


  return (
    <div
        ref={stickerRef}
        className={cn(
          'absolute select-none',
          isDragging ? 'cursor-grabbing' : 'cursor-move'
        )}
        style={{
          left: `${element.x}px`,
          top: `${element.y}px`,
          transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
          zIndex: element.zIndex,
          width: `${width}px`,
          height: `${height}px`,
          userSelect: 'none',
        }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        <div
          className={cn(
            'relative w-full h-full rounded-lg shadow-md transition-shadow hover:shadow-lg',
            isSelected && 'ring-2 ring-blue-500'
          )}
          style={{
            backgroundColor,
          }}
        >
          <div className='w-full h-full flex items-center justify-center text-center p-3'>
            {isEditing ? (
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleBlur();
                  }
                  if (e.key === 'Escape') {
                    handleBlur();
                  }
                }}
                className='w-full h-full bg-transparent border-none outline-none resize-none text-gray-900 font-medium text-sm leading-tight text-center'
                style={{
                  minHeight: '60px',
                }}
                placeholder='Введите текст...'
              />
            ) : (
              <div
                className='text-gray-900 font-medium text-sm leading-tight whitespace-pre-wrap break-words'
              >
                {text || (
                  <span className='text-gray-500 italic'>Дважды кликните для редактирования</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

