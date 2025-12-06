import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Board } from '../interfaces/board/board.interface';
import { BoardElement } from '../interfaces/board/board-element.interface';

interface BoardState {
  boardId: string | null;
  loading: boolean;
  board: Board | null;
  updateBoard: (board: Board) => void;
  setLoading: (loading: boolean) => void;
  initializeBoard: (boardId: string) => void;
  addElement: (element: BoardElement) => void;
  updateElement: (element: BoardElement) => void;
  removeElement: (elementId: string) => void;
  getOrCreateBoard: (boardId?: string) => Board;
}

const createEmptyBoard = (boardId: string): Board => ({
  id: boardId,
  users: [],
  pointers: [],
  elements: [],
});

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      boardId: null,
      loading: true,
      board: null,
      updateBoard: (board) => set({ board, boardId: board.id }),
      setLoading: (loading) => set({ loading }),
      initializeBoard: (boardId: string) => {
        const currentBoard = get().board;
        if (!currentBoard) {
          set({
            board: createEmptyBoard(boardId),
            boardId,
          });
        }
      },
      getOrCreateBoard: (boardId?: string) => {
        const state = get();
        const targetBoardId = boardId || state.boardId || 'default';
        
        if (!state.board) {
          const newBoard = createEmptyBoard(targetBoardId);
          set({
            board: newBoard,
            boardId: targetBoardId,
          });
          return newBoard;
        }
        
        return state.board;
      },
      addElement: (element: BoardElement) => {
        const state = get();
        const currentBoard = state.getOrCreateBoard();
        
        set({
          board: {
            ...currentBoard,
            elements: [...currentBoard.elements, element],
          },
        });
      },
      updateElement: (element: BoardElement) => {
        const state = get();
        const currentBoard = state.getOrCreateBoard();
        
        set({
          board: {
            ...currentBoard,
            elements: currentBoard.elements.map((el) =>
              el.id === element.id ? element : el
            ),
          },
        });
      },
      removeElement: (elementId: string) => {
        const state = get();
        const currentBoard = state.getOrCreateBoard();
        
        set({
          board: {
            ...currentBoard,
            elements: currentBoard.elements.filter((el) => el.id !== elementId),
          },
        });
      },
    }),
    {
      name: 'board-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
