import { useLocation } from 'react-router-dom';
import { Icons } from '../ui/icons';

interface ShareButtonProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const ShareButton = ({ isOpen, setIsOpen }: ShareButtonProps) => {
  const location = useLocation();
  const currentUrl = `${window.location.origin}${location.pathname}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setIsOpen(false);
      // Можно добавить уведомление об успешном копировании
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors'
        aria-label='Поделиться'
      >
        <Icons.Share />
      </button>

      {isOpen && (
        <div
          className='fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[1000]'
          onClick={() => setIsOpen(false)}
        >
          <div
            className='bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-[90%] shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex justify-between items-center mb-5'>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                Поделиться доской
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className='p-1 bg-white'
                aria-label='Закрыть'
              >
                <Icons.Close />
              </button>
            </div>
            <div className='mt-4'>
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={currentUrl}
                  readOnly
                  className='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400'
                />
                <button
                  onClick={copyToClipboard}
                  className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap'
                >
                  Копировать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
