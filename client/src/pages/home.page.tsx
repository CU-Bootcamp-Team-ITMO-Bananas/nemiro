import { Canvas } from '@/modules/canvas.module';
import { Header } from '@/modules/header.module';
import { Toolbar } from '@/modules/toolbar.module';
import { createBoard, getBoards } from '@/shared/api/boards.api';
import { HubContextProvider } from '@/shared/context/hub.context';
import { useAuthStore } from '@/shared/stores/auth.store';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const HomePage = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [boardId, setBoardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const pathSegments = location.pathname.split('/');
  const urlBoardId = pathSegments[pathSegments.length - 1];

  useEffect(() => {
    const initializeBoard = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        if (urlBoardId && urlBoardId !== '') {
          setBoardId(urlBoardId);
        } else {
          const oldBoards = await getBoards();
          if (oldBoards != null && oldBoards.length > 0) {
            navigate(`/${oldBoards[0]}`, { replace: true });
          }

          const newBoard = await createBoard();
          if (newBoard != null) {
            navigate(`/${newBoard}`, { replace: true });
          }
        }
      } catch (error) {
        console.error('Error initializing board:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeBoard();
  }, [user, urlBoardId, navigate]);

  if (!user || isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-lg'>Loading board...</div>
      </div>
    );
  }

  return (
    <HubContextProvider boardId={boardId || urlBoardId} userId={user.id}>
      <Header />
      <Canvas />
      <Toolbar />
    </HubContextProvider>
  );
};
