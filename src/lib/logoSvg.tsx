import { ThemeId } from '@/lib/themes';

interface LogoSvgProps {
  className?: string;
  theme?: ThemeId;
}

export const LogoSvg = ({ className = "h-12 w-auto", theme = "neutral" }: LogoSvgProps) => {
  const getThemeStyles = () => {
    switch (theme) {
      case 'summer':
        return {
          iconBorder: 'from-amber-400 via-orange-500 to-rose-500 shadow-amber-500/20',
          letterText: 'from-yellow-300 via-amber-400 to-rose-400',
          pingDot: 'bg-amber-400',
          titleText: 'from-yellow-300 via-amber-400 to-rose-500',
          subText: 'text-amber-200',
          subLabel: 'Summer Edition ☀️',
        };
      case 'winter':
        return {
          iconBorder: 'from-cyan-400 via-sky-500 to-indigo-500 shadow-cyan-500/20',
          letterText: 'from-cyan-200 via-sky-300 to-indigo-300',
          pingDot: 'bg-cyan-400',
          titleText: 'from-cyan-300 via-sky-400 to-indigo-400',
          subText: 'text-cyan-200',
          subLabel: 'Ski Resort ❄️',
        };
      case 'neutral':
      default:
        return {
          iconBorder: 'from-amber-400 via-pink-500 to-purple-600 shadow-purple-500/20',
          letterText: 'from-yellow-300 via-pink-400 to-purple-400',
          pingDot: 'bg-yellow-400',
          titleText: 'from-yellow-400 via-pink-500 to-purple-500',
          subText: 'text-purple-200',
          subLabel: 'Alias Game GE ⚡',
        };
    }
  };

  const style = getThemeStyles();

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr ${style.iconBorder} p-[2px] shadow-lg transform -rotate-3 hover:rotate-0 transition-all duration-300`}>
          <div className="w-full h-full bg-slate-900/90 rounded-[14px] flex items-center justify-center backdrop-blur-sm">
            <span className={`text-lg sm:text-xl font-black bg-gradient-to-r ${style.letterText} bg-clip-text text-transparent`}>
              A
            </span>
          </div>
        </div>
        <div className={`absolute -top-1 -right-1 w-3 h-3 ${style.pingDot} rounded-full border-2 border-slate-900 animate-ping opacity-75`} />
      </div>
      <div className="flex flex-col">
        <span className={`text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r ${style.titleText} bg-clip-text text-transparent leading-none drop-shadow-sm`}>
          ალიასი
        </span>
        <span className={`text-[9px] sm:text-[10px] font-bold tracking-wider ${style.subText} uppercase opacity-90 truncate`}>
          {style.subLabel}
        </span>
      </div>
    </div>
  );
};

export default LogoSvg;