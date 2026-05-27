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
        childrenJSX += `\n        <div className="bg-surface-2 border border-hairline text-ink font-medium p-6 rounded-md shadow-sm flex items-center justify-center min-w-14 h-14">\n          ${i}\n        </div>`;
      }
      return `import React from 'react';\n\nexport const FlexLayout: React.FC = () => {\n  return (\n    <div className="${isGrid ? 'grid' : 'flex'} ${compiledClasses}">${childrenJSX}\n    </div>\n  );\n};`;
    }

    if (previewType === 'box') {
      return `import React from 'react';\nimport { Box } from 'lucide-react';\n\nexport const SpacingBox: React.FC = () => {\n  return (\n    <div className="bg-primary text-white font-medium px-4 py-2 rounded-md shadow-sm ${compiledClasses}">\n      Spacing Element\n    </div>\n  );\n};`;
    }

    if (previewType === 'text') {
      const alignVal = activeStyles['align'] !== undefined ? activeStyles['align'] : 'text-center';
      const marginClass = alignVal === 'text-center' ? 'mx-auto' : alignVal === 'text-right' ? 'ml-auto' : '';
      const marginStr = marginClass ? ` ${marginClass}` : '';
      
      const sizeVal = activeStyles['size'] !== undefined ? activeStyles['size'] : 'text-xl';
      const weightVal = activeStyles['weight'] !== undefined ? activeStyles['weight'] : 'font-normal';
      const leadingVal = activeStyles['leading'] !== undefined ? activeStyles['leading'] : 'leading-normal';
      const trackingVal = activeStyles['tracking'] !== undefined ? activeStyles['tracking'] : 'tracking-normal';
      const colorVal = activeStyles['color'] !== undefined ? activeStyles['color'] : 'text-indigo-400';
      const decorationVal = activeStyles['decoration'] !== undefined ? activeStyles['decoration'] : 'no-underline';

      const pClasses = `${sizeVal} ${weightVal} ${leadingVal} ${trackingVal} ${colorVal} ${decorationVal} max-w-lg${marginStr}`;

      return `import React from 'react';\n\nexport const Typography: React.FC = () => {\n  return (\n    <div className="${alignVal}">\n      <h4 className="font-bold text-ink mb-1.5 tracking-tight text-lg">MarkForMC</h4>\n      <p className="${pClasses}">\n        Mastercard's editorial typography is set in MarkForMC, a custom geometric sans. Headlines use a tight -2% letter spacing, while body text features a signature 450 weight for a soft, premium reading experience.\n      </p>\n    </div>\n  );\n};`;
    }

    if (previewType === 'card') {
      const hasRoundedControl = category.playground.controls.some(c => c.id === 'rounded');
      const hasBorderWidthControl = category.playground.controls.some(c => c.id === 'borderWidth');
      const hasShadowControl = category.playground.controls.some(c => c.id === 'shadow');

      const roundedClass = hasRoundedControl ? '' : ' rounded-lg';
      const borderClass = hasBorderWidthControl ? '' : ' border border-hairline';
      const shadowClass = hasShadowControl ? '' : ' shadow-sm';

      return `import React from 'react';\nimport { User } from 'lucide-react';\n\nexport const ProfileCard: React.FC = () => {\n  return (\n    <div className="w-60 bg-surface-2 p-6 flex flex-col items-center text-center lifted-edge${roundedClass}${borderClass}${shadowClass} ${compiledClasses}">\n      <div className="w-10 h-10 rounded-full bg-surface-3 flex items-center justify-center shadow-sm border border-hairline mb-3">\n        <User className="w-5 h-5 text-ink-muted" />\n      </div>\n      <h4 className="text-ink font-semibold text-sm">Alex Rivera</h4>\n      <p className="text-primary text-[10px] font-semibold uppercase tracking-wider mt-0.5">Frontend Engineer</p>\n      <p className="text-ink-subtle text-xs mt-2.5 leading-relaxed">Enjoys constructing fluid interfaces and highly-interactive user experiences.</p>\n      <button className="w-full mt-4 bg-primary hover:bg-primary-hover text-white text-xs font-semibold py-1.5 px-3 rounded-md shadow-sm transition-all">\n        Connect\n      </button>\n    </div>\n  );\n};`;
    }

    if (previewType === 'animation') {
      const cleanClasses = compiledClasses.split(' ').map(c => c.trim()).join(' ');
      return `import React from 'react';\nimport { Rocket } from 'lucide-react';\n\nexport const AnimatedRocket: React.FC = () => {\n  return (\n    <div className="w-24 h-24 bg-surface-2 text-primary rounded-lg border border-hairline shadow-sm flex items-center justify-center cursor-pointer transition-all lifted-edge ${cleanClasses}">\n      <Rocket className="w-10 h-10 text-primary" />\n    </div>\n  );\n};`;
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
                <label className="text-[10px] font-semibold text-ink-subtle tracking-wider uppercase">
                  {ctrl.label}
                </label>
                <span className="text-[10px] font-mono text-primary font-medium bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">
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
                    className="flex-1 h-1 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                  />
                </div>
              )}

              {ctrl.type === 'select' && ctrl.options && (
                <select
                  value={value}
                  onChange={(e) => onControlChange(ctrl.id, e.target.value)}
                  className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-md px-3 py-2 hover:border-hairline-strong hover:bg-surface-3 focus:border-primary-focus focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer"
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
          className={`${isGrid ? 'grid' : 'flex'} ${compiledClasses} ${category.playground.defaultStyles} bg-grid-pattern`}
        >
          <AnimatePresence initial={false}>
            {items.map((num) => (
              <motion.div
                key={num}
                layout
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="bg-surface-2 border border-hairline text-ink font-medium w-14 h-14 rounded-md flex items-center justify-center shadow-sm lifted-edge cursor-default"
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
          {/* DevTools style Margin Box (Orange-tinted area) */}
          <div 
            className="border border-orange-500/20 bg-orange-500/5 rounded-md flex items-center justify-center transition-all duration-200"
            style={{ padding: `${mSize}px` }}
          >
            {/* Margin Label */}
            <div className="absolute top-2 left-2 text-[9px] uppercase tracking-wider text-orange-400 font-bold bg-canvas border border-orange-500/25 px-1.5 py-0.5 rounded shadow-sm">
              margin: {mSize}px
            </div>

            {/* DevTools style Padding Box (Green-tinted area) */}
            <div 
              className="bg-emerald-500/5 border border-emerald-500/20 rounded-md flex items-center justify-center w-full min-h-[100px] transition-all duration-200"
              style={{ padding: `${pSize}px` }}
            >
              {/* Padding Label */}
              <div className="absolute bottom-2 right-2 text-[9px] uppercase tracking-wider text-emerald-400 font-bold bg-canvas border border-emerald-500/25 px-1.5 py-0.5 rounded shadow-sm">
                padding: {pSize}px
              </div>

              {/* Inner Content Block */}
              <motion.div 
                layout
                className="w-full bg-primary text-white font-medium py-3 rounded-md shadow-sm text-center max-w-xs cursor-default flex justify-center items-center gap-2 border border-primary-hover/20 lifted-edge"
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
      const alignVal = activeStyles['align'] !== undefined ? activeStyles['align'] : 'text-center';
      const marginClass = alignVal === 'text-center' ? 'mx-auto' : alignVal === 'text-right' ? 'ml-auto' : '';

      const sizeVal = activeStyles['size'] !== undefined ? activeStyles['size'] : 'text-xl';
      const weightVal = activeStyles['weight'] !== undefined ? activeStyles['weight'] : 'font-normal';
      const leadingVal = activeStyles['leading'] !== undefined ? activeStyles['leading'] : 'leading-normal';
      const trackingVal = activeStyles['tracking'] !== undefined ? activeStyles['tracking'] : 'tracking-normal';
      const colorVal = activeStyles['color'] !== undefined ? activeStyles['color'] : 'text-indigo-400';
      const decorationVal = activeStyles['decoration'] !== undefined ? activeStyles['decoration'] : 'no-underline';

      return (
        <div className={`${category.playground.defaultStyles} bg-grid-pattern`}>
          <div className={`${alignVal}`}>
            <h4 className="font-semibold text-ink mb-1.5 tracking-tight text-lg">
              MarkForMC
            </h4>
            <p className={`max-w-lg ${marginClass} ${sizeVal} ${weightVal} ${leadingVal} ${trackingVal} ${colorVal} ${decorationVal}`}>
              Mastercard's editorial typography is set in MarkForMC, a custom geometric sans. 
              Applying classes like <code className="text-[11px] text-primary mx-0.5 bg-surface-2 py-0.5 px-1.5 rounded border border-hairline">text-2xl</code> 
              and <code className="text-[11px] text-primary mx-0.5 bg-surface-2 py-0.5 px-1.5 rounded border border-hairline">leading-relaxed</code> 
              alters letter tracking and line heights immediately. Slide the controls to adjust text behaviors.
            </p>
          </div>
        </div>
      );
    }

    if (previewType === 'card') {
      const hasRoundedControl = category.playground.controls.some(c => c.id === 'rounded');
      const hasBorderWidthControl = category.playground.controls.some(c => c.id === 'borderWidth');
      const hasShadowControl = category.playground.controls.some(c => c.id === 'shadow');

      const roundedClass = hasRoundedControl ? '' : 'rounded-lg';
      const borderClass = hasBorderWidthControl ? '' : 'border border-hairline';
      const shadowClass = hasShadowControl ? '' : 'shadow-sm';

      return (
        <div className={`${category.playground.defaultStyles} bg-grid-pattern`}>
          <motion.div
            layout
            className={`w-60 bg-surface-2 p-6 flex flex-col items-center text-center transition-all lifted-edge ${roundedClass} ${borderClass} ${shadowClass} ${compiledClasses}`}
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-surface-3 flex items-center justify-center shadow-sm border border-hairline mb-3">
              <Icons.User className="w-5 h-5 text-ink-muted" />
            </div>
            
            <h4 className="text-ink font-semibold text-sm">Alex Rivera</h4>
            <p className="text-primary text-[10px] font-semibold uppercase tracking-wider mt-0.5">
              Frontend Engineer
            </p>
            <p className="text-ink-subtle text-xs mt-2.5 leading-relaxed">
              Enjoys constructing fluid interfaces and highly-interactive user experiences.
            </p>
            
            <button className="w-full mt-4 bg-primary hover:bg-primary-hover text-white text-xs font-semibold py-1.5 px-3 rounded-md shadow-sm transition-all">
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
              className={`w-24 h-24 bg-surface-2 text-primary rounded-lg border border-hairline shadow-sm flex items-center justify-center cursor-pointer transition-all lifted-edge ${cleanClasses}`}
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
    <div className="bg-surface-1 border border-hairline p-5 rounded-lg flex flex-col lg:flex-row gap-6 shadow-sm relative overflow-hidden lifted-edge">
      {/* Control Panel (Left Side) */}
      <div className="flex-1 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-ink tracking-subhead flex items-center gap-2 m-0 leading-tight">
            <Icons.Sliders className="w-4 h-4 text-primary" />
            {category.playground.title}
          </h2>
          {category.playground.description && (
            <p className="text-xs text-ink-subtle mt-1 leading-normal">
              {category.playground.description}
            </p>
          )}
        </div>
        <div className="border-t border-hairline pt-4">
          {renderControls()}
        </div>
      </div>

      {/* Live Preview & Output Panel (Right Side) */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Preview Tabs formatted as Linear toggle pills */}
        <div className="flex items-center justify-between border-b border-hairline pb-2">
          <div className="bg-canvas border border-hairline p-0.5 rounded-md flex">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-sm text-[11px] font-medium transition-all ${
                activeTab === 'preview'
                  ? 'bg-surface-2 text-ink border border-hairline-strong shadow-sm lifted-edge'
                  : 'text-ink-subtle hover:text-ink'
              }`}
            >
              Live Component
            </button>
            <button
              onClick={() => setActiveTab('react')}
              className={`px-3 py-1 rounded-sm text-[11px] font-medium transition-all ${
                activeTab === 'react'
                  ? 'bg-surface-2 text-ink border border-hairline-strong shadow-sm lifted-edge'
                  : 'text-ink-subtle hover:text-ink'
              }`}
            >
              React TSX
            </button>
          </div>
          {activeTab === 'react' && (
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-[10px] text-primary hover:text-primary-hover font-semibold transition-all bg-primary/5 px-2.5 py-1 rounded-md border border-primary/10"
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
            <div className="bg-canvas p-4 rounded-md border border-hairline overflow-x-auto text-[11px] font-mono text-primary whitespace-pre-wrap leading-relaxed select-all">
              {getReactTSCode()}
            </div>
          )}
        </div>

        {/* Classes Bar */}
        <div className="p-3 bg-surface-2 rounded-md border border-hairline flex items-center justify-between shadow-sm lifted-edge">
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
            className="p-1.5 rounded-md bg-surface-3 border border-hairline text-ink-subtle hover:text-ink hover:border-hairline-strong transition-all flex-shrink-0"
          >
            <Icons.Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
