import { create } from 'zustand';
import { Board } from '../interfaces/board/board.interface';

interface BoardState {
  board: Board | null;
  updateBoard: (board: Board) => void;
}

export const useBoardState = create<BoardState>((set) => ({
  board: null,
  updateBoard: (board) => set({ board }),
}));

