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
    <aside className="w-80 flex-shrink-0 border-r border-hairline bg-canvas flex flex-col h-screen sticky top-0 z-10">
      {/* Brand Header */}
      <div className="p-6 border-b border-hairline flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-surface-1 border border-hairline-strong flex items-center justify-center shadow-sm lifted-edge">
          <Icons.Wind className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-ink tracking-eyebrow uppercase m-0">
            Tailwind CSS
          </h1>
          <span className="text-[10px] text-ink-subtle font-medium tracking-wide">
            Cheat Sheet & Visualizer
          </span>
        </div>
      </div>

      {/* Instant Search Bar */}
      <div className="p-4 border-b border-hairline">
        <div className="relative group">
          <Icons.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search classes or properties..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-surface-1 hover:bg-surface-2 focus:bg-surface-2 text-ink placeholder-ink-tertiary text-xs pl-10 pr-10 py-2.5 rounded-md border border-hairline focus:border-primary-focus focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink p-0.5 rounded hover:bg-surface-3"
            >
              <Icons.X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Category List */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1 scrollbar-thin">
        <div className="px-3 mb-2 text-[10px] font-semibold text-ink-tertiary tracking-wider uppercase">
          Categories
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all ${
                isSelected
                  ? 'bg-surface-2 border-l-2 border-primary text-ink font-medium lifted-edge'
                  : 'text-ink-subtle hover:text-ink hover:bg-surface-1/40 border-l-2 border-transparent'
              }`}
            >
              <IconComponent
                className={`w-4 h-4 flex-shrink-0 ${
                  isSelected ? 'text-primary' : 'text-ink-subtle'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs truncate">{category.title}</div>
                <div className="text-[10px] text-ink-tertiary truncate mt-0.5">
                  {category.groups.reduce((acc, g) => acc + g.classes.length, 0)} classes
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-hairline bg-canvas flex items-center justify-between text-[11px] text-ink-tertiary">
        <span>Tailwind v4.0 Stable</span>
        <a
          href="https://tailwindcss.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-0.5 text-primary hover:text-primary-hover transition-colors font-medium"
        >
          <span>Docs</span>
          <Icons.ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </aside>
  );
};
