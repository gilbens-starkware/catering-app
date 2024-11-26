import './App.css'
import { StarkitchenApp } from '@/components/StarkitchenApp'
import { DynamicProvider } from './providers/DynamicProvider'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <DynamicProvider>
        <StarkitchenApp />
      </DynamicProvider>
    </ErrorBoundary>
  )
}

export default App
