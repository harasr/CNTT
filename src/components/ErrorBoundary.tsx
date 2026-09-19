import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in presentation app:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetStorage = () => {
    try {
      indexedDB.deleteDatabase('PresentationMediaDB');
      localStorage.clear();
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050508] text-white p-6 select-none font-sans">
          <div className="max-w-lg w-full p-8 rounded-2xl bg-gray-900/90 border border-cyan-500/40 shadow-[0_0_50px_rgba(0,243,255,0.2)] text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-bold uppercase tracking-wide text-white mb-2">
              Khắc phục hiển thị
            </h2>
            
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Trình duyệt gặp sự cố khi tải hiệu ứng đồ họa hoặc dữ liệu đa phương tiện. Bạn có thể tải lại trang hoặc khôi phục cài đặt gốc để tiếp tục bài thuyết trình.
            </p>

            {this.state.error && (
              <div className="mb-6 p-3 rounded-lg bg-black/60 border border-white/10 text-left font-mono text-xs text-red-300/80 overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(0,243,255,0.4)]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tải lại trang</span>
              </button>

              <button
                onClick={this.handleResetStorage}
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-xs font-mono uppercase tracking-wider transition-all border border-white/20"
              >
                <span>Xóa bộ nhớ đệm & Chạy lại</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
