interface AvatarProps {
 uri: string;
}

export const Avatar = ({ uri }: AvatarProps) => {
 return (
  <div className='h-10 w-10 rounded-full overflow-hidden border-primary'>
   <img src={uri} />
  </div>
 );
};
