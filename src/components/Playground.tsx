import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { CategoryData } from '../data/tailwindData';

interface PlaygroundProps {
  category: CategoryData;
  activeStyles: Record<string, any>;
  onControlChange: (controlId: string, value: any) => void;
}

export const Playground: React.FC<PlaygroundProps> = ({
  category,
  activeStyles,
  onControlChange,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'html'>('preview');
  const [copiedCode, setCopiedCode] = useState(false);

  // Generate the class list applied to the preview container/element
  const getCompiledClasses = () => {
    return category.playground.controls
      .map((ctrl) => {
        const val = activeStyles[ctrl.id] !== undefined ? activeStyles[ctrl.id] : ctrl.defaultValue;
        if (ctrl.valueMapper) {
          return ctrl.valueMapper(val);
        }
        if (ctrl.type === 'slider' && ctrl.classPrefix) {
          return `${ctrl.classPrefix}${val}`;
        }
        if (ctrl.type === 'toggle') {
          return val ? ctrl.classPrefix : '';
        }
        // select type
        return val;
      })
      .filter((cls) => !!cls)
      .join(' ');
  };

  const compiledClasses = getCompiledClasses();

  // Generate HTML representation of the preview element
  const getHTMLCode = () => {
    const previewType = category.playground.previewType;
    
    if (previewType === 'flex') {
      const isGrid = activeStyles['display'] === 'grid';
      const childCount = activeStyles['itemsCount'] || 3;
      let childrenHTML = '';
      for (let i = 1; i <= childCount; i++) {
        childrenHTML += `\n  <div class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold p-6 rounded-xl shadow-md flex items-center justify-center min-w-16 h-16">\n    ${i}\n  </div>`;
      }
      return `<div class="${isGrid ? 'grid' : 'flex'} ${compiledClasses}">\n${childrenHTML}\n</div>`;
    }

    if (previewType === 'box') {
      return `<div class="bg-indigo-600 text-white font-bold px-6 py-3 rounded-lg shadow-md ${compiledClasses}">\n  Spacing Element\n</div>`;
    }

    if (previewType === 'text') {
      return `<div class="${compiledClasses}">\n  <h4 class="font-bold mb-1">Tailwind CSS v4</h4>\n  <p>Utility-first CSS framework for rapid UI development.</p>\n</div>`;
    }

    if (previewType === 'card') {
      return `<div class="bg-slate-800 p-6 ${compiledClasses}">\n  <div class="w-12 h-12 rounded-full bg-indigo-500 mb-4"></div>\n  <h4 class="text-white font-semibold">Alex Rivera</h4>\n  <p class="text-slate-400 text-sm">UX Designer</p>\n</div>`;
    }

    if (previewType === 'animation') {
      // Clean up hover formatting
      const cleanClasses = compiledClasses.split(' ').map(c => c.trim()).join(' ');
      return `<div class="bg-indigo-600 p-8 text-white rounded-xl shadow-md cursor-pointer transition-all ${cleanClasses}">\n  <svg class="w-8 h-8">...</svg>\n</div>`;
    }

    return `<!-- Preview Component -->`;
  };

  const handleCopyCode = () => {
    const code = getHTMLCode();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Render the controls panel (Sliders, Selects)
  const renderControls = () => {
    const isGrid = activeStyles['display'] === 'grid';

    return (
      <div className="space-y-5">
        {category.playground.controls.map((ctrl) => {
          // Hide direction/justify/align/itemsCount controls if in grid mode, and hide gridCols if in flex mode
          if (category.id === 'flexbox-grid') {
            if (isGrid && ['direction', 'justify', 'align'].includes(ctrl.id)) return null;
            if (!isGrid && ctrl.id === 'gridCols') return null;
          }

          const value = activeStyles[ctrl.id] !== undefined ? activeStyles[ctrl.id] : ctrl.defaultValue;

          return (
            <div key={ctrl.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                  {ctrl.label}
                </label>
                <span className="text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/10">
                  {ctrl.type === 'slider' 
                    ? (ctrl.valueMapper ? ctrl.valueMapper(value) : `${ctrl.classPrefix}${value}`)
                    : value
                  }
                </span>
              </div>

              {ctrl.type === 'slider' && (
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={ctrl.min}
                    max={ctrl.max}
                    step={ctrl.step}
                    value={value}
                    onChange={(e) => onControlChange(ctrl.id, Number(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
                  />
                </div>
              )}

              {ctrl.type === 'select' && ctrl.options && (
                <select
                  value={value}
                  onChange={(e) => onControlChange(ctrl.id, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:border-indigo-500/50 focus:outline-none transition-all cursor-pointer"
                >
                  {ctrl.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Render the animated Preview Area
  const renderPreview = () => {
    const previewType = category.playground.previewType;

    if (previewType === 'flex') {
      const childCount = activeStyles['itemsCount'] || 3;
      const isGrid = activeStyles['display'] === 'grid';
      const items = Array.from({ length: childCount }, (_, i) => i + 1);

      return (
        <motion.div
          layout
          className={`${isGrid ? 'grid' : 'flex'} ${compiledClasses} ${category.playground.defaultStyles}`}
        >
          <AnimatePresence initial={false}>
            {items.map((num) => (
              <motion.div
                key={num}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold w-14 h-14 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/10 cursor-default"
              >
                {num}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      );
    }

    if (previewType === 'box') {
      const paddingVal = activeStyles['padding'] !== undefined ? activeStyles['padding'] : 4;
      const marginVal = activeStyles['margin'] !== undefined ? activeStyles['margin'] : 4;

      // Map values for the devtools look overlays
      const paddingList = [0, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96];
      const marginList = [0, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96];

      const pSize = paddingList[paddingVal] !== undefined ? paddingList[paddingVal] : 16;
      const mSize = marginList[marginVal] !== undefined ? marginList[marginVal] : 16;

      return (
        <div className={category.playground.defaultStyles}>
          {/* DevTools style Margin Box */}
          <div 
            className="border border-orange-500/30 bg-orange-500/5 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{ padding: `${mSize}px` }}
          >
            {/* Margin Label */}
            <div className="absolute top-2 left-2 text-[9px] uppercase tracking-widest text-orange-400 font-bold bg-orange-950/80 px-1.5 py-0.5 rounded border border-orange-500/20">
              margin: {mSize}px
            </div>

            {/* DevTools style Padding Box */}
            <div 
              className="bg-emerald-500/5 border border-emerald-500/30 rounded-lg flex items-center justify-center w-full min-h-[100px] transition-all duration-200"
              style={{ padding: `${pSize}px` }}
            >
              {/* Padding Label */}
              <div className="absolute bottom-2 right-2 text-[9px] uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/20">
                padding: {pSize}px
              </div>

              {/* Inner Content Block */}
              <motion.div 
                layout
                className="w-full bg-indigo-500 text-white font-bold py-4 rounded-md shadow-md text-center max-w-xs cursor-default flex justify-center items-center gap-2"
              >
                <Icons.Box className="w-4 h-4" />
                <span>Content Box</span>
              </motion.div>
            </div>
          </div>
        </div>
      );
    }

    if (previewType === 'text') {
      return (
        <div className={category.playground.defaultStyles}>
          <div className={`${compiledClasses}`}>
            <h4 className="font-extrabold text-white mb-2 font-sans tracking-tight">
              Tailwind CSS Playground
            </h4>
            <p className="text-slate-300 font-normal leading-relaxed text-sm">
              Tailwind CSS is a utility-first CSS framework packed with classes like 
              <code className="text-xs text-indigo-300 mx-1 bg-indigo-500/5 py-0.5 px-1.5 rounded">flex</code>, 
              <code className="text-xs text-indigo-300 mx-1 bg-indigo-500/5 py-0.5 px-1.5 rounded">pt-4</code>, and 
              <code className="text-xs text-indigo-300 mx-1 bg-indigo-500/5 py-0.5 px-1.5 rounded">text-center</code> 
              that can be composed to build any design, directly in your markup. Adjust the sliders to see how this text behaves!
            </p>
          </div>
        </div>
      );
    }

    if (previewType === 'card') {
      return (
        <div className={category.playground.defaultStyles}>
          <motion.div
            layout
            className={`w-64 bg-slate-800/80 p-6 flex flex-col items-center text-center transition-all ${compiledClasses}`}
          >
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/10 mb-4 border border-slate-700">
              <Icons.User className="w-7 h-7 text-white" />
            </div>
            
            <h4 className="text-white font-bold text-base font-sans">Alex Rivera</h4>
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-wider mt-0.5">
              Frontend Engineer
            </p>
            <p className="text-slate-400 text-xs mt-3 leading-relaxed">
              Enjoys constructing fluid interfaces and highly-interactive user experiences.
            </p>
            
            <button className="w-full mt-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md shadow-indigo-600/15 transition-all">
              Connect
            </button>
          </motion.div>
        </div>
      );
    }

    if (previewType === 'animation') {
      // Clean up hover formatting
      const cleanClasses = compiledClasses.split(' ').map(c => c.trim()).join(' ');

      return (
        <div className={category.playground.defaultStyles}>
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-28 h-28 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-xl flex items-center justify-center cursor-pointer transition-all border border-indigo-400/20 ${cleanClasses}`}
            >
              <Icons.Rocket className="w-12 h-12 text-white fill-white/10" />
            </div>
            <span className="text-[10px] text-slate-500 font-medium italic mt-2">
              Hover to trigger scale/rotate transitions
            </span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-900 flex flex-col lg:flex-row gap-6 shadow-xl relative overflow-hidden">
      {/* Glow highlight background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none -mr-40 -mt-40" />

      {/* Control Panel (Left Side) */}
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 m-0 leading-tight">
            <Icons.Sliders className="w-5 h-5 text-indigo-400" />
            {category.playground.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-normal">
            {category.playground.description}
          </p>
        </div>
        <div className="border-t border-slate-900/60 pt-4">
          {renderControls()}
        </div>
      </div>

      {/* Live Preview & Output Panel (Right Side) */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Preview Tabs */}
        <div className="flex items-center justify-between border-b border-slate-900 pb-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'preview'
                  ? 'bg-slate-900 text-white border border-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Live Component
            </button>
            <button
              onClick={() => setActiveTab('html')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'html'
                  ? 'bg-slate-900 text-white border border-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              HTML Code
            </button>
          </div>
          {activeTab === 'html' && (
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold transition-all bg-indigo-500/5 px-2.5 py-1 rounded-md border border-indigo-500/10"
            >
              {copiedCode ? (
                <>
                  <Icons.Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Icons.Copy className="w-3 h-3" />
                  <span>Copy HTML</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Dynamic Display Area */}
        <div className="flex-1 flex flex-col justify-center min-h-[220px]">
          {activeTab === 'preview' ? (
            renderPreview()
          ) : (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 overflow-x-auto text-[11px] font-mono text-indigo-300/90 whitespace-pre-wrap leading-relaxed select-all">
              {getHTMLCode()}
            </div>
          )}
        </div>

        {/* Classes Bar */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-900 flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-3">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              Applied Tailwind Classes
            </span>
            <div className="text-xs font-mono text-indigo-400 truncate mt-1 select-all font-bold">
              {compiledClasses || '(no active classes)'}
            </div>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(compiledClasses);
              setCopiedCode(true);
              setTimeout(() => setCopiedCode(false), 1500);
            }}
            title="Copy classes string"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all flex-shrink-0"
          >
            <Icons.Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
