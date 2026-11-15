import React, { useEffect, useState } from 'react';
import { CoffeeToast } from '../types';
import { Coffee, X } from 'lucide-react';

interface ToastBannerProps {
  toast: CoffeeToast | null;
  onDismiss: () => void;
}

export const ToastBanner: React.FC<ToastBannerProps> = ({ toast, onDismiss }) => {
  if (!toast) return null;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 6000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-stone-900 border-2 border-amber-500 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
      <button
        onClick={onDismiss}
        className="absolute top-2.5 right-2.5 p-1 rounded-full text-stone-400 hover:text-stone-200"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="text-3xl bg-amber-500/20 p-2 rounded-xl border border-amber-500/30 flex-shrink-0">
          {toast.drinkEmoji}
        </div>
        <div className="min-w-0 pr-4">
          <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            Coffee Toast from {toast.fromName}!
          </div>
          <div className="text-[11px] text-stone-400">
            {toast.fromTable > 0 ? `Sent from Table ${toast.fromTable}` : 'Sent to your table'}
          </div>
          <p className="text-xs text-stone-100 italic mt-1 font-sans">
            "{toast.message}"
          </p>
        </div>
      </div>
    </div>
  );
};
