/// A component that catches errors in its children and renders a fallback UI.
/// This component is special and uses class components to manage errors. Most components should
/// use function components. For a detailed function component example see [StarkitchenApp.tsx].

import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode; // ReactNode type allows children to be any renderable React content
  fallback?: ReactNode; // Optional fallback UI
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to an external service
    console.error('Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
