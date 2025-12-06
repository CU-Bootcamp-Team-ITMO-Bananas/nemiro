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
  subscribe: (
    event: string,
    callback: (...args: unknown[]) => void,
    signal?: AbortSignal
  ) => () => void;
  emit: (event: string, ...args: unknown[]) => void;
}

const HubContext = createContext<IHubContext>({
  connection: null,
  connectionStarted: false,
  subscribe:
    (event: string, callback: (...args: unknown[]) => void) => () => {},
  emit: (event: string, ...args: unknown[]) => {},
});

export const HubContextProvider = ({
  children,
  boardId,
}: {
  children: ReactNode;
  boardId: string;
}) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [connectionStarted, setConnectionStarted] = useState(false);

  const startNewConnection = () => {
    const newConnection = buildConnection(boardId);
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

  const subscribe = (
    event: string,
    callback: (...args: unknown[]) => void,
    signal?: AbortSignal
  ) => {
    if (signal?.aborted) {
      return () => {};
    }

    const loggingCallback = (data: unknown) => {
      console.info(`[socket] < ${event}`, data);
      callback(data);
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
      value={{ emit, subscribe, connection, connectionStarted }}
    >
      {children}
    </HubContext.Provider>
  );
};

export const useHub = () => {
  const { emit, subscribe, connection, connectionStarted } =
    useContext(HubContext);
  return { emit, subscribe, connection, connectionStarted };
};
