import { axiosInstance } from '../instance/axios.instance';

export const createBoard = async (): Promise<string | null> => {
  try {
    console.log("HEY");
    const res = await axiosInstance.post<string>('boards');
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getBoards = async (): Promise<string[] | null> => {
  try {
    const res = await axiosInstance.get<string[]>('boards');
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
