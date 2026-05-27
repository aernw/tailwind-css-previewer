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
      <div className="flex flex-col items-center justify-center p-12 text-ink-subtle">
        <Icons.Inbox className="w-10 h-10 text-ink-tertiary mb-3 stroke-[1.5]" />
        <h3 className="text-sm font-semibold text-ink-muted">No classes found</h3>
        <p className="text-xs text-ink-subtle max-w-xs text-center mt-1">
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
      onApplyClassToPlayground(category.id, 'custom', clsName);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {searchQuery && (
        <div className="text-xs text-ink-subtle px-1">
          Search results for "<span className="text-primary font-semibold">{searchQuery}</span>" (found{' '}
          {filteredCategories.reduce(
            (acc, cat) => acc + cat.groups.reduce((gAcc, g) => gAcc + g.classes.length, 0),
            0
          )}{' '}
          classes):
        </div>
      )}

      {filteredCategories.map((category) => (
        <div key={category.id} className="space-y-5">
          {searchQuery && (
            <div className="flex items-center gap-2 border-b border-hairline pb-2">
              <span className="text-[10px] uppercase tracking-mc-eyebrow text-primary font-bold bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                {category.title}
              </span>
            </div>
          )}

          {category.groups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-2.5">
              <h3 className="text-xs font-bold text-ink flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {group.name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {group.classes.map((cls, clsIdx) => {
                  const isCopied = copiedClass === cls.className;
                  return (
                    <div
                      key={clsIdx}
                      className="bg-surface-1 border border-hairline hover:border-hairline-strong hover:bg-surface-2 p-4 rounded-mc-btn flex items-center justify-between group relative overflow-hidden transition-all duration-200 shadow-sm"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono font-semibold text-primary bg-primary/5 px-2.5 py-0.5 rounded-full border border-primary/10 select-all">
                            {cls.className}
                          </code>
                        </div>
                        <p className="text-[10px] font-mono text-ink-subtle mt-2.5 truncate bg-canvas p-1.5 rounded-mc-btn border border-hairline">
                          {cls.cssProperty}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Copy Button */}
                        <button
                          onClick={() => handleCopy(cls.className)}
                          title="Copy class to clipboard"
                          className={`p-2 rounded-full transition-all ${
                            isCopied
                              ? 'bg-semantic-success/10 text-semantic-success border border-semantic-success/20'
                              : 'bg-surface-3 hover:bg-surface-4 text-ink-subtle hover:text-ink border border-hairline'
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
                          className="p-2 rounded-full bg-primary/5 hover:bg-primary/10 text-primary hover:text-primary-hover border border-primary/20 hover:border-primary-focus transition-all"
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
