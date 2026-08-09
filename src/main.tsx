import {StrictMode, useState} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import LoadingScreen from './components/LoadingScreen.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

function Root() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <StrictMode>
      <ErrorBoundary>
        {!isLoaded ? (
          <LoadingScreen onComplete={() => setIsLoaded(true)} />
        ) : (
          <App />
        )}
      </ErrorBoundary>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
