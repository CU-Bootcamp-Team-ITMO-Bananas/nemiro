import { useLocation } from 'react-router-dom';

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
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          fill='currentColor'
          viewBox='0 0 16 16'
        >
          <path d='M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3' />
        </svg>
      </button>

      {isOpen && (
        <div
          className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]'
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
                className='p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors'
                aria-label='Закрыть'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  fill='currentColor'
                  viewBox='0 0 16 16'
                >
                  <path d='M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z' />
                </svg>
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
