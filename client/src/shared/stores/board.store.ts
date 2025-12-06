import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Board } from '../interfaces/board/board.interface';

interface BoardState {
  boardId: string | null;
  loading: boolean;
  board: Board | null;
  updateBoard: (board: Board) => void;
  setLoading: (loading: boolean) => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      boardId: null,
      loading: true,
      board: null,
      updateBoard: (board) => set({ board }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'board-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
