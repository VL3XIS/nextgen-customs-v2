import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    location?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center p-8 bg-zinc-900/90 border border-red-500/20 rounded-xl text-center backdrop-blur-sm">
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
                    <p className="text-sm text-gray-400 mb-6 max-w-md">
                        {this.props.location ? `Error in ${this.props.location}: ` : ''}
                        {this.state.error?.message || 'An unexpected error occurred.'}
                    </p>
                    <button
                        onClick={this.handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
