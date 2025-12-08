import { BoardElement } from '../board-element.interface';

export interface ImageContent {
  type: 'image';
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
  uri: string;
  width?: number;
  height?: number;
}

export interface ImageElement extends BoardElement {
  content: ImageContent;
}
