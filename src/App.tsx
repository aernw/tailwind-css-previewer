import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { tailwindCategories } from './data/tailwindData';
import { Sidebar } from './components/Sidebar';
import { Playground } from './components/Playground';
import { CheatSheetGrid } from './components/CheatSheetGrid';

function App() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('flexbox-grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Sync theme with document.documentElement (html element)
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
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
    <div className={`min-h-screen flex bg-canvas text-ink font-sans antialiased overflow-hidden ${theme === 'light' ? 'light' : ''}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        categories={tailwindCategories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto px-8 py-6 space-y-6 scrollbar-thin">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-hairline pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-ink-subtle font-semibold tracking-eyebrow uppercase">
              <span>Interactive Reference & Visualizer</span>
            </div>
            <h1 className="text-xl md:text-2xl font-semibold text-ink tracking-display-md mt-1 mb-0">
              {searchQuery ? 'Search Reference' : activeCategory.title}
            </h1>
            <p className="text-xs md:text-sm text-ink-subtle mt-1.5 max-w-2xl leading-normal">
              {searchQuery 
                ? 'Showing utility class matches containing your query.' 
                : activeCategory.description
              }
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme((t) => t === 'dark' ? 'light' : 'dark')}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              className="px-3 py-1.5 bg-surface-1 text-ink border border-hairline rounded-md hover:bg-surface-2 hover:border-hairline-strong transition-all flex items-center gap-2 text-xs font-semibold shadow-sm lifted-edge cursor-pointer"
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
              className="px-3 py-1.5 bg-surface-1 text-ink border border-hairline rounded-md hover:bg-surface-2 hover:border-hairline-strong transition-all flex items-center gap-2 text-xs font-semibold shadow-sm lifted-edge"
            >
              <Icons.GitFork className="w-3.5 h-3.5 text-ink-subtle" />
              <span>Tailwind Repo</span>
            </a>
          </div>
        </header>

        {/* Live Playground Showcase */}
        {!searchQuery && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] uppercase tracking-eyebrow text-ink-subtle font-semibold flex items-center gap-1.5">
                <Icons.Sparkles className="w-3.5 h-3.5 text-primary" />
                Live Showcase Playground
              </h3>
            </div>
            <Playground
              category={activeCategory}
              activeStyles={playgroundStates[selectedCategoryId]}
              onControlChange={(controlId, val) => handleControlChange(selectedCategoryId, controlId, val)}
            />
          </section>
        )}

        {/* Dynamic Reference Cheat Sheet Grid */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-hairline pb-2">
            <h3 className="text-[10px] uppercase tracking-eyebrow text-ink-subtle font-semibold flex items-center gap-1.5">
              <Icons.BookOpen className="w-3.5 h-3.5 text-primary" />
              Reference Cheat Sheet
            </h3>
            <span className="text-[10px] text-ink-tertiary font-medium italic flex items-center gap-1">
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
