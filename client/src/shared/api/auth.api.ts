import { TelegramAuthData } from 'node_modules/@telegram-auth/react/dist/cjs';
import { axiosInstance } from '../instance/axios.instance';
import { User } from '../interfaces/user.interface';

export const loginUser = async (
  authData: TelegramAuthData
): Promise<User | null> => {
  try {
    const res = await axiosInstance.post<User>('auth', {
      id: authData.id,
      username: authData.username,
      photoUrl: authData.photo_url,
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
