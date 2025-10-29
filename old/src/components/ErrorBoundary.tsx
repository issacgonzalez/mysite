import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
          <div className="text-center max-w-2xl">
            <h1 className="text-4xl mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-6">
              {this.state.error?.message === 'ProjectPage load timeout' || this.state.error?.message === 'AllProjectsPage load timeout' 
                ? 'The page took too long to load. Please check your connection and try again.'
                : 'We\'re sorry for the inconvenience. Please refresh the page to try again.'}
            </p>
            {this.state.error && (
              <p className="text-xs text-gray-600 mb-6 font-mono">
                Error: {this.state.error.message}
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-aurelius-gold text-black rounded-lg hover:bg-aurelius-gold-light transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}