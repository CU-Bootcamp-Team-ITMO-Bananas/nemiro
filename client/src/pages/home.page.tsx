import { useState, useEffect } from 'react';
import { Canvas } from '@/modules/canvas.module';
import { Header } from '@/modules/header.module';
import { Toolbar } from '@/modules/toolbar.module';
import { createBoard, getBoards } from '@/shared/api/boards.api';
import { HubContextProvider } from '@/shared/context/hub.context';
import { useAuthStore } from '@/shared/stores/auth.store';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoadingSpinner } from '@/components/header/loading-spinner';

export const HomePage = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [boardId, setBoardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const urlBoardId = pathSegments[pathSegments.length - 1];

    const initializeBoard = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      if (urlBoardId && urlBoardId !== '') {
        setBoardId(urlBoardId);
        setIsLoading(false);
        return;
      } else {
        const oldBoards = await getBoards();
        if (oldBoards != null && oldBoards.length > 0) {
          navigate(`/${oldBoards[0].id}`, { replace: true });
          setIsLoading(false);
          return;
        }

        const newBoard = await createBoard();
        if (newBoard !== null && newBoard !== '') {
          navigate(`/${newBoard}`, { replace: true });
          setIsLoading(false);
          return;
        }
      }
    };

    initializeBoard();
  }, [user, location, navigate]);

  if (!user || isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='pr-3'>Загружаем доску...</p>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <HubContextProvider key={boardId} boardId={boardId!} userId={user.id}>
      <Header
        isShareModalOpen={isShareModalOpen}
        setIsShareModalOpen={setIsShareModalOpen}
      />
      <Canvas />
      <Toolbar isShareModalOpen={isShareModalOpen} />
    </HubContextProvider>
  );
};
