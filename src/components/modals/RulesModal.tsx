import React from 'react';
import { ThemeConfig } from '@/lib/themes';
import { playModalSound } from '@/lib/sounds';
import { HelpCircle, X, Smartphone, Sparkles } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTheme: ThemeConfig;
  soundEnabled: boolean;
}

export const RulesModal: React.FC<RulesModalProps> = ({
  isOpen,
  onClose,
  activeTheme,
  soundEnabled,
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    playModalSound(false, soundEnabled);
    onClose();
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
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className={`h-5 w-5 ${activeTheme.accentText}`} />
            <h3 className="text-lg font-black text-white">როგორ ვითამაშოთ ალიასი?</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1 active:scale-90 transition-transform"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="bg-purple-950/30 border border-purple-500/30 p-3 rounded-xl space-y-1">
            <div className="font-bold text-purple-300">🎯 თამაშის მიზანი:</div>
            <p>
              აუხსენით თქვენს თანაგუნდელებს ეკრანზე გამოსახული სიტყვა ისე, რომ მათ დროის ამოწურვამდე გამოიცნონ.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-100">🚫 აკრძალულია:</div>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>სიტყვის ან მისი ფუძის გამოყენება ახსნისას (მაგ. &quot;საათი&quot; - &quot;მაჯის საათი&quot;).</li>
              <li>სიტყვის პირდაპირი თარგმანი სხვა ენიდან (მაგ. Dog -&gt; ძაღლი).</li>
              <li>ჟესტებით ან თითით მინიშნება გარშემო არსებულ საგნებზე.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-100">💡 რა შეიძლება:</div>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>სინონიმების, ანტონიმების, ასოციაციებისა და განმარტებების გამოყენება.</li>
              <li>ისტორიების, სიტუაციებისა და მაგალითების მოყვანა.</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-emerald-950/30 to-rose-950/30 p-3 rounded-xl border border-purple-500/30 space-y-1">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Smartphone className={`h-4 w-4 ${activeTheme.accentText}`} /> 👆 Tinder Swipe ჟესტები:
            </div>
            <p className="text-slate-300 text-xs">
              გაასრიალეთ ბარათი <strong>მარჯვნივ 👉</strong> სწორი პასუხისთვის (+1), ან <strong>მარცხნივ 👈</strong> გამოსატოვებლად (Skip).
            </p>
          </div>

          <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-500/30 space-y-1">
            <div className="font-bold text-purple-300 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-400" /> 🎭 Party რეჟიმი (გიჟური დავალებები):
            </div>
            <p className="text-slate-300 text-xs">
              თითოეულ რაუნდში ამხსნელი იღებს საიდუმლო გამოწვევას (ემოციები, ხმები, მოძრაობები ან ტაბუ). დავალების წარმატებით შესრულება გუნდს ანიჭებს <strong>+2 ბონუს ქულას</strong>!
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="font-bold text-amber-400">🏆 გამარჯვება:</div>
            <p>
              პირველი გუნდი, რომელიც რაუნდების თანაბარი რაოდენობის შემდეგ დააგროვებს გამარჯვების ქულას, იგებს თამაშს!
            </p>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-colors active:scale-98"
        >
          გასაგებია!
        </button>
      </div>
    </div>
  );
};
