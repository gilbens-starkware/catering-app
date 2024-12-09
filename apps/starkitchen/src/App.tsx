import './App.css'
import { StarkitchenApp } from './components/StarkitchenApp';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { StarknetProvider } from './providers/StarknetProvider';

const App = () => (
  <ErrorBoundary>
    <StarknetProvider>
      <StarkitchenApp />
    </StarknetProvider>
  </ErrorBoundary>
)

export default App
