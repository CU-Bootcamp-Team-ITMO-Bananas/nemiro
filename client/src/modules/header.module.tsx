import { useAuthStore } from '@/shared/stores/auth.store';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Login } from '@/components/header/login-button';
import { Logo } from '@/components/header/logo';
import { ShareButton } from '@/components/header/share-button';
import { People } from '@/components/header/people';
import { NewBoardButton } from '@/components/header/new-document-button';

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
        {!isLoggedIn && <Login />}
        <People />
        <ShareButton
          isOpen={isShareModalOpen}
          setIsOpen={setIsShareModalOpen}
        />
        <NewBoardButton />
      </div>
    </div>
  );
};
