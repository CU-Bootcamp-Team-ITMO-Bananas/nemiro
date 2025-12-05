import { BOT_USERNAME } from '@/shared/constants';
import { useAuthStore } from '@/shared/stores/auth.store';
import { LoginButton } from '@telegram-auth/react';
import { Logo } from './logo';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Spinner } from './ui/spinner';

export const Toolbar = () => {
  const { login, isLoggedIn, user } = useAuthStore();

  return (
    <div className='pt-4 px-4 flex justify-between'>
      <Logo />
      <div className='flex items-center gap-5'>
        <Spinner />
        <div>
          {isLoggedIn && user ? (
            <div className='*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale'>
              <Avatar>
                <AvatarImage
                  src='https://github.com/shadcn.png'
                  alt='@shadcn'
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage
                  src='https://github.com/maxleiter.png'
                  alt='@maxleiter'
                />
                <AvatarFallback>LR</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage
                  src='https://github.com/evilrabbit.png'
                  alt='@evilrabbit'
                />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
            </div>
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
