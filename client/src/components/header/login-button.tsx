import { loginUser } from '@/shared/api/auth.api';
import { BOT_USERNAME } from '@/shared/constants';
import { useAuthStore } from '@/shared/stores/auth.store';
import { LoginButton, TelegramAuthData } from '@telegram-auth/react';

export const Login = () => {
  const { login, isLoggedIn } = useAuthStore();

  const onAuthCallback = async (data: TelegramAuthData) => {
    const user = await loginUser({
      id: data.id,
      first_name: data.first_name,
      username: data.username,
      photo_url: data.photo_url,
      last_name: data.last_name,
      auth_date: data.auth_date,
      hash: data.hash,
    });

    if (user == null) return;

    login({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      telegram: user.telegram,
    });
  };

  return (
    !isLoggedIn && (
      <LoginButton
        buttonSize='medium'
        botUsername={BOT_USERNAME}
        onAuthCallback={onAuthCallback}
      />
    )
  );
};
