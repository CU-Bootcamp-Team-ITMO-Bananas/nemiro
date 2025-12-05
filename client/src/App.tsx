import { LoginButton } from '@telegram-auth/react';
import { BOT_USERNAME } from './shared/constants';

function App() {
 return (
  <div className="App">
   <LoginButton
    botUsername={BOT_USERNAME}
    onAuthCallback={data => {
     console.log(data);
    }}
   />
  </div>
 );
}

export default App;
