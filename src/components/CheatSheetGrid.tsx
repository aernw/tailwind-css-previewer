import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import type { CategoryData } from '../data/tailwindData';

interface CheatSheetGridProps {
  categories: CategoryData[];
  selectedCategoryId: string;
  searchQuery: string;
  onApplyClassToPlayground: (category: string, controlId: string, val: string) => void;
}

export const CheatSheetGrid: React.FC<CheatSheetGridProps> = ({
  categories,
  selectedCategoryId,
  searchQuery,
  onApplyClassToPlayground,
}) => {
  const [copiedClass, setCopiedClass] = useState<string | null>(null);

  const handleCopy = (className: string) => {
    navigator.clipboard.writeText(className);
    setCopiedClass(className);
    setTimeout(() => setCopiedClass(null), 1500);
  };

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  // Filter logic for search query
  const getFilteredResults = () => {
    if (!searchQuery) {
      return selectedCategory ? [selectedCategory] : [];
    }

    const query = searchQuery.toLowerCase();
    return categories
      .map((cat) => {
        const filteredGroups = cat.groups
          .map((group) => {
            const filteredClasses = group.classes.filter(
              (cls) =>
                cls.className.toLowerCase().includes(query) ||
                cls.cssProperty.toLowerCase().includes(query) ||
                group.name.toLowerCase().includes(query)
            );
            return { ...group, classes: filteredClasses };
          })
          .filter((group) => group.classes.length > 0);

        return { ...cat, groups: filteredGroups };
      })
      .filter((cat) => cat.groups.length > 0);
  };

  const filteredCategories = getFilteredResults();

  if (filteredCategories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500">
        <Icons.Inbox className="w-12 h-12 text-slate-700 mb-4 stroke-[1.5]" />
        <h3 className="text-lg font-semibold text-slate-400">No classes found</h3>
        <p className="text-sm text-slate-500 max-w-xs text-center mt-1">
          Try searching for something else like "flex", "shadow", "rounded", or CSS properties like "padding".
        </p>
      </div>
    );
  }

  // Detect which control is affected in playground
  const findMatchingControlAndApply = (category: CategoryData, clsName: string) => {
    // Try to find a control in playground that handles this class
    const control = category.playground.controls.find((ctrl) => {
      if (ctrl.options) {
        return ctrl.options.some((opt) => opt.value === clsName);
      }
      return false;
    });

    if (control) {
      onApplyClassToPlayground(category.id, control.id, clsName);
    } else {
      // General fallback if we can't map it directly, we can apply it
      onApplyClassToPlayground(category.id, 'custom', clsName);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {searchQuery && (
        <div className="text-sm text-slate-400 px-1">
          Search results for "<span className="text-indigo-400 font-semibold">{searchQuery}</span>" (found{' '}
          {filteredCategories.reduce(
            (acc, cat) => acc + cat.groups.reduce((gAcc, g) => gAcc + g.classes.length, 0),
            0
          )}{' '}
          classes):
        </div>
      )}

      {filteredCategories.map((category) => (
        <div key={category.id} className="space-y-6">
          {searchQuery && (
            <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
              <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded">
                {category.title}
              </span>
            </div>
          )}

          {category.groups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                {group.name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {group.classes.map((cls, clsIdx) => {
                  const isCopied = copiedClass === cls.className;
                  return (
                    <div
                      key={clsIdx}
                      className="glass-card p-3.5 rounded-xl flex items-center justify-between group relative overflow-hidden"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono font-bold text-indigo-300 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 select-all">
                            {cls.className}
                          </code>
                        </div>
                        <p className="text-[11px] font-mono text-slate-400 mt-2 truncate bg-slate-950/40 p-1.5 rounded border border-slate-900">
                          {cls.cssProperty}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Copy Button */}
                        <button
                          onClick={() => handleCopy(cls.className)}
                          title="Copy class to clipboard"
                          className={`p-2 rounded-lg transition-all ${
                            isCopied
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/40'
                          }`}
                        >
                          {isCopied ? (
                            <Icons.Check className="w-3.5 h-3.5" />
                          ) : (
                            <Icons.Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Playground Apply Button */}
                        <button
                          onClick={() => findMatchingControlAndApply(category, cls.className)}
                          title="Apply to visual playground"
                          className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 transition-all"
                        >
                          <Icons.Play className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
