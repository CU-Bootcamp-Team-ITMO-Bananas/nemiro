import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { HomePage } from './pages/home.page';
import { anonymousUser, useAuthStore } from './shared/stores/auth.store';
import { useEffect } from 'react';
import { loginUser } from './shared/api/auth.api';

function App() {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const initializeUser = async () => {
      console.log(user);
      if (user == null) {
        const anonymous = anonymousUser();
        const newUser = await loginUser({
          id: Number.parseInt(anonymous.id),
          first_name: anonymous.username!,
          last_name: anonymous.username!,
          username: anonymous.username!,
          auth_date: 0,
          hash: '',
        });
        console.log(newUser);
        if (newUser != null) {
          setUser(newUser);
        }
      }
    };

    initializeUser();
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
