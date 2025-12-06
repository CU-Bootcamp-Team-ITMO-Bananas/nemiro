import React from 'react';

interface BoardListProps {
  boards: string[];
  onBoardSelect: (boardId: string) => void;
}

export const BoardList: React.FC<BoardListProps> = ({ boards, onBoardSelect }) => {
  return (
    <nav className="board-list">
      <ul role="navigation" aria-label="Список досок">
        {boards.map((board) => (
          <li key={board}>
            <button
              onClick={() => onBoardSelect(board)}
              className="board-link"
              aria-label={`Перейти к доске ${board}`}
            >
              {boards.length > 0 ? (
                <div>Доска с ID = {board}</div>
              ) : (<div>Досок нет</div>)}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};