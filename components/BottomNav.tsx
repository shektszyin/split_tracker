import React from 'react';
import { LayoutGrid, Settings, Plus, History } from 'lucide-react';

export type Tab = 'home' | 'history' | 'settings';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onAddClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onAddClick }) => {
  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 px-6">
      <div className="max-w-md mx-auto">
        <div className="bg-[#121212] border border-white/5 rounded-[32px] h-20 px-2 flex items-center justify-between shadow-2xl shadow-black">
            
            {/* Left Actions */}
            <div className="flex-1 flex justify-center gap-1">
                <button
                    onClick={() => onTabChange('home')}
                    className={`p-4 rounded-full transition-all ${
                        activeTab === 'home' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                >
                    <LayoutGrid className="w-6 h-6" strokeWidth={activeTab === 'home' ? 2.5 : 2} />
                </button>
            </div>

            {/* Center Action (Add) */}
            <div className="relative -top-6">
                <button
                    onClick={onAddClick}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all text-black"
                >
                    <Plus className="w-8 h-8" strokeWidth={3} />
                </button>
            </div>

            {/* Right Actions */}
            <div className="flex-1 flex justify-center gap-1">
                 <button
                    onClick={() => onTabChange('history')}
                    className={`p-4 rounded-full transition-all ${
                        activeTab === 'history' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                >
                    <History className="w-6 h-6" strokeWidth={activeTab === 'history' ? 2.5 : 2} />
                </button>
                <button
                    onClick={() => onTabChange('settings')}
                    className={`p-4 rounded-full transition-all ${
                        activeTab === 'settings' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                >
                    <Settings className="w-6 h-6" strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;