import { User } from '../user.interface';
import { BoardElement } from './board-element.interface';
import { BoardPointer } from './board-pointer.interface';

export interface Board {
  id: string;
  users: User[];
  pointers: BoardPointer[];
  elements: BoardElement[];
}
