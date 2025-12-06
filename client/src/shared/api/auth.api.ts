import { TelegramAuthData } from 'node_modules/@telegram-auth/react/dist/cjs';
import { axiosInstance } from '../instance/axios.instance';
import { User } from '../interfaces/user.interface';

export const loginUser = async (
  authData: TelegramAuthData
): Promise<User | null> => {
  try {
    const res = await axiosInstance.post<User>('auth', {
      id: authData.id,
      firstName: authData.first_name,
      lastName: authData.last_name,
      username: authData.username,
      photoUrl: authData.photo_url,
      hash: authData.hash,
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
