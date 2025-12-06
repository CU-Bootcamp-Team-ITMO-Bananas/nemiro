import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { BoardList } from '@/components/available-boards/board-list';
import { getBoards } from '@/shared/api/boards.api';

interface AvailableBoardsProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AvailableBoards : React.FC<AvailableBoardsProps> = ({setIsModalOpen}) => {
    const navigate = useNavigate();
    const [boards, setBoards] = useState<string[]>([]);
  
    const handleBoardSelect = (boardId: string) => {
      setIsModalOpen(false);
      navigate(`/${boardId}`);
    };

    useEffect(() => {
      const fetchBoards = async () => {
        const boards = await getBoards();
        if (boards) {
          setBoards(boards);
        }
      };
      fetchBoards();
    }, []);
    
  
    return <BoardList boards={boards} onBoardSelect={handleBoardSelect} />;
};
