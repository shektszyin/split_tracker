import React, { useState } from 'react';
import { Trash2, Database, Info, ChevronRight, Plus, X, Check, Edit2 } from 'lucide-react';
import { USE_BACKEND } from '../constants';
import { CategoryItem } from '../types';
import { COLOR_PALETTE } from '../constants';

interface SettingsViewProps {
  onClearData: () => void;
  categories: CategoryItem[];
  onAddCategory: (name: string, color: string) => void;
  onUpdateCategory: (id: string, name: string, color: string) => void;
  onDeleteCategory: (id: string) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  onClearData, 
  categories, 
  onAddCategory, 
  onUpdateCategory, 
  onDeleteCategory 
}) => {
  const [isEditingCats, setIsEditingCats] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState(COLOR_PALETTE[0]);

  // Temporary state for editing existing item
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const handleStartEdit = (cat: CategoryItem) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color);
  };

  const handleSaveEdit = () => {
    if (editId && editName) {
      onUpdateCategory(editId, editName, editColor);
      setEditId(null);
    }
  };

  const handleAdd = () => {
    if (newCatName) {
      onAddCategory(newCatName, newCatColor);
      setNewCatName('');
      // Cycle color
      const currentIndex = COLOR_PALETTE.indexOf(newCatColor);
      setNewCatColor(COLOR_PALETTE[(currentIndex + 1) % COLOR_PALETTE.length]);
    }
  };

  const cycleColor = (currentColor: string, setter: (c: string) => void) => {
    const currentIndex = COLOR_PALETTE.indexOf(currentColor);
    const nextColor = currentIndex === -1 ? COLOR_PALETTE[0] : COLOR_PALETTE[(currentIndex + 1) % COLOR_PALETTE.length];
    setter(nextColor);
  };

  return (
    <div className="space-y-8 animate-fade-in pt-4 pb-20">
      <h2 className="text-xl font-bold text-white px-2 tracking-tight">Settings</h2>

      {/* Category Management */}
      <div className="space-y-3">
         <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Categories</h3>
            <button 
              onClick={() => setIsEditingCats(!isEditingCats)}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {isEditingCats ? 'Done' : 'Manage'}
            </button>
         </div>

         <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl overflow-hidden ring-1 ring-white/5 p-4 space-y-3">
            {categories.map(cat => (
               <div key={cat.id} className="flex items-center justify-between gap-3">
                  {editId === cat.id ? (
                     // Edit Mode Row
                     <div className="flex-1 flex items-center gap-2">
                        <button 
                          type="button"
                          onClick={() => cycleColor(editColor, setEditColor)}
                          className="w-6 h-6 rounded-full shrink-0 ring-2 ring-white/20" 
                          style={{ backgroundColor: editColor }} 
                        />
                        <input 
                          type="text" 
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 bg-slate-800 text-white text-sm rounded-lg px-2 py-1 border-none focus:ring-1 focus:ring-emerald-500"
                          autoFocus
                        />
                        <button onClick={handleSaveEdit} className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400">
                           <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setEditId(null)} className="p-1.5 bg-slate-700/50 rounded-lg text-slate-400">
                           <X className="w-3.5 h-3.5" />
                        </button>
                     </div>
                  ) : (
                     // Display Mode Row
                     <>
                       <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="text-sm text-slate-200 font-medium">{cat.name}</span>
                       </div>
                       {isEditingCats && (
                          <div className="flex items-center gap-2">
                             <button onClick={() => handleStartEdit(cat)} className="text-slate-500 hover:text-white p-1">
                                <Edit2 className="w-3.5 h-3.5" />
                             </button>
                             <button onClick={() => onDeleteCategory(cat.id)} className="text-slate-500 hover:text-red-400 p-1">
                                <Trash2 className="w-3.5 h-3.5" />
                             </button>
                          </div>
                       )}
                     </>
                  )}
               </div>
            ))}

            {/* Add New Row */}
            {isEditingCats && (
               <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                  <button 
                     type="button"
                     onClick={() => cycleColor(newCatColor, setNewCatColor)}
                     className="w-6 h-6 rounded-full shrink-0 ring-2 ring-white/20" 
                     style={{ backgroundColor: newCatColor }} 
                  />
                  <input 
                     type="text" 
                     value={newCatName}
                     onChange={(e) => setNewCatName(e.target.value)}
                     placeholder="New Category..."
                     className="flex-1 bg-slate-900/50 text-white text-sm rounded-lg px-3 py-1.5 border border-slate-700 focus:border-emerald-500 focus:ring-0"
                  />
                  <button 
                     onClick={handleAdd}
                     disabled={!newCatName}
                     className="p-1.5 bg-emerald-500 text-slate-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     <Plus className="w-4 h-4" />
                  </button>
               </div>
            )}
         </div>
      </div>

      <div className="space-y-6">
        {/* Data Section */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Data</h3>
          <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl overflow-hidden ring-1 ring-white/5">
             <button 
               onClick={onClearData}
               className="w-full flex items-center justify-between px-6 py-5 hover:bg-red-500/5 transition-colors group"
             >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-slate-200 font-medium text-sm">Clear Data</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
             </button>
          </div>
        </div>

        {/* System Section */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">System</h3>
          <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl overflow-hidden ring-1 ring-white/5 divide-y divide-white/5">
             <div className="flex items-center justify-between px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                    <Database className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-slate-200 font-medium text-sm">Storage Mode</div>
                    <div className="text-[11px] text-slate-500">
                        {USE_BACKEND ? 'Cloud Sync (Beta)' : 'Local Storage'}
                    </div>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${USE_BACKEND ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`}></div>
             </div>

             <div className="flex items-center justify-between px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-700/30 flex items-center justify-center">
                    <Info className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-slate-200 font-medium text-sm">Version</div>
                    <div className="text-[11px] text-slate-500">1.1.0</div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <div className="pt-8 text-center">
        <p className="text-slate-700 text-xs font-medium tracking-wide">FAIRSHARE</p>
      </div>
    </div>
  );
};

export default SettingsView;
