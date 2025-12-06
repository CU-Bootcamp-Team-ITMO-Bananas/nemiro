import { Canvas } from './components/canvas';
import { Header } from './components/header';
import { Toolbar } from './components/toolbar';
import { HubContextProvider } from './shared/context/hub.context';

function App() {
  return (
    <div className='h-fit bg-white'>
      <HubContextProvider boardId={'12314'}>
        <Header />
        <Canvas />
        <Toolbar />
      </HubContextProvider>
    </div>
  );
}

export default App;
