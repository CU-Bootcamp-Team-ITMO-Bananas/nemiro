import logo from '../../assets/logo.svg';
import { Badge } from '../ui/badge';

export const Logo = () => {
  return (
    <div className='flex flex-row items-center gap-2 w-fit pr-4 cursor-pointer'>
      <img className='h-8 w-8' src={logo} />
      <h2 className='text-2xl font-semibold mb-1'>nemiro</h2>

      <Badge
        variant='secondary'
        className='bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600'
      >
        Beta
      </Badge>
    </div>
  );
};
