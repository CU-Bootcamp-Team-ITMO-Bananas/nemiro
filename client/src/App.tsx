import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { HomePage } from './pages/home.page';
import { anonymousUser, useAuthStore } from './shared/stores/auth.store';
import { useEffect } from 'react';

function App() {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    if (user == null) setUser(anonymousUser());
  }, [setUser, user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route index path='/:boardId?' element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
