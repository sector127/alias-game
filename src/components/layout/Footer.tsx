import React from 'react';
import { ThemeConfig } from '@/lib/themes';

interface FooterProps {
  activeTheme: ThemeConfig;
  skipPenalty: boolean;
  winningScore: number;
}

export const Footer: React.FC<FooterProps> = ({
  activeTheme,
  skipPenalty,
  winningScore,
}) => {
  return (
    <footer
      className={`px-4 py-2.5 ${activeTheme.footerBg} border-t ${activeTheme.footerBorder} flex items-center justify-between text-[11px] text-slate-400`}
    >
      <span>სწორი: +1 ქულა {skipPenalty ? '| Skip: -1 ქულა' : '| Skip: 0 ქულა'}</span>
      <span>მიზანი: {winningScore} ქულამდე</span>
    </footer>
  );
};
