import { useBoardStore } from '@/shared/stores/board.store';
import { Spinner } from '../ui/spinner';

export const LoadingSpinner = () => {
  const { loading } = useBoardStore();

  return loading && <Spinner />;
};
