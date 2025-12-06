import { useBoardStore } from '@/shared/stores/board.store';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';

export const People = () => {
  const { board } = useBoardStore();

  return (
    <>
      {board?.users.forEach((u) => (
        <Avatar>
          <AvatarImage src={u.avatar ?? ''} alt={u.username ?? ''} />
        </Avatar>
      ))}
    </>
  );
};
