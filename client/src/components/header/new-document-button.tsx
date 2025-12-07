import { useNavigate } from 'react-router-dom';
import { Icons } from '../ui/icons';
import { createBoard } from '@/shared/api/boards.api';

export const NewBoardButton = () => {
  const navigate = useNavigate();

  const onButtonClick = async () => {
    const newBoard = await createBoard();
    if (newBoard !== null && newBoard !== '') {
      navigate(`/${newBoard}`, { replace: true });
    }
  };

  return (
    <button
      onClick={onButtonClick}
      className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors'
      aria-label='Поделиться'
    >
      <Icons.NewDocument />
    </button>
  );
};
