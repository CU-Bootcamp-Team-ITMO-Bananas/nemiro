import { useAuthStore } from '@/shared/stores/auth.store';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Login } from '@/components/header/login-button';
import { Logo } from '@/components/header/logo';
import { LoadingSpinner } from '@/components/header/loading-spinner';

export const Header = () => {
  const { user, login, isLoggedIn } = useAuthStore();

  return (
    <div className='absolute top-4 left-4 right-4 flex justify-between z-30'>
      <Logo />
      <div className='flex items-center gap-5'>
        <LoadingSpinner />
        <div className='*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale'>
          {/* <Avatar>
            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src='https://github.com/maxleiter.png'
              alt='@maxleiter'
            />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar> */}
          <Avatar>
            <AvatarImage src={user?.avatar ?? ''} alt={user?.username ?? ''} />
            <AvatarFallback>{user?.username?.toUpperCase()[0]}</AvatarFallback>
          </Avatar>
        </div>
        <Login />
      </div>
    </div>
  );
};
