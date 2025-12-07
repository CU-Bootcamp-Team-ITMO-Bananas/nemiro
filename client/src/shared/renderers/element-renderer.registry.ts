import { BoardElement } from '../interfaces/board/board-element.interface';
import { ElementRenderer } from './element-renderer.interface';
import { stickerRenderer } from './sticker.renderer';
import { imageRenderer } from './image.renderer';

/**
 * Регистр всех рендереров элементов
 * Порядок важен - первый подходящий рендерер будет использован
 */
const renderers: ElementRenderer[] = [
  stickerRenderer,
  imageRenderer,
  // Здесь можно добавить другие рендереры:
  // shapeRenderer,
  // textRenderer,
  // imageRenderer,
  // и т.д.
];

/**
 * Находит подходящий рендерер для элемента
 */
export const findRenderer = (element: BoardElement): ElementRenderer | null => {
  return renderers.find((renderer) => renderer.canRender(element)) || null;
};

/**
 * Регистрирует новый рендерер
 */
export const registerRenderer = (renderer: ElementRenderer) => {
  renderers.push(renderer);
};
