import {StrictMode, useState} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import LoadingScreen from './components/LoadingScreen.tsx';
import './index.css';

function Root() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <StrictMode>
      {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}
      {isLoaded && <App />}
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
