import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { HubConnection } from '@microsoft/signalr/dist/esm/HubConnection';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { API_URL } from '@/shared/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildConnection(boardId: string): HubConnection {
  const connection = new HubConnectionBuilder()
    .withUrl(`${API_URL}/board/${boardId}`)
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  return connection;
}
export async function startConnection(
  connection: HubConnection
): Promise<void> {
  try {
    await connection.start();
    console.log('Connected!');
  } catch (e) {
    console.log('Connection failed: ', e);
  }
}
