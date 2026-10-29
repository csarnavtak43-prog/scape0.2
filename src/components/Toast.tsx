import React from 'react';
import { ToastMessage } from '../types/scrap';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let borderClass = 'border-emerald-500 bg-slate-900 text-white';
        let Icon = CheckCircle2;
        let iconColor = 'text-emerald-400';

        if (toast.type === 'error') {
          borderClass = 'border-rose-500 bg-slate-900 text-white';
          Icon = AlertCircle;
          iconColor = 'text-rose-400';
        } else if (toast.type === 'info') {
          borderClass = 'border-sky-500 bg-slate-900 text-white';
          Icon = Info;
          iconColor = 'text-sky-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-l-4 shadow-2xl transition-all duration-300 transform translate-y-0 ${borderClass}`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
              <p className="text-xs sm:text-sm font-medium leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-1 transition"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
