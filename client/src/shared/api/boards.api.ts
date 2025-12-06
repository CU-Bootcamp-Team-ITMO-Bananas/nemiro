import { axiosInstance } from '../instance/axios.instance';
import { Board } from '../interfaces/board/board.interface';

export const createBoard = async (): Promise<string | null> => {
  try {
    const res = await axiosInstance.post<string>('boards');
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getBoards = async (): Promise<Board[] | null> => {
  try {
    const res = await axiosInstance.get<Board[]>('boards');
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
