import { BoardElement } from '../board-element.interface';

export interface TextContent {
  type: 'text';
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

export interface TextElement extends BoardElement {
  content: TextContent;
}
