import { create } from 'zustand';
import { User } from '../interfaces/user.interface';

interface BoardState {
  users: User[];
  pointers: null;
  elements: null;
}

export const useBoardState = create<BoardState>(() => ({
  users: [
    {
      id: '',
      first_name: 'Mike',
      last_name: null,
      username: 'mikedegeofroy',
      avatar:
        'https://t.me/i/userpic/320/s6B8nJP9COE376ut4geQ3xw3mJFRNb7BCoEJSmKitic.jpg',
      telegram: 0,
    },
    {
      id: '',
      first_name: '',
      last_name: null,
      username: null,
      avatar:
        'https://t.me/i/userpic/320/s6B8nJP9COE376ut4geQ3xw3mJFRNb7BCoEJSmKitic.jpg',
      telegram: 0,
    },
  ],
  pointers: null,
  elements: null,
}));
