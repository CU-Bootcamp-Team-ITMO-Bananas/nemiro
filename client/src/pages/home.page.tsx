import { Canvas } from '@/modules/canvas.module';
import { Header } from '@/modules/header.module';
import { Toolbar } from '@/components/toolbar';
import { HubContextProvider } from '@/shared/context/hub.context';
import { useAuthStore } from '@/shared/stores/auth.store';
import { useLocation } from 'react-router-dom';

export const HomePage = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  const pathSegments = location.pathname.split('/');
  const urlBoardId = pathSegments[pathSegments.length - 1];

  return (
    user && (
      <HubContextProvider boardId={urlBoardId} userId={user.id}>
        <Header />
        <Canvas />
        <Toolbar />
      </HubContextProvider>
    )
  );
};
