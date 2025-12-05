import logo from '../assets/logo.svg';

export const Logo = () => {
  return (
    <div className='flex flex-row items-center gap-2 w-fit pr-4 cursor-pointer'>
      <img className='h-8 w-8' src={logo} />
      <h2 className='text-2xl font-semibold mb-1'>nemiro</h2>
    </div>
  );
};
