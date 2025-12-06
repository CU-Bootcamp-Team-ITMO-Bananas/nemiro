import { useState } from 'react';
import { Badge } from '../ui/badge';
import { AvailableBoards } from '@/modules/available-boards.module';
import { createBoard } from '@/shared/api/boards.api';
import { useNavigate } from 'react-router-dom';

export const AvailableBoardsButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleBoardCreationClick = async () => {
    setIsOpen(false)
    try {
      const board = await createBoard();
      if (board) {
        navigate(`/${board}`, { replace: true });
      }
    } catch (error) {
      console.error('Error initializing board:', error);
    }
  }

  return (
    <>
    <button 
      className="board-modal-trigger"
      onClick={() => setIsOpen(true)}
      aria-label="Открыть список досок"
    >
      <div className='flex flex-row items-center gap-2 w-fit pr-4 cursor-pointer'>
        <Badge
          variant='secondary'
          className='bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600'
        >
          Доски
        </Badge>
      </div>
    </button>
    { isOpen && (
      <div className="modal-overlay" onClick={() => setIsOpen(false)}>
        <div 
          className="modal-content" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Выберите доску</h2>
            <button 
              className="modal-close"
              onClick={handleBoardCreationClick}
              aria-label="Создать доску"
            >
              <Badge
                variant='secondary'
                className='bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600'
              >Новая доска</Badge>
            </button>
            <button 
              className="modal-close"
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
          <AvailableBoards setIsModalOpen={setIsOpen}/>
        </div>
      </div>
    )}
    </>
    
  );
};
