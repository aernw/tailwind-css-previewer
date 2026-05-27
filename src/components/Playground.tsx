import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [activeTab, setActiveTab] = useState<'preview' | 'react'>('preview');
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

  // Generate React TSX representation of the preview element
  const getReactTSCode = () => {
    const previewType = category.playground.previewType;
    
    if (previewType === 'flex') {
      const isGrid = activeStyles['display'] === 'grid';
      const childCount = activeStyles['itemsCount'] || 3;
      let childrenJSX = '';
      for (let i = 1; i <= childCount; i++) {
        childrenJSX += `\n        <div className="bg-surface-2 border border-hairline text-ink font-semibold w-14 h-14 rounded-full shadow-sm flex items-center justify-center">\n          ${i}\n        </div>`;
      }
      return `import React from 'react';\n\nexport const FlexLayout: React.FC = () => {\n  return (\n    <div className="${isGrid ? 'grid' : 'flex'} ${compiledClasses}">\n      {/* Hand-drawn orbital paths connecting children can be applied here */}${childrenJSX}\n    </div>\n  );\n};`;
    }

    if (previewType === 'box') {
      return `import React from 'react';\n\nexport const SpacingBox: React.FC = () => {\n  return (\n    <div className="bg-primary text-white font-medium px-6 py-2 rounded-mc-btn shadow-sm ${compiledClasses}">\n      Spacing Element\n    </div>\n  );\n};`;
    }

    if (previewType === 'text') {
      return `import React from 'react';\n\nexport const Typography: React.FC = () => {\n  return (\n    <div className="${compiledClasses}">\n      <h4 className="font-medium text-ink mb-1.5 tracking-mc-head text-lg">MarkForMC Display</h4>\n      <p className="text-ink-subtle text-xs leading-relaxed font-[450]">Mastercard uses a half-step 450 weight for exceptionally soft reading tone.</p>\n    </div>\n  );\n};`;
    }

    if (previewType === 'card') {
      return `import React from 'react';\nimport { User, ArrowRight } from 'lucide-react';\n\nexport const SolutionCard: React.FC = () => {\n  return (\n    <div className="w-60 bg-surface-2 p-6 border border-hairline rounded-mc-btn shadow-sm relative ${compiledClasses}">\n      {/* Circular portrait with satellite CTA */}\n      <div className="w-24 h-24 rounded-full bg-surface-3 flex items-center justify-center border border-hairline relative mx-auto mb-4">\n        <User className="w-10 h-10 text-ink-subtle" />\n        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white text-ink border border-hairline shadow-md flex items-center justify-center translate-x-1.5 translate-y-1.5 hover:scale-105 transition-transform">\n          <ArrowRight className="w-4 h-4" />\n        </button>\n      </div>\n      <span className="text-[10px] text-primary font-bold tracking-mc-eyebrow uppercase mb-1 block">• SOLUTIONS</span>\n      <h4 className="text-ink font-semibold text-sm tracking-mc-head">Alex Rivera</h4>\n      <p className="text-ink-subtle text-[11px] font-medium">Digital Payments</p>\n      <button className="w-full mt-4 bg-ink hover:bg-ink/90 text-canvas text-xs font-semibold py-2 px-4 rounded-mc-btn transition-all border border-ink shadow-sm">\n        Connect\n      </button>\n    </div>\n  );\n};`;
    }

    if (previewType === 'animation') {
      const cleanClasses = compiledClasses.split(' ').map(c => c.trim()).join(' ');
      return `import React from 'react';\nimport { Rocket } from 'lucide-react';\n\nexport const AnimatedCircle: React.FC = () => {\n  return (\n    <div className="w-24 h-24 bg-surface-2 text-primary rounded-full border border-hairline shadow-sm flex items-center justify-center cursor-pointer transition-all ${cleanClasses}">\n      <Rocket className="w-10 h-10 text-primary" />\n    </div>\n  );\n};`;
    }

    return `import React from 'react';\n\nexport const Preview: React.FC = () => {\n  return <div>Preview</div>;\n};`;
  };

  const handleCopyCode = () => {
    const code = getReactTSCode();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Render the controls panel (Sliders, Selects)
  const renderControls = () => {
    const isGrid = activeStyles['display'] === 'grid';

    return (
      <div className="space-y-4">
        {category.playground.controls.map((ctrl) => {
          // Hide direction/justify/align/itemsCount controls if in grid mode, and hide gridCols if in flex mode
          if (category.id === 'flexbox-grid') {
            if (isGrid && ['direction', 'justify', 'align'].includes(ctrl.id)) return null;
            if (!isGrid && ctrl.id === 'gridCols') return null;
          }

          const value = activeStyles[ctrl.id] !== undefined ? activeStyles[ctrl.id] : ctrl.defaultValue;

          return (
            <div key={ctrl.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-ink-subtle tracking-mc-eyebrow uppercase">
                  {ctrl.label}
                </label>
                <span className="text-[10px] font-mono text-primary font-bold bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                  {ctrl.type === 'slider' 
                    ? (ctrl.valueMapper ? ctrl.valueMapper(value) : `${ctrl.classPrefix}${value}`)
                    : value
                  }
                </span>
              </div>

              {ctrl.type === 'slider' && (
                <div className="flex items-center gap-3 py-1">
                  <input
                    type="range"
                    min={ctrl.min}
                    max={ctrl.max}
                    step={ctrl.step}
                    value={value}
                    onChange={(e) => onControlChange(ctrl.id, Number(e.target.value))}
                    className="flex-1 h-1 bg-surface-3 rounded-full appearance-none cursor-pointer accent-primary focus:outline-none"
                  />
                </div>
              )}

              {ctrl.type === 'select' && ctrl.options && (
                <select
                  value={value}
                  onChange={(e) => onControlChange(ctrl.id, e.target.value)}
                  className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-3 py-2.5 hover:border-hairline-strong hover:bg-surface-3 focus:border-primary focus:outline-none transition-all cursor-pointer shadow-sm"
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
          className={`${isGrid ? 'grid' : 'flex'} ${compiledClasses} ${category.playground.defaultStyles} bg-grid-pattern relative`}
        >
          {/* Subtle connecting dotted arcs representing Mastercard constellation trajectories */}
          {!isGrid && (
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-16 orbital-arc rounded-t-full pointer-events-none" />
          )}

          <AnimatePresence initial={false}>
            {items.map((num) => (
              <motion.div
                key={num}
                layout
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                className="bg-surface-2 border border-hairline text-ink font-semibold w-14 h-14 rounded-full flex items-center justify-center shadow-sm cursor-default relative z-10"
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

      const paddingList = [0, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96];
      const marginList = [0, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96];

      const pSize = paddingList[paddingVal] !== undefined ? paddingList[paddingVal] : 16;
      const mSize = marginList[marginVal] !== undefined ? marginList[marginVal] : 16;

      return (
        <div className={`${category.playground.defaultStyles} bg-grid-pattern`}>
          {/* DevTools style Margin Box (Signal Orange-tinted area) */}
          <div 
            className="border border-hairline-strong/20 bg-hairline-strong/5 rounded-mc-btn flex items-center justify-center transition-all duration-200"
            style={{ padding: `${mSize}px` }}
          >
            {/* Margin Label */}
            <div className="absolute top-2 left-2 text-[9px] uppercase tracking-wider text-hairline-strong font-bold bg-canvas border border-hairline px-2 py-0.5 rounded-full shadow-sm">
              margin: {mSize}px
            </div>

            {/* DevTools style Padding Box (Light Orange-tinted area) */}
            <div 
              className="bg-primary/5 border border-primary/20 rounded-mc-btn flex items-center justify-center w-full min-h-[100px] transition-all duration-200"
              style={{ padding: `${pSize}px` }}
            >
              {/* Padding Label */}
              <div className="absolute bottom-2 right-2 text-[9px] uppercase tracking-wider text-primary font-bold bg-canvas border border-primary/20 px-2 py-0.5 rounded-full shadow-sm">
                padding: {pSize}px
              </div>

              {/* Inner Content Block */}
              <motion.div 
                layout
                className="w-full bg-primary text-white font-semibold py-3 rounded-mc-btn shadow-sm text-center max-w-xs cursor-default flex justify-center items-center gap-2 border border-primary/10"
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
        <div className={`${category.playground.defaultStyles} bg-grid-pattern`}>
          <div className={`${compiledClasses}`}>
            <h4 className="font-medium text-ink mb-1.5 tracking-mc-head text-lg">
              MarkForMC Geometric Sans
            </h4>
            <p className="text-ink-subtle font-[450] text-xs leading-relaxed max-w-lg">
              Mastercard's typography utilizes geometric shapes and weight 450 for paragraphs. 
              Adding typography utility classes like <code className="text-[11px] text-primary mx-0.5 bg-surface-2 py-0.5 px-1.5 rounded-full border border-hairline">text-2xl</code> 
              or <code className="text-[11px] text-primary mx-0.5 bg-surface-2 py-0.5 px-1.5 rounded-full border border-hairline">tracking-wide</code> 
              instantly manipulates the geometric rhythm. Adjust the controllers to test text variants.
            </p>
          </div>
        </div>
      );
    }

    if (previewType === 'card') {
      return (
        <div className={`${category.playground.defaultStyles} bg-grid-pattern`}>
          <motion.div
            layout
            className={`w-60 bg-surface-2 p-6 flex flex-col items-center text-center transition-all border border-hairline rounded-mc-btn shadow-sm ${compiledClasses}`}
          >
            {/* Circular Portrait with Satellite CTA */}
            <div className="w-20 h-20 rounded-full bg-surface-3 flex items-center justify-center border border-hairline relative mx-auto mb-3">
              <Icons.User className="w-8 h-8 text-ink-subtle" />
              <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white text-ink border border-hairline shadow-md flex items-center justify-center translate-x-1 translate-y-1 hover:scale-110 transition-transform cursor-pointer">
                <Icons.ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <span className="text-[9px] text-primary font-bold tracking-mc-eyebrow uppercase mb-1">
              • SOLUTIONS
            </span>
            <h4 className="text-ink font-semibold text-sm tracking-mc-head">Alex Rivera</h4>
            <p className="text-ink-subtle text-[11px] font-medium uppercase mt-0.5">
              Digital Payments
            </p>
            <p className="text-ink-subtle text-xs mt-2.5 leading-relaxed font-[450]">
              Enjoys constructing fluid interfaces and highly-interactive user experiences.
            </p>
            
            <button className="w-full mt-4 bg-ink hover:bg-ink/95 text-canvas text-xs font-semibold py-2 px-3 rounded-mc-btn shadow-sm transition-all border border-ink">
              Connect
            </button>
          </motion.div>
        </div>
      );
    }

    if (previewType === 'animation') {
      const cleanClasses = compiledClasses.split(' ').map(c => c.trim()).join(' ');

      return (
        <div className={`${category.playground.defaultStyles} bg-grid-pattern`}>
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-24 h-24 bg-surface-2 text-primary rounded-full border border-hairline shadow-sm flex items-center justify-center cursor-pointer transition-all ${cleanClasses}`}
            >
              <Icons.Rocket className="w-10 h-10 text-primary" />
            </div>
            <span className="text-[10px] text-ink-subtle font-medium italic mt-2">
              Hover to trigger scale/rotate transitions
            </span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-surface-1 border border-hairline p-5 rounded-mc-btn flex flex-col lg:flex-row gap-6 shadow-sm relative overflow-hidden">
      {/* Control Panel (Left Side) */}
      <div className="flex-1 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-ink tracking-mc-head flex items-center gap-2 m-0 leading-tight">
            <Icons.Sliders className="w-4 h-4 text-primary" />
            {category.playground.title}
          </h2>
          <p className="text-xs text-ink-subtle mt-1 leading-normal">
            {category.playground.description}
          </p>
        </div>
        <div className="border-t border-hairline pt-4">
          {renderControls()}
        </div>
      </div>

      {/* Live Preview & Output Panel (Right Side) */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Preview Tabs formatted as Mastercard stadium toggle pills */}
        <div className="flex items-center justify-between border-b border-hairline pb-2">
          <div className="bg-canvas border border-hairline p-0.5 rounded-full flex">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-1 rounded-full text-[11px] font-medium transition-all ${
                activeTab === 'preview'
                  ? 'bg-surface-2 text-ink border border-hairline-strong shadow-sm'
                  : 'text-ink-subtle hover:text-ink'
              }`}
            >
              Live Component
            </button>
            <button
              onClick={() => setActiveTab('react')}
              className={`px-4 py-1 rounded-full text-[11px] font-medium transition-all ${
                activeTab === 'react'
                  ? 'bg-surface-2 text-ink border border-hairline-strong shadow-sm'
                  : 'text-ink-subtle hover:text-ink'
              }`}
            >
              React TSX
            </button>
          </div>
          {activeTab === 'react' && (
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-[10px] text-primary hover:text-primary-hover font-semibold transition-all bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10"
            >
              {copiedCode ? (
                <>
                  <Icons.Check className="w-3 h-3 text-semantic-success" />
                  <span className="text-semantic-success">Copied!</span>
                </>
              ) : (
                <>
                  <Icons.Copy className="w-3 h-3" />
                  <span>Copy TSX</span>
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
            <div className="bg-canvas p-4 rounded-mc-btn border border-hairline overflow-x-auto text-[11px] font-mono text-primary whitespace-pre-wrap leading-relaxed select-all">
              {getReactTSCode()}
            </div>
          )}
        </div>

        {/* Classes Bar */}
        <div className="p-3 bg-surface-2 rounded-mc-btn border border-hairline flex items-center justify-between shadow-sm">
          <div className="flex-1 min-w-0 pr-3">
            <span className="text-[9px] text-ink-subtle uppercase tracking-wider font-bold">
              Applied Tailwind Classes
            </span>
            <div className="text-xs font-mono text-primary truncate mt-1 select-all font-semibold">
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
            className="p-1.5 rounded-full bg-surface-3 border border-hairline text-ink-subtle hover:text-ink hover:border-hairline-strong transition-all flex-shrink-0"
          >
            <Icons.Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
