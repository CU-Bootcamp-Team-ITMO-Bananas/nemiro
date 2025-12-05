import { BOT_USERNAME } from '@/shared/constants';
import { useAuthStore } from '@/shared/stores/auth.store';
import { LoginButton } from '@telegram-auth/react';
import { Avatar } from './avatar';
import { Logo } from './logo';

export const Toolbar = () => {
  const { login, isLoggedIn, user } = useAuthStore();

  return (
    <div className='pt-4 px-4 flex justify-between'>
      <Logo />
      <div className='flex items-center'>
        <div className='bg-white'>
          {isLoggedIn && user ? (
            <Avatar uri={user.avatar ?? ''} />
          ) : (
            <LoginButton
              buttonSize='large'
              botUsername={BOT_USERNAME}
              onAuthCallback={(data) => {
                login({
                  id: data.id.toString(),
                  telegram: data.id,
                  first_name: data.first_name,
                  username: data.username ?? null,
                  avatar: data.photo_url ?? null,
                  last_name: data.last_name ?? null,
                });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
