import React from 'react';
import { Team } from '@/types/game';
import { ThemeConfig } from '@/lib/themes';

interface CountdownScreenProps {
  currentTeam: Team;
  countdownValue: number;
  activeTheme: ThemeConfig;
}

export const CountdownScreen: React.FC<CountdownScreenProps> = ({
  currentTeam,
  countdownValue,
  activeTheme,
}) => {
  return (
    <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <span className={`text-sm font-bold ${activeTheme.accentText} tracking-widest uppercase`}>
        {currentTeam.name}
      </span>
      <div
        className={`w-36 h-36 rounded-full ${activeTheme.countdownGradient} flex items-center justify-center text-7xl font-black text-white shadow-2xl shadow-purple-900/60 animate-bounce`}
      >
        {countdownValue === 0 ? 'GO!' : countdownValue}
      </div>
      <p className="text-slate-400 text-sm font-semibold">ახსენით რაც შეიძლება მეტი სიტყვა!</p>
    </div>
  );
};
