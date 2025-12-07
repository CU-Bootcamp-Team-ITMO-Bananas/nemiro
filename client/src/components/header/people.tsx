import { useBoardStore } from '@/shared/stores/board.store';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuthStore } from '@/shared/stores/auth.store';

export const People = () => {
  const { user } = useAuthStore();
  const { board } = useBoardStore();

  return (
    <div className='*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale'>
      {board?.users.map((u) => (
        <Avatar key={`${u.id}_user_profile_photo`} className={`${u.id == user?.id && 'border-2 border-blue-600'}`}>
          <AvatarImage src={u.avatar ?? ''} alt={u.username ?? ''} />
          <AvatarFallback>{u.username?.toUpperCase()[0]}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
};
