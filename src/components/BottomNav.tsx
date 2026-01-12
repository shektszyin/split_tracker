import React from 'react';
<<<<<<< HEAD
import { LayoutGrid, Settings, Plus, History, FileText } from 'lucide-react';

export type Tab = 'home' | 'history' | 'reports' | 'settings';
=======
import { LayoutGrid, Settings, Plus, History } from 'lucide-react';

export type Tab = 'home' | 'history' | 'settings';
>>>>>>> 01637ea2cbe9071fac0054fa25c7b2a89e505ea1

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onAddClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onAddClick }) => {
  return (
<<<<<<< HEAD
    <div className="fixed bottom-8 left-0 right-0 z-50 px-4 print:hidden">
      <div className="max-w-md mx-auto">
        <div className="bg-[#121212]/95 backdrop-blur-xl border border-white/5 rounded-[32px] h-20 px-4 flex items-center justify-between shadow-2xl shadow-black ring-1 ring-white/10">
            
            {/* Left Actions */}
            <div className="flex flex-1 justify-around gap-1">
                <button
                    onClick={() => onTabChange('home')}
                    className={`p-3 rounded-full transition-all ${
=======
    <div className="fixed bottom-8 left-0 right-0 z-50 px-6">
      <div className="max-w-md mx-auto">
        <div className="bg-[#121212] border border-white/5 rounded-[32px] h-20 px-2 flex items-center justify-between shadow-2xl shadow-black">
            
            {/* Left Actions */}
            <div className="flex-1 flex justify-center gap-1">
                <button
                    onClick={() => onTabChange('home')}
                    className={`p-4 rounded-full transition-all ${
>>>>>>> 01637ea2cbe9071fac0054fa25c7b2a89e505ea1
                        activeTab === 'home' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                >
                    <LayoutGrid className="w-6 h-6" strokeWidth={activeTab === 'home' ? 2.5 : 2} />
                </button>
<<<<<<< HEAD
                <button
                    onClick={() => onTabChange('history')}
                    className={`p-3 rounded-full transition-all ${
                        activeTab === 'history' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                >
                    <History className="w-6 h-6" strokeWidth={activeTab === 'history' ? 2.5 : 2} />
                </button>
            </div>

            {/* Center Action (Add) */}
            <div className="relative -top-6 px-4">
                <button
                    onClick={onAddClick}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all text-black"
=======
            </div>

            {/* Center Action (Add) */}
            <div className="relative -top-6">
                <button
                    onClick={onAddClick}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all text-black"
>>>>>>> 01637ea2cbe9071fac0054fa25c7b2a89e505ea1
                >
                    <Plus className="w-8 h-8" strokeWidth={3} />
                </button>
            </div>

            {/* Right Actions */}
<<<<<<< HEAD
            <div className="flex flex-1 justify-around gap-1">
                 <button
                    onClick={() => onTabChange('reports')}
                    className={`p-3 rounded-full transition-all ${
                        activeTab === 'reports' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                >
                    <FileText className="w-6 h-6" strokeWidth={activeTab === 'reports' ? 2.5 : 2} />
                </button>
                <button
                    onClick={() => onTabChange('settings')}
                    className={`p-3 rounded-full transition-all ${
=======
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
>>>>>>> 01637ea2cbe9071fac0054fa25c7b2a89e505ea1
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