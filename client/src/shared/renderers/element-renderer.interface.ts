import { BoardElement } from '../interfaces/board/board-element.interface';
import { Board } from '../interfaces/board/board.interface';
import { ReactNode } from 'react';

export interface ElementRendererProps {
  element: BoardElement;
  onUpdate: (element: BoardElement) => void;
  onDelete?: (element: BoardElement) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

export interface ElementRendererConfigPanelProps {
  element: BoardElement;
  board: Board;
  onUpdate: (element: BoardElement) => void;
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
  
  /**
   * Рендерит панель конфигурации для элемента (опционально)
   */
  renderConfigPanel?: (props: ElementRendererConfigPanelProps) => ReactNode;
}

