import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../interfaces/user.interface';
import {
  uniqueNamesGenerator,
  adjectives,
  names,
  animals,
} from 'unique-names-generator';

interface AuthState {
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  user: User | null;
  setUser: (user: User) => void;
}

export const anonymousUser = (): User => {
  return {
    id: (Math.random() * 10 ** 5).toFixed(0),
    username: uniqueNamesGenerator({
      dictionaries: [names, adjectives, animals],
      length: 2,
    }),
    avatar: null,
    telegram: 0,
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      login: (user) => set({ isLoggedIn: true, user }),
      logout: () => set({ isLoggedIn: false, user: null }),
      user: null,
      setUser: (user) => set({ isLoggedIn: false, user }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const getAuthStoreMethods = () => {
  const { user } = useAuthStore.getState();
  return { user };
};
