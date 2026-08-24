import React from 'react';
import { ThemeId, THEMES } from '@/lib/themes';
import { playThemeSwitchSound, playModalSound } from '@/lib/sounds';
import { Palette, Check, X } from 'lucide-react';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
  soundEnabled: boolean;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  soundEnabled,
}) => {
  if (!isOpen) return null;

  const handleSelect = (themeId: ThemeId) => {
    playThemeSwitchSound(themeId, soundEnabled);
    onSelectTheme(themeId);
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
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[88vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-black text-white">აირჩიეთ ვიზუალური თემა</h3>
          </div>
          <button
            onClick={() => {
              playModalSound(false, soundEnabled);
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg active:scale-90 transition-transform"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Theme Cards List */}
        <div className="space-y-2.5">
          {(Object.values(THEMES) as Array<typeof THEMES[ThemeId]>).map((theme) => {
            const isSelected = currentTheme === theme.id;
            
            // Dynamic card border & background
            let activeCardClass = 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700';
            if (isSelected) {
              if (theme.id === 'summer') {
                activeCardClass = 'bg-amber-950/30 border-amber-400/80 shadow-lg shadow-amber-950/50 ring-1 ring-amber-400/50';
              } else if (theme.id === 'winter') {
                activeCardClass = 'bg-cyan-950/30 border-cyan-400/80 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400/50';
              } else {
                activeCardClass = 'bg-purple-950/30 border-purple-400/80 shadow-lg shadow-purple-950/50 ring-1 ring-purple-400/50';
              }
            }

            return (
              <div
                key={theme.id}
                onClick={() => handleSelect(theme.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer select-none transition-all active:scale-[0.98] ${activeCardClass}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-md ${
                        theme.id === 'summer'
                          ? 'bg-gradient-to-tr from-amber-400 to-rose-500 text-white'
                          : theme.id === 'winter'
                          ? 'bg-gradient-to-tr from-cyan-400 to-indigo-500 text-white'
                          : 'bg-gradient-to-tr from-purple-500 to-pink-500 text-white'
                      }`}
                    >
                      {theme.emoji}
                    </div>

                    <div className="space-y-0.5 text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-black text-white">
                          {theme.nameKa}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {theme.nameEn}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-300">
                        {theme.subtitle}
                      </p>
                      <p className="text-[11px] text-slate-400 pt-0.5 leading-snug">
                        {theme.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 pt-0.5">
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md animate-in zoom-in-75">
                        <Check className="h-4 w-4 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-slate-700 bg-slate-900/50" />
                    )}
                  </div>
                </div>

                {/* Color Swatch Preview Bar */}
                <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] font-semibold text-slate-400">პალიტრა:</span>
                  <div className="flex items-center gap-1">
                    {theme.confettiColors.slice(0, 5).map((color, cIdx) => (
                      <div
                        key={cIdx}
                        className="w-3.5 h-3.5 rounded-full shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Done Button */}
        <button
          onClick={() => {
            playModalSound(false, soundEnabled);
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm transition-all active:scale-[0.99] shadow-lg shadow-purple-950/50"
        >
          შენახვა & დახურვა
        </button>
      </div>
    </div>
  );
};

export default ThemeSelectorModal;
