import { axiosInstance } from '../instance/axios.instance';

export const createBoard = async (): Promise<string | null> => {
  try {
    const res = await axiosInstance.post<string>('board');
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
