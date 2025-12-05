import { axiosInstance } from '../instance/axios.instance';
import { User } from '../interfaces/user.interface';

export const loginUser = async (
 user: Omit<User, 'id' | 'createdAt'>,
): Promise<User | null> => {
 try {
  const res = await axiosInstance.post<User>('/api/v1/users', user);
  return res.data;
 } catch (err) {
  console.error(err);
  return null;
 }
};
