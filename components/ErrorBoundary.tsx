'use client';

import { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
          >
            <div className="inline-block p-4 bg-red-500/20 rounded-full mb-4">
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Something Went Wrong</h2>
            <p className="text-white/70 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform mx-auto"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            <p className="text-white/40 text-xs mt-6">
              If this problem persists, please refresh the page
            </p>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional error boundary for specific sections
export function ErrorFallback({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-white font-bold mb-1">Error Loading Component</h3>
          <p className="text-white/70 text-sm mb-4">{error.message}</p>
          <button
            onClick={resetError}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </motion.div>
  );
}
