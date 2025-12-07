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
    id: Math.floor(Math.random() * 10 ** 5),
    username: uniqueNamesGenerator({
      style: 'capital',
      dictionaries: [adjectives, names, animals],
      length: 2,
      separator: ' ',
    }),
    avatar:
      'https://www.notion.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fspoqsaf9291f%2F12aGR6AxxXEWa7lyx2ajKf%2Ff975bec7ca7eaf17cc0a856daa55897f%2FNPC_10_priority.webp&w=1080&q=75',
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
