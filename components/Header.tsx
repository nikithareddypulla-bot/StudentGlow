
import React from 'react';

interface HeaderProps {
  view: 'browse' | 'publish';
  setView: (view: 'browse' | 'publish') => void;
}

export const Header: React.FC<HeaderProps> = ({ view, setView }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('browse')}>
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
          S
        </div>
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          StudentGlow
        </span>
      </div>
      
      <nav className="flex items-center gap-6">
        <button 
          onClick={() => setView('browse')}
          className={`text-sm font-medium transition-colors ${view === 'browse' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
        >
          Browse Finds
        </button>
        <button 
          onClick={() => setView('publish')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
            view === 'publish' 
              ? 'bg-indigo-600 text-white shadow-indigo-200' 
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Publish New
        </button>
      </nav>
    </header>
  );
};
