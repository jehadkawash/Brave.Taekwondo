// src/components/ErrorBoundary.jsx
import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] caught:', error, info);
  }

  handleReload = () => window.location.reload();

  handleGoHome = () => {
    window.location.hash = 'home';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4" dir="rtl">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-900/20 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-400">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-black text-slate-100 mb-2">حدث خطأ غير متوقع</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              صار خطأ بهذه الصفحة. جرّب تحديث الصفحة، وإذا استمرت المشكلة تواصل مع الدعم التقني.
            </p>
            <div className="flex gap-3">
              <button
                onClick={this.handleGoHome}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <Home size={16} /> الرئيسية
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-yellow-500 text-slate-950 hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} /> إعادة تحميل
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
