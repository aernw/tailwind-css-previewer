import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { tailwindCategories } from './data/tailwindData';
import { Sidebar } from './components/Sidebar';
import { Playground } from './components/Playground';
import { CheatSheetGrid } from './components/CheatSheetGrid';

function App() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('flexbox-grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [theme, setTheme] = useState<'dark' | 'light'>('light'); // Mastercard is Light-first by default
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Sync theme with document.documentElement (html element)
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Stores separate playground states for each category
  const [playgroundStates, setPlaygroundStates] = useState<Record<string, Record<string, any>>>(() => {
    const initial: Record<string, Record<string, any>> = {};
    tailwindCategories.forEach((cat) => {
      initial[cat.id] = {};
      cat.playground.controls.forEach((ctrl) => {
        initial[cat.id][ctrl.id] = ctrl.defaultValue;
      });
    });
    return initial;
  });

  const handleControlChange = (categoryId: string, controlId: string, value: any) => {
    setPlaygroundStates((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [controlId]: value,
      },
    }));
  };

  const handleApplyClassToPlayground = (categoryId: string, controlId: string, value: any) => {
    setPlaygroundStates((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [controlId]: value,
      },
    }));
    setSelectedCategoryId(categoryId);
  };

  const activeCategory = tailwindCategories.find((cat) => cat.id === selectedCategoryId) || tailwindCategories[0];

  return (
    <div className={`min-h-screen flex bg-canvas text-ink font-sans antialiased overflow-hidden ${theme === 'light' ? 'light' : 'dark'}`}>
      {/* Sidebar Navigation Wrapper (Instant show/hide, no animation) */}
      {isSidebarOpen && (
        <div className="w-80 h-screen overflow-hidden flex-shrink-0 border-r border-hairline bg-canvas z-10">
          <Sidebar
            categories={tailwindCategories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onCloseSidebar={() => setIsSidebarOpen(false)}
            theme={theme}
            onToggleTheme={() => setTheme((t) => t === 'dark' ? 'light' : 'dark')}
          />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto px-8 py-6 space-y-6 scrollbar-thin">
        {/* Simple Page Header (Replaces Floating Nav Pill) */}
        <header className="max-w-5xl mx-auto flex items-center gap-3 pt-4 pb-3 border-b border-hairline mb-6">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              title="Open Sidebar"
              className="p-1.5 bg-surface-2 text-ink border border-hairline rounded-full hover:bg-surface-4 hover:border-hairline-strong transition-all flex items-center justify-center cursor-pointer shadow-sm mr-1"
            >
              <Icons.Menu className="w-3.5 h-3.5 text-primary" />
            </button>
          )}

          <h1 className="text-xl font-medium text-ink tracking-mc-head m-0">
            {searchQuery ? 'Search Options' : activeCategory.title}
          </h1>
        </header>

        {/* Section Intro (for search query or active category subtitle) */}
        <div className="max-w-5xl mx-auto pt-2">
          <p className="text-sm text-ink-subtle leading-relaxed font-[450]">
            {searchQuery
              ? 'Showing utility class matches containing your query.'
              : activeCategory.description
            }
          </p>
        </div>

        {/* Live Playground Showcase */}
        {!searchQuery && (
          <section className="space-y-3 max-w-5xl mx-auto">
            <Playground
              category={activeCategory}
              activeStyles={playgroundStates[selectedCategoryId]}
              onControlChange={(controlId, val) => handleControlChange(selectedCategoryId, controlId, val)}
            />
          </section>
        )}

        {/* Dynamic Reference Cheat Sheet Grid */}
        <section className="space-y-4 pt-2 max-w-5xl mx-auto">
          <div className="flex items-center justify-between border-b border-hairline pb-2">
            <h3 className="text-[10px] uppercase tracking-mc-eyebrow text-ink-subtle font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Reference Cheat Sheet
            </h3>
            <span className="text-[10px] text-ink-tertiary font-bold uppercase tracking-wider flex items-center gap-1">
              <span>Click</span>
              <Icons.Play className="w-2.5 h-2.5 text-primary" />
              <span>to preview · Click</span>
              <Icons.Copy className="w-2.5 h-2.5 text-ink-subtle" />
              <span>to copy</span>
            </span>
          </div>

          <CheatSheetGrid
            categories={tailwindCategories}
            selectedCategoryId={selectedCategoryId}
            searchQuery={searchQuery}
            onApplyClassToPlayground={handleApplyClassToPlayground}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
