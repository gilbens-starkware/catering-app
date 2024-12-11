import './App.css';
import { NFTabuApp } from './components/NFTabuApp';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { StarknetProvider } from './providers/StarknetProvider';

// The main file of the NFTabu app. It wraps the NFTabuApp component with the StarknetProvider and ErrorBoundary components.
// ErrorBoundary - a component that catches errors in its children components and displays a
//                 fallback UI, you probably won't need to modify it.
// StarknetProvider - a component that wraps the main app component with some Starknet related
//                    configuration, you probably won't need to modify it either.
// NFTabuApp - the main component of the NFTabu app, this is where you will write your app.
const App = () => (
  <ErrorBoundary>
    <StarknetProvider>
      <NFTabuApp />
    </StarknetProvider>
  </ErrorBoundary>
);

export default App;
