import {
  ElementRenderer,
  ElementRendererProps,
  ElementRendererConfigPanelProps,
} from './element-renderer.interface';
import { StickerElement } from '../interfaces/board/tools/sticker-element.interface';
import { BoardElement } from '../interfaces/board/board-element.interface';
import { Image } from '@/components/tools/image';
import { ImageElement } from '../interfaces/board/tools/image-element.interface';

export const imageRenderer: ElementRenderer = {
  canRender: (element: BoardElement): element is StickerElement => {
    if (!element.content || typeof element.content !== 'object') {
      return false;
    }
    const content = element.content as Record<string, unknown>;
    return 'uri' in content && content.uri !== undefined;
  },

  render: ({
    element,
    onUpdate,
    onDelete,
    isSelected,
    onSelect,
  }: ElementRendererProps) => {
    if (!imageRenderer.canRender(element)) {
      return null;
    }

    return (
      <Image
        element={element as ImageElement}
        isSelected={isSelected}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onSelect={onSelect}
      />
    );
  },

  renderConfigPanel: ({
    element,
    board,
    onUpdate,
  }: ElementRendererConfigPanelProps) => {
    if (!imageRenderer.canRender(element)) {
      return null;
    }
  },
};
