import { useState } from 'react';
import logo from '../../assets/logo.svg';
import { Badge } from '../ui/badge';
import { AvailableBoards } from '@/modules/available-boards.module';

export const AvailableBoardsButton = () => {
  const [isOpen, setIsOpen] = useState(false);
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
          Доступные доски
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
