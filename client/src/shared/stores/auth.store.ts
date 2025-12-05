import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../interfaces/user.interface';

interface AuthState {
 isLoggedIn: boolean;
 login: (user: User) => void;
 logout: () => void;
 user: User | null;
}

export const useAuthStore = create<AuthState>()(
 persist(
  set => ({
   isLoggedIn: false,
   login: user => set({ isLoggedIn: true, user }),
   logout: () => set({ isLoggedIn: false, user: null }),
   user: null,
  }),
  {
   name: 'auth-storage',
   storage: createJSONStorage(() => localStorage),
  },
 ),
);
