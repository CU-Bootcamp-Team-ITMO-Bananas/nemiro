import { useAuthStore } from '@/shared/stores/auth.store';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Login } from '@/components/header/login-button';
import { Logo } from '@/components/header/logo';
import { LoadingSpinner } from '@/components/header/loading-spinner';
import { ShareButton } from '@/components/header/share-button';
import { People } from '@/components/header/people';
import { AvailableBoardsButton } from '@/components/header/available-boards-button';

interface HeaderProps {
  isShareModalOpen: boolean;
  setIsShareModalOpen: (isOpen: boolean) => void;
}

export const Header = ({
  isShareModalOpen,
  setIsShareModalOpen,
}: HeaderProps) => {
  const { user, isLoggedIn } = useAuthStore();

  return (
    <div className='absolute top-4 left-4 right-4 flex justify-between z-30'>
      <Logo />
      {/* <AvailableBoardsButton /> */}
      <div className='flex items-center gap-5'>
        <div className='*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale'>
          <People />
          <Avatar>
            <AvatarImage src={user?.avatar ?? ''} alt={user?.username ?? ''} />
            <AvatarFallback>{user?.username?.toUpperCase()[0]}</AvatarFallback>
          </Avatar>
        </div>
        {!isLoggedIn && <Login />}
        <ShareButton
          isOpen={isShareModalOpen}
          setIsOpen={setIsShareModalOpen}
        />
      </div>
    </div>
  );
};
