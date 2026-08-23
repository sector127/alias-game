export const LogoSvg = ({ className = "h-12 w-auto" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-[2px] shadow-lg shadow-purple-500/20 transform -rotate-3 hover:rotate-0 transition-transform">
          <div className="w-full h-full bg-slate-900/90 rounded-[14px] flex items-center justify-center backdrop-blur-sm">
            <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              A
            </span>
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 rounded-full border-2 border-slate-900 animate-ping opacity-75" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent leading-none drop-shadow-sm">
          ალიასი
        </span>
        <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-purple-200 uppercase opacity-90">
          Alias Game GE
        </span>
      </div>
    </div>
  );
};

export default LogoSvg;