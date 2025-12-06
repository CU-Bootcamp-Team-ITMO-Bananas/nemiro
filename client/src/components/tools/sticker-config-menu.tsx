import { StickerElement } from '@/shared/interfaces/board/tools/sticker-element.interface';
import { Board } from '@/shared/interfaces/board/board.interface';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

// Цвета стикеров (как в Miro)
export const STICKER_COLORS = [
  '#FFD93D', // Желтый
  '#6BCF7F', // Зеленый
  '#4D96FF', // Синий
  '#9B51E0', // Фиолетовый
  '#F2994A', // Оранжевый
  '#EB5757', // Красный
  '#2F80ED', // Темно-синий
  '#56CCF2', // Голубой
];

interface StickerConfigMenuProps {
  element: StickerElement;
  board: Board;
  onUpdate?: (element: StickerElement) => void;
}

export const StickerConfigMenu = ({
  element,
  board,
  onUpdate,
}: StickerConfigMenuProps) => {
  const colorIndex = element.color || 0;

  const handleColorChange = (newColorIndex: number) => {
    if (onUpdate) {
      onUpdate({
        id: element.id,
        x: element.x,
        y: element.y,
        scale: element.scale,
        rotation: element.rotation,
        zIndex: element.zIndex,
        color: newColorIndex,
        content: {
          text: element.content?.text ?? '',
          width: element.content?.width,
          height: element.content?.height,
        },
      });
    }
  };

  const handleZIndexChange = (direction: 'up' | 'down') => {
    if (!onUpdate) return;

    const sortedElements = [...board.elements].sort((a, b) => a.zIndex - b.zIndex);
    const currentIndex = sortedElements.findIndex((el) => el.id === element.id);

    if (currentIndex === -1) return;

    if (direction === 'up') {
      // Перемещаем вперед (увеличиваем zIndex)
      if (currentIndex < sortedElements.length - 1) {
        const nextElement = sortedElements[currentIndex + 1];
        const newZIndex = nextElement.zIndex + 1;
        onUpdate({
          id: element.id,
          x: element.x,
          y: element.y,
          scale: element.scale,
          rotation: element.rotation,
          zIndex: newZIndex,
          color: element.color,
          content: {
            text: element.content?.text ?? '',
            width: element.content?.width,
            height: element.content?.height,
          },
        });
      }
    } else {
      // Перемещаем назад (уменьшаем zIndex)
      if (currentIndex > 0) {
        const prevElement = sortedElements[currentIndex - 1];
        const newZIndex = Math.max(0, prevElement.zIndex - 1);
        onUpdate({
          id: element.id,
          x: element.x,
          y: element.y,
          scale: element.scale,
          rotation: element.rotation,
          zIndex: newZIndex,
          color: element.color,
          content: {
            text: element.content?.text ?? '',
            width: element.content?.width,
            height: element.content?.height,
          },
        });
      }
    }
  };

  return (
    <div
      className='fixed left-0 top-1/2 -translate-y-1/2 bg-gray-100 shadow-lg border-r rounded-r-lg p-4 pointer-events-auto'
      style={{
        width: '200px',
        zIndex: 10000, // Очень высокий z-index, чтобы меню было поверх всех элементов
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className='space-y-4'>
        {/* Секция изменения порядка */}
        <div>
          <h3 className='text-sm font-medium text-gray-700 mb-2'>Порядок</h3>
          <div className='flex gap-2'>
            <button
              onClick={() => handleZIndexChange('down')}
              className='flex-1 flex items-center justify-center p-2 bg-white border border-gray-300 rounded hover:bg-gray-50 active:bg-gray-100 transition-colors'
              title='Переместить назад'
              aria-label='Переместить элемент назад'
            >
              <ChevronDown className='w-4 h-4 text-gray-700' />
            </button>
            <button
              onClick={() => handleZIndexChange('up')}
              className='flex-1 flex items-center justify-center p-2 bg-white border border-gray-300 rounded hover:bg-gray-50 active:bg-gray-100 transition-colors'
              title='Переместить вперед'
              aria-label='Переместить элемент вперед'
            >
              <ChevronUp className='w-4 h-4 text-gray-700' />
            </button>
          </div>
        </div>

        {/* Секция выбора цвета */}
        <div>
          <h3 className='text-sm font-medium text-gray-700 mb-2'>Цвет</h3>
          <div className='grid grid-cols-4 gap-1.5'>
            {STICKER_COLORS.map((color, index) => (
              <button
                key={index}
                onClick={() => handleColorChange(index)}
                className={cn(
                  'w-6 h-6 rounded border-2 transition-all hover:scale-110',
                  colorIndex === index
                    ? 'border-gray-800 ring-2 ring-blue-400'
                    : 'border-gray-300 hover:border-gray-500'
                )}
                style={{
                  backgroundColor: color,
                }}
                title={`Цвет ${index + 1}`}
                aria-label={`Выбрать цвет ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

