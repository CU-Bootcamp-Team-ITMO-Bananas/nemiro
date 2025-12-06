import { ElementRenderer, ElementRendererProps } from './element-renderer.interface';
import { StickerElement } from '../interfaces/board/tools/sticker-element.interface';
import { BoardElement } from '../interfaces/board/board-element.interface';
import { Sticker } from '@/components/tools/sticker';

export const stickerRenderer: ElementRenderer = {
  canRender: (element: BoardElement): element is StickerElement => {
    if (!element.content || typeof element.content !== 'object') {
      return false;
    }
    const content = element.content as Record<string, unknown>;
    return 'text' in content && content.text !== undefined;
  },

  render: ({ element, onUpdate, onDelete, isSelected, onSelect }: ElementRendererProps) => {
    if (!stickerRenderer.canRender(element)) {
      return null;
    }

    return (
      <Sticker
        element={element as StickerElement}
        isSelected={isSelected}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onSelect={onSelect}
      />
    );
  },
};

