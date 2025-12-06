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
}

const HubContext = createContext<IHubContext>({
  connection: null,
  connectionStarted: false,
});

export const HubContextProvider = ({
  children,
  boardId
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

  return (
    <HubContext.Provider value={{ connection, connectionStarted }}>
      {children}
    </HubContext.Provider>
  );
};

export const useHub = () => {
  const { connection, connectionStarted } = useContext(HubContext);

  return { connection, connectionStarted };
};
