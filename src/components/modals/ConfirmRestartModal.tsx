import React from 'react';
import { playButtonTapSound, playModalSound } from '@/lib/sounds';
import { RotateCcw } from 'lucide-react';

interface ConfirmRestartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  soundEnabled: boolean;
}

export const ConfirmRestartModal: React.FC<ConfirmRestartModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  soundEnabled,
}) => {
  if (!isOpen) return null;

  const handleCancel = () => {
    playModalSound(false, soundEnabled);
    onClose();
  };

  const handleConfirm = () => {
    playButtonTapSound(soundEnabled);
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
        paddingLeft: 'max(env(safe-area-inset-left, 0px), 16px)',
        paddingRight: 'max(env(safe-area-inset-right, 0px), 16px)',
      }}
    >
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-center animate-in fade-in zoom-in-95 duration-150">
        <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
          <RotateCcw className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-black text-white">თამაშის შეწყვეტა?</h3>
          <p className="text-xs text-slate-400">მიმდინარე პროგრესი და ქულები წაიშლება.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={handleCancel}
            className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors active:scale-95"
          >
            გაუქმება
          </button>
          <button
            onClick={handleConfirm}
            className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors active:scale-95"
          >
            დიახ, შეწყვეტა
          </button>
        </div>
      </div>
    </div>
  );
};
