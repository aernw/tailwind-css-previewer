import React from 'react';
import * as Icons from 'lucide-react';
import type { CategoryData } from '../data/tailwindData';

interface SidebarProps {
  categories: CategoryData[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCloseSidebar?: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onCloseSidebar,
  theme,
  onToggleTheme,
}) => {
  return (
    <aside className="w-80 flex-shrink-0 flex flex-col h-full bg-canvas">
      {/* Brand Header */}
      <div className="p-6 border-b border-hairline flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-2 border border-hairline flex items-center justify-center shadow-sm">
            <Icons.Wind className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-xs font-bold text-ink tracking-mc-eyebrow uppercase m-0">
              Tailwind CSS
            </h1>
            <span className="text-[10px] text-ink-subtle font-medium tracking-wide uppercase">
              Orbit Reference
            </span>
          </div>
        </div>

        {onCloseSidebar && (
          <button
            onClick={onCloseSidebar}
            title="Close Sidebar"
            className="w-7 h-7 rounded-full bg-surface-2 border border-hairline flex items-center justify-center text-ink-subtle hover:text-ink hover:border-hairline-strong transition-all cursor-pointer shadow-sm"
          >
            <Icons.ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expandable Pill Search Bar */}
      <div className="p-4 border-b border-hairline">
        <div className="relative group">
          <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search reference..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-surface-1 hover:bg-surface-2 focus:bg-surface-2 text-ink placeholder-ink-tertiary text-xs pl-10 pr-10 py-2.5 rounded-full border border-hairline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink p-0.5 rounded-full hover:bg-surface-3"
            >
              <Icons.X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Category List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
        <div className="px-3 mb-2 text-[10px] font-bold text-ink-subtle tracking-mc-eyebrow uppercase flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Constellations
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-mc-btn text-left transition-all ${
                isSelected
                  ? 'bg-surface-2 border-l-2 border-primary text-ink font-medium shadow-sm'
                  : 'text-ink-subtle hover:text-ink hover:bg-surface-1/50 border-l-2 border-transparent'
              }`}
            >
              <IconComponent
                className={`w-4 h-4 flex-shrink-0 ${
                  isSelected ? 'text-primary' : 'text-ink-subtle'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs truncate font-medium">{category.title}</div>
                <div className="text-[10px] text-ink-tertiary truncate mt-0.5 uppercase tracking-wider font-semibold">
                  {category.groups.reduce((acc, g) => acc + g.classes.length, 0)} Options
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sidebar Controls Panel (Theme Switcher and Repository Links) */}
      <div className="p-4 border-t border-hairline space-y-3 bg-canvas/30">
        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          className="w-full px-4 py-2 bg-surface-1 hover:bg-surface-2 text-ink border border-hairline rounded-mc-btn transition-all flex items-center justify-center gap-2 text-xs font-semibold shadow-sm cursor-pointer"
        >
          {theme === 'dark' ? (
            <>
              <Icons.Sun className="w-3.5 h-3.5 text-primary" />
              <span>Light Theme</span>
            </>
          ) : (
            <>
              <Icons.Moon className="w-3.5 h-3.5 text-primary" />
              <span>Dark Theme</span>
            </>
          )}
        </button>

        {/* Repository Link */}
        <a
          href="https://github.com/tailwindlabs/tailwindcss"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full px-4 py-2 bg-ink hover:bg-ink/90 text-canvas border border-ink rounded-mc-btn transition-all flex items-center justify-center gap-2 text-xs font-semibold shadow-sm text-center"
        >
          <Icons.GitFork className="w-3.5 h-3.5 text-canvas/80" />
          <span>Tailwind Repo</span>
        </a>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-hairline bg-canvas flex items-center justify-between text-[10px] text-ink-subtle font-semibold uppercase tracking-wider">
        <span>Tailwind v4.0</span>
        <a
          href="https://tailwindcss.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-0.5 text-primary hover:text-primary-hover transition-colors"
        >
          <span>Docs</span>
          <Icons.ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </aside>
  );
};
