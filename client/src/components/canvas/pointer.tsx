import { generateColoredCursorSVG, getUserColor } from '@/lib/color-utils';
import { BoardPointer } from '@/shared/interfaces/board/board-pointer.interface';
import { User } from '@/shared/interfaces/user.interface';
import Konva from 'konva';
import { Group, Image } from 'react-konva';
import useImage from 'use-image';

interface PointerProps {
  user: User;
  pointer: BoardPointer;
}

export const Pointer = ({ pointer, user }: PointerProps) => {
  const color = getUserColor(user.id);

  const [image] = useImage(user.avatar ?? '');
  const [cursor] = useImage(
    generateColoredCursorSVG(color, user.id),
    'anonymous'
  );

  return (
    <>
      <Group key={`pointer-${pointer.userId}`} x={pointer.x} y={pointer.y}>
        {image ? (
          <>
            <Image
              stroke={color}
              strokeWidth={5}
              cornerRadius={200}
              height={30}
              width={30}
              offset={{ x: -15, y: -15 }}
              image={image}
            />
            <Image
              offset={{ x: 10, y: 10 }}
              height={30}
              width={30}
              image={cursor}
              filters={[Konva.Filters.RGBA]}
              red={parseInt(color.slice(1, 3), 16) / 255}
              green={parseInt(color.slice(3, 5), 16) / 255}
              blue={parseInt(color.slice(5, 7), 16) / 255}
              alpha={1}
              cached={true}
            />
          </>
        ) : (
          <Image
            offset={{ x: 10, y: 10 }}
            height={30}
            width={30}
            image={cursor}
            filters={[Konva.Filters.RGBA]}
            red={parseInt(color.slice(1, 3), 16) / 255}
            green={parseInt(color.slice(3, 5), 16) / 255}
            blue={parseInt(color.slice(5, 7), 16) / 255}
            alpha={1}
            cached={true}
          />
        )}
      </Group>
    </>
  );
};
