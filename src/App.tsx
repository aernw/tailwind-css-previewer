import { useState } from 'react';
import * as Icons from 'lucide-react';
import { tailwindCategories } from './data/tailwindData';
import { Sidebar } from './components/Sidebar';
import { Playground } from './components/Playground';
import { CheatSheetGrid } from './components/CheatSheetGrid';

function App() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('flexbox-grid');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
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
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-900 pb-5 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold tracking-widest uppercase">
              <span>Interactive Reference & Visualizer</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-sans tracking-tight mt-1 mb-0">
              {searchQuery ? 'Search Reference' : activeCategory.title}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-normal">
              {searchQuery 
                ? 'Showing utility class matches containing your query.' 
                : activeCategory.description
              }
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/tailwindlabs/tailwindcss"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/40 transition-all flex items-center gap-2 text-xs font-semibold"
            >
              <Icons.GitFork className="w-3.5 h-3.5" />
              <span>Tailwind Repo</span>
            </a>
          </div>
        </header>

        {/* Live Playground Showcase */}
        {!searchQuery && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-1.5">
                <Icons.Sparkles className="w-3.5 h-3.5 text-indigo-400" />
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
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-1.5">
              <Icons.BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              Reference Cheat Sheet
            </h3>
            <span className="text-[10px] text-slate-500 font-semibold italic">
              Click <Icons.Play className="w-2.5 h-2.5 inline-block text-indigo-400" /> to try class in playground · Click <Icons.Copy className="w-2.5 h-2.5 inline-block text-slate-400" /> to copy
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
