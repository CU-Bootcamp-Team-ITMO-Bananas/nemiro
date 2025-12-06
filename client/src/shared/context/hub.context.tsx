import { buildConnection, startConnection } from '@/lib/utils';
import { HubConnection } from '@microsoft/signalr';
import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from 'react';

interface IHubContext {
  connection: HubConnection | null;
  connectionStarted: boolean;
  boardId: string;
  subscribe: <T>(
    event: string,
    callback: (data: T) => void,
    signal?: AbortSignal
  ) => () => void;
  emit: <T>(event: string, data: T) => void;
}

const HubContext = createContext<IHubContext>({
  connection: null,
  connectionStarted: false,
  boardId: '',
  subscribe:
    <T,>(event: string, callback: (data: T) => void) =>
    () => {},
  emit: <T,>(event: string, data: T) => {},
});

export const HubContextProvider = ({
  children,
  boardId,
  userId,
}: {
  children: ReactNode;
  boardId: string;
  userId: number;
}) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [connectionStarted, setConnectionStarted] = useState(false);

  const startNewConnection = () => {
    const newConnection = buildConnection(boardId, userId);
    setConnection(newConnection);
  };

  useEffect(() => {
    startNewConnection();
  }, []);

  useEffect(() => {
    if (connection) {
      startConnection(connection).then(() => {
        setConnectionStarted(true);

        connection.onclose(() => {
          startNewConnection();
        });
      });
    }
  }, [connection]);

  const subscribe = <T,>(
    event: string,
    callback: (data: T) => void,
    signal?: AbortSignal
  ) => {
    if (signal?.aborted) {
      return () => {};
    }

    const loggingCallback = (data: unknown) => {
      console.info(`[socket] < ${event}`, data);
      callback(data as T);
    };

    connection?.on(event, loggingCallback);

    const unsubscribe = () => {
      connection?.off(event, loggingCallback);
      signal?.removeEventListener('abort', unsubscribe);
    };

    signal?.addEventListener('abort', unsubscribe, { once: true });

    return unsubscribe;
  };

  const emit = (event: string, data: unknown) => {
    console.info(`[socket] > ${event}`, data);
    connection?.invoke(event, data);
  };

  return (
    <HubContext.Provider
      value={{ emit, subscribe, connection, connectionStarted, boardId }}
    >
      {children}
    </HubContext.Provider>
  );
};

export const useHub = () => {
  const { emit, subscribe, connection, connectionStarted, boardId } =
    useContext(HubContext);
  return { emit, subscribe, connection, connectionStarted, boardId };
};
