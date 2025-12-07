import { useBoardStore } from '@/shared/stores/board.store';
import { StickerElement } from '@/shared/interfaces/board/tools/sticker-element.interface';
import { Icons } from '@/components/ui/icons';
import { ImageElement } from '@/shared/interfaces/board/tools/image-element.interface';
import { useState, useRef } from 'react';
import { uploadFile } from '@/shared/api/files.api';
import { Spinner } from '@/components/ui/spinner';

interface ToolbarProps {
  isShareModalOpen: boolean;
}

export const Toolbar = ({ isShareModalOpen }: ToolbarProps) => {
  const { addElement, board } = useBoardStore();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateSticker = () => {
    const newSticker: StickerElement = {
      id: `sticker-${Date.now()}`,
      content: {
        text: '',
        width: 200,
        height: 200,
        x: window.innerWidth / 2 - 100,
        y: window.innerHeight / 2 - 100,
        scale: 1,
        rotation: 0,
        zIndex: board?.elements.length || 0,
        color: 0,
      },
    };

    addElement(newSticker);
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setIsUploading(true);

    try {
      // Upload file to server
      const uploadResult = await uploadFile(file);

      if (uploadResult?.data.url) {
        // Get image dimensions
        const img = new Image();
        img.onload = () => {
          const originalWidth = img.width;
          const originalHeight = img.height;

          // Calculate 80% of viewport dimensions
          const maxWidth = window.innerWidth * 0.8;
          const maxHeight = window.innerHeight * 0.8;

          // Calculate scaling factor to fit within 80% of viewport
          const widthRatio = maxWidth / originalWidth;
          const heightRatio = maxHeight / originalHeight;
          const scale = Math.min(widthRatio, heightRatio);

          // Calculate new dimensions
          const newWidth = originalWidth * scale;
          const newHeight = originalHeight * scale;

          // Center the image on screen
          const centerX = window.innerWidth / 2 - newWidth / 2;
          const centerY = window.innerHeight / 2 - newHeight / 2;

          const newImage: ImageElement = {
            id: `image-${Date.now()}`,
            content: {
              uri: uploadResult.data.url,
              x: centerX,
              y: centerY,
              width: newWidth,
              height: newHeight,
              scale: 1,
              rotation: 0,
              zIndex: board?.elements.length || 0,
            },
          };

          addElement(newImage);
        };

        img.src = uploadResult.data.url;
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setIsUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <div className='fixed bottom-4 left-1/2 -translate-x-1/2 z-50'>
        <div
          className={`flex items-center gap-2 p-1 bg-white border border-gray-200 rounded-lg shadow-lg transition-all ${
            isShareModalOpen ? 'blur-sm' : ''
          }`}
        >
          <button
            onClick={handleCreateSticker}
            className='w-10 h-10 flex items-center justify-center rounded bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors'
            title='Стикер'
            aria-label='Создать стикер'
          >
            <Icons.Sticker className='size-5 flex-shrink-0 text-gray-700' />
          </button>

          <button
            onClick={handleImageButtonClick}
            disabled={isUploading}
            className={`w-10 h-10 flex items-center justify-center rounded bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={isUploading ? 'Загрузка...' : 'Добавить изображение'}
            aria-label='Добавить изображение'
          >
            {isUploading ? (
              <Spinner className='size-5 flex-shrink-0 text-gray-700 animate-spin' />
            ) : (
              <Icons.NewDocument className='size-5 stroke-2 flex-shrink-0 text-gray-700' />
            )}
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept='image/*'
        className='hidden'
        aria-label='Выбрать изображение'
      />
    </>
  );
};
