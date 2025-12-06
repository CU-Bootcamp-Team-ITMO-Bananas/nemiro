import { BoardElement } from '../board-element.interface';

export interface StickerContent {
  text: string;
  width?: number;
  height?: number;
}

export interface StickerElement extends BoardElement {
  content: StickerContent;
}