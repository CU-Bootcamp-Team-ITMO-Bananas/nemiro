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
      x: window.innerWidth / 2 - 100, // Центр экрана минус половина ширины стикера
      y: window.innerHeight / 2 - 100, // Центр экрана минус половина высоты стикера
      scale: 1,
      rotation: 0,
      zIndex: board?.elements.length || 0,
      color: 0, // Желтый цвет (первый в массиве)
      content: {
        text: '',
        width: 200,
        height: 200,
      },
    };

    addElement(newSticker);
  };

  return (
    <div className='fixed bottom-4 left-1/2 -translate-x-1/2 z-50'>
      <div className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-lg transition-all ${isShareModalOpen ? 'blur-sm' : ''}`}>
        <button
          onClick={handleCreateSticker}
          className='w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 active:bg-gray-100 transition-colors'
          title='Стикер'
          aria-label='Создать стикер'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='#374151'
          >
            <path
              fillRule='evenodd'
              d='M4 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4Zm1 2h10v12H5V4Zm2 2v1h6V6H7Zm0 2v1h6V8H7Zm0 2v1h4v-1H7Z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
