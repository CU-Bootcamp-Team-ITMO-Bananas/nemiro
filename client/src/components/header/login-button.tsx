import { BOT_USERNAME } from '@/shared/constants';
import { useAuthStore } from '@/shared/stores/auth.store';
import { LoginButton, TelegramAuthData } from '@telegram-auth/react';

export const Login = () => {
  const { login, isLoggedIn } = useAuthStore();

  const onAuthCallback = (data: TelegramAuthData) => {
    // const user = await loginUser({
    //   id: data.id,
    //   first_name: data.first_name,
    //   username: data.username,
    //   photo_url: data.photo_url,
    //   last_name: data.last_name,
    //   auth_date: data.auth_date,
    //   hash: data.hash,
    // });

    login({
      id: Math.random() * 10000,
      username: data.username ?? data.first_name,
      avatar: data.photo_url ?? null,
      telegram: data.id,
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
