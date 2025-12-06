import { useBoardStore } from '@/shared/stores/board.store';
import { StickerElement } from '@/shared/interfaces/board/tools/sticker-element.interface';

interface ToolbarProps {
  isShareModalOpen: boolean;
}

export const Toolbar = ({ isShareModalOpen }: ToolbarProps) => {
  const { addElement, board } = useBoardStore();

  const handleCreateSticker = () => {
    // Создаем новый стикер в центре экрана
    const newSticker: StickerElement = {
      id: `sticker-${Date.now()}`,
      content: {
        text: '',
        width: 200,
        height: 200,
        x: window.innerWidth / 2 - 100, // Центр экрана минус половина ширины стикера
        y: window.innerHeight / 2 - 100, // Центр экрана минус половина высоты стикера
        scale: 1,
        rotation: 0,
        zIndex: board?.elements.length || 0,
        color: 0, // Желтый цвет (первый в массиве)
      },
    };

    addElement(newSticker);
  };

  return (
    <div className='fixed bottom-4 left-1/2 -translate-x-1/2 z-50'>
      <div
        className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-lg transition-all ${
          isShareModalOpen ? 'blur-sm' : ''
        }`}
      >
        <button
          onClick={handleCreateSticker}
          className='w-10 h-10 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors'
          title='Стикер'
          aria-label='Создать стикер'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='text-gray-700'
            style={{ display: 'block', flexShrink: 0 }}
          >
            <path
              fillRule='evenodd'
              d='M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h7c5.523 0 10-4.477 10-10V5a3 3 0 0 0-3-3H5Zm15 7V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1v-.004h4a3 3 0 0 0 3-3V13l1-1h4a3 3 0 0 0 3-3Zm-6.952 10.932A4.977 4.977 0 0 0 14 16.996V14h3a4.977 4.977 0 0 0 2.932-.95 8.004 8.004 0 0 1-6.884 6.882Z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
