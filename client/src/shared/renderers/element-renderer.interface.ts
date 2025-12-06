import { BoardElement } from '../interfaces/board/board-element.interface';
import { ReactNode } from 'react';

export interface ElementRendererProps {
  element: BoardElement;
  onUpdate: (element: BoardElement) => void;
  onDelete?: (elementId: string) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

export interface ElementRenderer {
  /**
   * Проверяет, может ли этот рендерер отрисовать данный элемент
   */
  canRender: (element: BoardElement) => boolean;
  
  /**
   * Рендерит элемент
   */
  render: (props: ElementRendererProps) => ReactNode;
}

