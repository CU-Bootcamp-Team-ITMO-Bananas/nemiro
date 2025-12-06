import { BoardElement } from '../board-element.interface';

export interface StickerContent {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
  color: number;
  text: string;
  width?: number;
  height?: number;
}

export interface StickerElement extends BoardElement {
  content: StickerContent;
}
