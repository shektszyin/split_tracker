import React from 'react';
import { UserCircle, Heart } from 'lucide-react';

interface LoginScreenProps {
  userNames: string[];
  onSelectUser: (user: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ userNames, onSelectUser }) => {
  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-12 animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 ring-1 ring-white/10">
          <Heart className="w-10 h-10 text-white fill-white" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">FairShare</h1>
        <p className="text-zinc-500 font-medium">Choose your profile to continue</p>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full max-w-xs animate-in slide-in-from-bottom-10 duration-500 delay-200">
        {userNames.map((name, idx) => (
          <button
            key={name}
            onClick={() => onSelectUser(name)}
            className="group relative flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-[32px] hover:border-white/20 active:scale-95 transition-all text-left overflow-hidden"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
              <UserCircle className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xl font-bold text-white tracking-tight">{name}</div>
              <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Tap to select</div>
            </div>
            <div className={`absolute top-0 right-0 w-1.5 h-full ${idx === 0 ? 'bg-emerald-500' : 'bg-orange-500'} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
          </button>
        ))}
      </div>

      <p className="mt-16 text-[10px] text-zinc-700 font-bold uppercase tracking-[0.2em]">Shared Expense Tracker</p>
    </div>
  );
};

export default LoginScreen;