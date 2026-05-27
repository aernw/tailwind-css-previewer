import React from 'react';
import * as Icons from 'lucide-react';
import type { CategoryData } from '../data/tailwindData';

interface SidebarProps {
  categories: CategoryData[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <aside className="w-80 flex-shrink-0 border-r border-slate-900 bg-slate-950/65 backdrop-blur-xl flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-900/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Icons.Wind className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300 font-sans tracking-tight leading-none m-0">
            Tailwind CSS
          </h1>
          <span className="text-xs text-indigo-400 font-medium tracking-wide">
            INTERACTIVE CHEAT SHEET
          </span>
        </div>
      </div>

      {/* Instant Search Bar */}
      <div className="p-4 border-b border-slate-900/60">
        <div className="relative group">
          <Icons.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            placeholder="Search classes or properties..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-900/50 hover:bg-slate-900/80 focus:bg-slate-900 text-slate-200 placeholder-slate-500 text-sm pl-10 pr-10 py-2.5 rounded-xl border border-slate-800/80 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5 rounded-md hover:bg-slate-800/50"
            >
              <Icons.X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
        <div className="px-3 mb-2 text-xs font-semibold text-slate-500 tracking-wider">
          REFERENCE CATEGORIES
        </div>
        {categories.map((category) => {
          const IconComponent = (Icons as any)[category.iconName] || Icons.BookOpen;
          const isSelected = selectedCategoryId === category.id && !searchQuery;
          
          return (
            <button
              key={category.id}
              onClick={() => {
                onSearchChange(''); // Reset search when clicking category
                onSelectCategory(category.id);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600/15 to-purple-600/5 border-l-2 border-indigo-500 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-l-2 border-transparent'
              }`}
            >
              <IconComponent
                className={`w-5 h-5 flex-shrink-0 ${
                  isSelected ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{category.title}</div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {category.groups.length} groups · {category.groups.reduce((acc, g) => acc + g.classes.length, 0)} classes
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-900/80 bg-slate-950/40 flex items-center justify-between text-xs text-slate-500">
        <span>Tailwind v4.0 Stable</span>
        <a
          href="https://tailwindcss.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <span>Docs</span>
          <Icons.ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </aside>
  );
};
