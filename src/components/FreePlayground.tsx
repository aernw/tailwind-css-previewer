import React, { useState, useRef } from 'react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ComponentTemplate = 'button' | 'card' | 'text' | 'container';

interface FreePlaygroundProps {
  onExit: () => void;
}

export const FreePlayground: React.FC<FreePlaygroundProps> = ({ onExit }) => {
  const [activeTemplate, setActiveTemplate] = useState<ComponentTemplate>('card');
  const [activeTab, setActiveTab] = useState<'preview' | 'react'>('preview');
  const [copiedCode, setCopiedCode] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const constraintsRef = useRef<HTMLDivElement>(null);

  // Floating panels visibility
  const [visiblePanels, setVisiblePanels] = useState<Record<string, boolean>>({
    template: true,
    layout: true,
    spacing: true,
    typography: true,
    borders: true,
    transforms: false,
    animations: false,
    inspector: true,
  });

  // Floating panels minimization
  const [minimizedPanels, setMinimizedPanels] = useState<Record<string, boolean>>({
    template: false,
    layout: false,
    spacing: false,
    typography: false,
    borders: false,
    transforms: false,
    animations: false,
    inspector: false,
  });

  // Unified State for all Tailwind Categories
  const [state, setState] = useState({
    // Layout
    display: 'flex',
    direction: 'flex-col',
    justify: 'justify-center',
    align: 'items-center',
    gap: 4, // index
    gridCols: 'grid-cols-3',
    itemsCount: 3,

    // Spacing
    padding: 6, // index (p-8 equivalent)
    margin: 0, // index (m-0 equivalent)

    // Typography
    size: 'text-base',
    weight: 'font-normal',
    textAlign: 'text-center',
    leading: 'leading-relaxed',
    tracking: 'tracking-normal',
    textColor: 'text-ink',
    decoration: 'no-underline',

    // Borders & Shadows
    rounded: 'rounded-mc-card',
    borderWidth: 'border',
    borderColor: 'border-hairline',
    shadow: 'shadow-md',
    shadowColor: 'shadow-indigo-500/10',
    opacity: 4, // index (opacity-100)

    // Transforms & Filters
    scale: 3, // index (scale-100)
    rotate: 3, // index (rotate-0)
    translate: 3, // index (translate-x-0)
    blur: 0, // index (blur-none)
    brightness: 2, // index (brightness-100)

    // Transitions & Animations
    animation: 'animate-none',
    duration: 'duration-300',
    ease: 'ease-in-out',
    hoverScale: 'hover:scale-105',
    hoverRotate: 'hover:rotate-0',
  });

  const handleControlChange = (controlId: string, value: any) => {
    setState((prev) => ({ ...prev, [controlId]: value }));
  };

  // Helper Mappers matching tailwindData.ts configuration
  const getGapClass = (val: number) => {
    const gaps = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16];
    return `gap-${gaps[val] !== undefined ? gaps[val] : 4}`;
  };

  const getPaddingClass = (val: number) => {
    const paddings = [0, 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24];
    return `p-${paddings[val] !== undefined ? paddings[val] : 6}`;
  };

  const getMarginClass = (val: number) => {
    const margins = [0, 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24];
    return `m-${margins[val] !== undefined ? margins[val] : 0}`;
  };

  const getOpacityClass = (val: number) => {
    const opacities = ['opacity-25', 'opacity-50', 'opacity-75', 'opacity-90', 'opacity-100'];
    return opacities[val] || 'opacity-100';
  };

  const getScaleClass = (val: number) => {
    const scales = ['scale-50', 'scale-75', 'scale-90', 'scale-100', 'scale-110', 'scale-125'];
    return scales[val] || 'scale-100';
  };

  const getRotateClass = (val: number) => {
    const degrees = ['-rotate-90', '-rotate-45', '-rotate-12', 'rotate-0', 'rotate-12', 'rotate-45', 'rotate-90'];
    return degrees[val] || 'rotate-0';
  };

  const getTranslateClass = (val: number) => {
    const offsets = ['-translate-x-12', '-translate-x-6', '-translate-x-2', 'translate-x-0', 'translate-x-2', 'translate-x-6', 'translate-x-12'];
    return offsets[val] || 'translate-x-0';
  };

  const getBlurClass = (val: number) => {
    const blurs = ['blur-none', 'blur-sm', 'blur', 'blur-md', 'blur-lg'];
    return blurs[val] || 'blur-none';
  };

  const getBrightnessClass = (val: number) => {
    const brights = ['brightness-50', 'brightness-75', 'brightness-100', 'brightness-125', 'brightness-150'];
    return brights[val] || 'brightness-100';
  };

  // Compile classes based on active template targeting
  const getCompiledClassList = (target: 'container' | 'typography') => {
    const classes: string[] = [];

    if (target === 'container') {
      // Layout (Only applies to containers)
      if (activeTemplate !== 'button') {
        const isGrid = state.display === 'grid';
        classes.push(state.display);
        if (isGrid) {
          classes.push(state.gridCols);
        } else {
          classes.push(state.direction);
        }
        classes.push(state.justify);
        classes.push(state.align);
        classes.push(getGapClass(state.gap));
      }

      // Spacing
      classes.push(getPaddingClass(state.padding));
      classes.push(getMarginClass(state.margin));

      // Borders
      classes.push(state.rounded);
      if (state.borderWidth !== 'border-0') {
        classes.push(state.borderWidth);
        classes.push(state.borderColor);
      }

      // Shadows & Opacity
      if (state.shadow !== 'shadow-none') {
        classes.push(state.shadow);
        if (state.shadowColor !== 'shadow-none') {
          classes.push(state.shadowColor);
        }
      }
      classes.push(getOpacityClass(state.opacity));

      // Transforms & Filters
      const scaleCls = getScaleClass(state.scale);
      const rotateCls = getRotateClass(state.rotate);
      const transCls = getTranslateClass(state.translate);
      const blurCls = getBlurClass(state.blur);
      const brightCls = getBrightnessClass(state.brightness);

      if (scaleCls !== 'scale-100') classes.push(scaleCls);
      if (rotateCls !== 'rotate-0') classes.push(rotateCls);
      if (transCls !== 'translate-x-0') classes.push(transCls);
      if (blurCls !== 'blur-none') classes.push(blurCls);
      if (brightCls !== 'brightness-100') classes.push(brightCls);

      // Transitions & Animations
      if (state.animation !== 'animate-none') classes.push(state.animation);
      classes.push('transition-all');
      classes.push(state.duration);
      classes.push(state.ease);
      if (state.hoverScale !== 'hover:scale-100') classes.push(state.hoverScale);
      if (state.hoverRotate !== 'hover:rotate-0') classes.push(state.hoverRotate);

      // If button, add typography classes directly to container (which is the button itself)
      if (activeTemplate === 'button') {
        classes.push(state.size);
        classes.push(state.weight);
        classes.push(state.textAlign);
        classes.push(state.leading);
        classes.push(state.tracking);
        classes.push(state.textColor);
        if (state.decoration !== 'no-underline') classes.push(state.decoration);
      }
    }

    if (target === 'typography') {
      // Typography elements inside Card or Text templates
      classes.push(state.size);
      classes.push(state.weight);
      classes.push(state.textAlign);
      classes.push(state.leading);
      classes.push(state.tracking);
      classes.push(state.textColor);
      if (state.decoration !== 'no-underline') classes.push(state.decoration);
    }

    return classes.filter(Boolean).join(' ');
  };

  const containerClasses = getCompiledClassList('container');
  const typographyClasses = getCompiledClassList('typography');

  const getReactTSCode = () => {
    if (activeTemplate === 'button') {
      return `import React from 'react';\n\nexport const CustomButton: React.FC = () => {\n  return (\n    <button className="${containerClasses}">\n      Explore Services\n    </button>\n  );\n};`;
    }

    if (activeTemplate === 'card') {
      return `import React from 'react';\nimport { CreditCard } from 'lucide-react';\n\nexport const CustomCard: React.FC = () => {\n  return (\n    <div className="${containerClasses}">\n      {/* Card Header Icon */}\n      <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">\n        <CreditCard className="w-6 h-6 text-primary" />\n      </div>\n      \n      {/* Typography Content */}\n      <div className="${state.textAlign}">\n        <h4 className="font-semibold text-ink tracking-tight mb-2 text-lg">Priceless Innovation</h4>\n        <p className="${typographyClasses}">\n          Experience custom financial options built upon secure infrastructure. Secure your assets with geometric confidence.\n        </p>\n      </div>\n    </div>\n  );\n};`;
    }

    if (activeTemplate === 'text') {
      return `import React from 'react';\n\nexport const CustomText: React.FC = () => {\n  return (\n    <div className="${state.textAlign}">\n      <h3 className="font-bold text-ink mb-3 tracking-tight text-2xl">MarkForMC Editorial</h3>\n      <p className="${typographyClasses}">\n        Tailwind CSS lets you build modern responsive layout components rapidly. Tweak letter tracking, font weight, line heights, and custom text colors to customize paragraphs for high-fidelity brand displays.\n      </p>\n    </div>\n  );\n};`;
    }

    // container
    const count = state.itemsCount;
    let itemsMarkup = '';
    for (let i = 1; i <= count; i++) {
      itemsMarkup += `\n        <div className="bg-surface-2 border border-hairline text-ink font-semibold w-16 h-16 rounded-full flex items-center justify-center shadow-sm hover:scale-115 transition-all cursor-default">\n          ${i}\n        </div>`;
    }
    return `import React from 'react';\n\nexport const CustomContainer: React.FC = () => {\n  return (\n    <div className="${containerClasses}">${itemsMarkup}\n    </div>\n  );\n};`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getReactTSCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Render visual representations
  const renderVisualComponent = () => {
    if (activeTemplate === 'button') {
      return (
        <button className={`${containerClasses} cursor-pointer`}>
          Explore Services
        </button>
      );
    }

    if (activeTemplate === 'card') {
      return (
        <motion.div layout className={`w-80 bg-surface-2 ${containerClasses}`}>
          {/* Card Icon */}
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Icons.CreditCard className="w-5 h-5 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-ink text-base tracking-tight">
              Priceless Innovation
            </h4>
            <p className={`${typographyClasses} max-w-xs`}>
              Experience custom financial options built upon secure infrastructure. Secure your assets with geometric confidence.
            </p>
          </div>
        </motion.div>
      );
    }

    if (activeTemplate === 'text') {
      const alignVal = state.textAlign;
      const isCentered = alignVal === 'text-center';
      const isRight = alignVal === 'text-right';
      const marginClass = isCentered ? 'mx-auto' : isRight ? 'ml-auto' : '';

      return (
        <div className={`w-full ${alignVal}`}>
          <h3 className="font-semibold text-ink mb-3 tracking-mc-head text-2xl">
            MarkForMC Editorial
          </h3>
          <p className={`${typographyClasses} max-w-xl ${marginClass}`}>
            Tailwind CSS lets you build modern responsive layout components rapidly. Tweak letter tracking, font weight, line heights, and custom text colors to customize paragraphs for high-fidelity brand displays.
          </p>
        </div>
      );
    }

    // container
    const children = Array.from({ length: state.itemsCount }, (_, i) => i + 1);
    return (
      <motion.div layout className={`w-full ${containerClasses}`}>
        <AnimatePresence initial={false}>
          {children.map((num) => (
            <motion.div
              key={num}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-surface-2 border border-hairline text-ink font-semibold w-16 h-16 rounded-full flex items-center justify-center shadow-sm hover:scale-115 transition-all cursor-default"
            >
              {num}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Toggle Visibility of panels
  const togglePanelVisibility = (id: string) => {
    setVisiblePanels(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle Minimized state of panels
  const togglePanelMinimized = (id: string) => {
    setMinimizedPanels(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Close specific panel
  const closePanel = (id: string) => {
    setVisiblePanels(prev => ({ ...prev, [id]: false }));
  };

  // Snap panels back to default positions
  const resetLayoutCoordinates = () => {
    setResetKey(prev => prev + 1);
  };

  // Default coordinate properties for floating widgets
  const defaultPositions: Record<string, { top?: string; left?: string; right?: string; bottom?: string }> = {
    template: { top: '24px', left: '260px' },
    layout: { top: '96px', left: '24px' },
    spacing: { top: '430px', left: '24px' },
    typography: { top: '24px', right: '24px' },
    borders: { top: '440px', right: '24px' },
    transforms: { top: '160px', left: '310px' },
    animations: { top: '160px', right: '310px' },
    inspector: { bottom: '110px', right: '300px' },
  };

  // Render draggable floating panel
  const renderFloatingPanel = (id: string, title: string, content: React.ReactNode, widthClass: string = 'w-64') => {
    if (!visiblePanels[id]) return null;
    const isMinimized = minimizedPanels[id];

    return (
      <motion.div
        key={`${id}-${resetKey}`}
        drag
        dragConstraints={constraintsRef}
        dragMomentum={false}
        dragElastic={0}
        whileDrag={{ scale: 1.02, rotate: 0.5, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)', zIndex: 50 }}
        style={{
          position: 'absolute',
          ...defaultPositions[id]
        }}
        className={`${widthClass} bg-surface-2/95 border border-hairline rounded-lg shadow-lg flex flex-col figma-panel backdrop-blur-md overflow-hidden z-20`}
      >
        {/* Drag Handle Header */}
        <div className="px-3 py-2 bg-surface-3/50 border-b border-hairline flex items-center justify-between cursor-grab active:cursor-grabbing">
          <div className="flex items-center gap-2 pr-4 min-w-0 flex-1">
            <Icons.GripHorizontal className="w-3.5 h-3.5 text-ink-subtle flex-shrink-0" />
            <span className="text-[9px] font-bold text-ink tracking-mc-eyebrow uppercase truncate">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => togglePanelMinimized(id)}
              title={isMinimized ? 'Expand' : 'Collapse'}
              className="p-0.5 text-ink-subtle hover:text-ink hover:bg-surface-4 rounded transition-colors cursor-pointer"
            >
              {isMinimized ? <Icons.ChevronDown className="w-3 h-3" /> : <Icons.Minus className="w-3 h-3" />}
            </button>
            <button
              onClick={() => closePanel(id)}
              title="Close"
              className="p-0.5 text-ink-subtle hover:text-ink hover:bg-surface-4 rounded transition-colors cursor-pointer"
            >
              <Icons.X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Panel Content body */}
        {!isMinimized && (
          <div className="p-4 space-y-4 max-h-[280px] overflow-y-auto scrollbar-thin text-xs text-ink">
            {content}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div ref={constraintsRef} className="w-full h-full relative overflow-hidden select-none figma-grid">
      <style>{`
        .figma-grid {
          background-color: var(--color-canvas);
          background-image: radial-gradient(circle, var(--color-hairline-strong) 1.2px, transparent 1.2px);
          background-size: 20px 20px;
        }
        .figma-panel {
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        .dark .figma-panel {
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      {/* 1. Exit Action Button (Floating Top Left) */}
      <button
        onClick={onExit}
        className="absolute top-6 left-6 z-30 bg-surface-2 hover:bg-surface-3 text-ink border border-hairline hover:border-hairline-strong px-4 py-2.5 rounded-mc-btn flex items-center gap-2 text-xs font-semibold shadow-md cursor-pointer transition-all active:scale-95"
      >
        <Icons.ArrowLeft className="w-4 h-4 text-primary" />
        <span>Exit Figma Mode</span>
      </button>

      {/* 2. Central Figma Frame Wrapper */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
        {/* Figma Canvas Label */}
        <div className="relative border-2 border-primary/30 p-12 bg-surface-1/30 rounded-2xl flex items-center justify-center min-h-[360px] min-w-[480px]">
          {/* Frame Label Tag */}
          <div className="absolute -top-3.5 left-4 bg-primary text-white text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider select-none shadow-sm flex items-center gap-1">
            <Icons.Layers className="w-2.5 h-2.5" />
            <span>Frame 1 / {activeTemplate}</span>
          </div>

          {/* Decorative Corner Handles */}
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-primary rounded-sm shadow-sm" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-primary rounded-sm shadow-sm" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-primary rounded-sm shadow-sm" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-primary rounded-sm shadow-sm" />

          {/* Render Actual Visual Element */}
          <div className="flex items-center justify-center p-4">
            {renderVisualComponent()}
          </div>
        </div>
        <span className="text-[10px] text-ink-subtle font-medium italic mt-3 select-none">
          Active Preview Element (Styled in Real-Time)
        </span>
      </div>

      {/* 3. Floating Draggable Control Panels */}

      {/* Panel: Template Selector */}
      {renderFloatingPanel('template', 'Template Selector', (
        <div className="space-y-2">
          <span className="text-[8px] text-ink-subtle uppercase tracking-wider font-bold block mb-1">Select Base Element</span>
          <div className="bg-canvas border border-hairline p-0.5 rounded-md flex flex-col gap-0.5">
            <button
              onClick={() => setActiveTemplate('card')}
              className={`w-full px-3 py-1.5 rounded-mc-btn text-[10px] font-semibold transition-all text-left cursor-pointer flex items-center justify-between ${
                activeTemplate === 'card' ? 'bg-surface-2 text-ink border border-hairline-strong shadow-sm' : 'text-ink-subtle hover:text-ink'
              }`}
            >
              <span>Profile Card</span>
              <Icons.User className="w-3.5 h-3.5 text-primary/80" />
            </button>
            <button
              onClick={() => setActiveTemplate('button')}
              className={`w-full px-3 py-1.5 rounded-mc-btn text-[10px] font-semibold transition-all text-left cursor-pointer flex items-center justify-between ${
                activeTemplate === 'button' ? 'bg-surface-2 text-ink border border-hairline-strong shadow-sm' : 'text-ink-subtle hover:text-ink'
              }`}
            >
              <span>Pill Button</span>
              <Icons.RectangleHorizontal className="w-3.5 h-3.5 text-primary/80" />
            </button>
            <button
              onClick={() => setActiveTemplate('text')}
              className={`w-full px-3 py-1.5 rounded-mc-btn text-[10px] font-semibold transition-all text-left cursor-pointer flex items-center justify-between ${
                activeTemplate === 'text' ? 'bg-surface-2 text-ink border border-hairline-strong shadow-sm' : 'text-ink-subtle hover:text-ink'
              }`}
            >
              <span>Text Block</span>
              <Icons.Type className="w-3.5 h-3.5 text-primary/80" />
            </button>
            <button
              onClick={() => setActiveTemplate('container')}
              className={`w-full px-3 py-1.5 rounded-mc-btn text-[10px] font-semibold transition-all text-left cursor-pointer flex items-center justify-between ${
                activeTemplate === 'container' ? 'bg-surface-2 text-ink border border-hairline-strong shadow-sm' : 'text-ink-subtle hover:text-ink'
              }`}
            >
              <span>Flex Container</span>
              <Icons.LayoutGrid className="w-3.5 h-3.5 text-primary/80" />
            </button>
          </div>
        </div>
      ), 'w-48')}

      {/* Panel: Layout */}
      {renderFloatingPanel('layout', '1. Layout Settings', (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Display Mode</label>
            <select
              value={state.display}
              onChange={(e) => handleControlChange('display', e.target.value)}
              className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-2 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="flex">Flexbox</option>
              <option value="grid">Grid</option>
            </select>
          </div>

          {state.display === 'flex' ? (
            <>
              <div className="space-y-1.5">
                <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Flex Direction</label>
                <select
                  value={state.direction}
                  onChange={(e) => handleControlChange('direction', e.target.value)}
                  className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-2 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="flex-row">Row</option>
                  <option value="flex-col">Column</option>
                  <option value="flex-row-reverse">Row Reverse</option>
                  <option value="flex-col-reverse">Column Reverse</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Justify Content</label>
                <select
                  value={state.justify}
                  onChange={(e) => handleControlChange('justify', e.target.value)}
                  className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-2 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="justify-start">Start</option>
                  <option value="justify-center">Center</option>
                  <option value="justify-end">End</option>
                  <option value="justify-between">Space Between</option>
                  <option value="justify-around">Space Around</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Align Items</label>
                <select
                  value={state.align}
                  onChange={(e) => handleControlChange('align', e.target.value)}
                  className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-2 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="items-stretch">Stretch</option>
                  <option value="items-start">Start</option>
                  <option value="items-center">Center</option>
                  <option value="items-end">End</option>
                </select>
              </div>
            </>
          ) : (
            <div className="space-y-1.5">
              <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Grid Columns</label>
              <select
                value={state.gridCols}
                onChange={(e) => handleControlChange('gridCols', e.target.value)}
                className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-2 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="grid-cols-1">1 Column</option>
                <option value="grid-cols-2">2 Columns</option>
                <option value="grid-cols-3">3 Columns</option>
                <option value="grid-cols-4">4 Columns</option>
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Gap</label>
              <span className="text-[9px] font-mono text-primary font-bold">{getGapClass(state.gap)}</span>
            </div>
            <input
              type="range" min="0" max="10" step="1"
              value={state.gap}
              onChange={(e) => handleControlChange('gap', Number(e.target.value))}
              className="w-full h-1 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
            />
          </div>

          {activeTemplate === 'container' && (
            <div className="space-y-1.5 border-t border-hairline pt-3">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Child Count</label>
                <span className="text-[9px] font-mono text-primary font-bold">{state.itemsCount} Items</span>
              </div>
              <input
                type="range" min="2" max="6" step="1"
                value={state.itemsCount}
                onChange={(e) => handleControlChange('itemsCount', Number(e.target.value))}
                className="w-full h-1 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
              />
            </div>
          )}
        </div>
      ))}

      {/* Panel: Spacing */}
      {renderFloatingPanel('spacing', '2. Spacing (P & M)', (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Padding</label>
              <span className="text-[9px] font-mono text-primary font-bold">{getPaddingClass(state.padding)}</span>
            </div>
            <input
              type="range" min="0" max="11" step="1"
              value={state.padding}
              onChange={(e) => handleControlChange('padding', Number(e.target.value))}
              className="w-full h-1 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Margin</label>
              <span className="text-[9px] font-mono text-primary font-bold">{getMarginClass(state.margin)}</span>
            </div>
            <input
              type="range" min="0" max="11" step="1"
              value={state.margin}
              onChange={(e) => handleControlChange('margin', Number(e.target.value))}
              className="w-full h-1 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
            />
          </div>
        </div>
      ))}

      {/* Panel: Typography */}
      {renderFloatingPanel('typography', '3. Typography', (
        <div className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Size</label>
            <select
              value={state.size}
              onChange={(e) => handleControlChange('size', e.target.value)}
              className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="text-xs">Extra Small (text-xs)</option>
              <option value="text-sm">Small (text-sm)</option>
              <option value="text-base">Base (text-base)</option>
              <option value="text-lg">Large (text-lg)</option>
              <option value="text-xl">Extra Large (text-xl)</option>
              <option value="text-2xl">2XL (text-2xl)</option>
              <option value="text-4xl">4XL (text-4xl)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Weight</label>
            <select
              value={state.weight}
              onChange={(e) => handleControlChange('weight', e.target.value)}
              className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="font-light">Light</option>
              <option value="font-normal">Normal</option>
              <option value="font-medium">Medium</option>
              <option value="font-semibold">Semibold</option>
              <option value="font-bold">Bold</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Align</label>
            <select
              value={state.textAlign}
              onChange={(e) => handleControlChange('textAlign', e.target.value)}
              className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="text-left">Left</option>
              <option value="text-center">Center</option>
              <option value="text-right">Right</option>
              <option value="text-justify">Justify</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Leading</label>
            <select
              value={state.leading}
              onChange={(e) => handleControlChange('leading', e.target.value)}
              className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="leading-none">None</option>
              <option value="leading-tight">Tight</option>
              <option value="leading-normal">Normal</option>
              <option value="leading-relaxed">Relaxed</option>
              <option value="leading-loose">Loose</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Tracking</label>
            <select
              value={state.tracking}
              onChange={(e) => handleControlChange('tracking', e.target.value)}
              className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="tracking-tight">Tight</option>
              <option value="tracking-normal">Normal</option>
              <option value="tracking-wide">Wide</option>
              <option value="tracking-widest">Widest</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Color</label>
            <select
              value={state.textColor}
              onChange={(e) => handleControlChange('textColor', e.target.value)}
              className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="text-ink">Ink Black</option>
              <option value="text-ink-subtle">Muted Slate</option>
              <option value="text-primary">Mastercard Orange</option>
              <option value="text-indigo-400">Indigo</option>
              <option value="text-emerald-400">Emerald</option>
              <option value="text-blue-400">Blue</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Decoration</label>
            <select
              value={state.decoration}
              onChange={(e) => handleControlChange('decoration', e.target.value)}
              className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="no-underline">None</option>
              <option value="underline">Underline</option>
              <option value="line-through">Line Through</option>
            </select>
          </div>
        </div>
      ))}

      {/* Panel: Borders & Shadows */}
      {renderFloatingPanel('borders', '4. Borders & Shadows', (
        <div className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Radius</label>
            <select
              value={state.rounded}
              onChange={(e) => handleControlChange('rounded', e.target.value)}
              className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="rounded-none">None</option>
              <option value="rounded-sm">Small</option>
              <option value="rounded">Medium</option>
              <option value="rounded-lg">Large</option>
              <option value="rounded-xl">X-Large</option>
              <option value="rounded-mc-btn">20px Pill (mc-btn)</option>
              <option value="rounded-mc-card">40px Card (mc-card)</option>
              <option value="rounded-full">Full Circular</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Width</label>
            <select
              value={state.borderWidth}
              onChange={(e) => handleControlChange('borderWidth', e.target.value)}
              className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="border-0">0px</option>
              <option value="border">1px</option>
              <option value="border-2">2px</option>
              <option value="border-4">4px</option>
            </select>
          </div>

          {state.borderWidth !== 'border-0' && (
            <div className="space-y-1">
              <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Border Color</label>
              <select
                value={state.borderColor}
                onChange={(e) => handleControlChange('borderColor', e.target.value)}
                className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option value="border-hairline">Hairline Neutral</option>
                <option value="border-primary">Primary Orange</option>
                <option value="border-slate-400">Slate Gray</option>
                <option value="border-indigo-500">Indigo</option>
              </select>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Shadow</label>
            <select
              value={state.shadow}
              onChange={(e) => handleControlChange('shadow', e.target.value)}
              className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="shadow-none">None</option>
              <option value="shadow-sm">Small</option>
              <option value="shadow">Regular</option>
              <option value="shadow-md">Medium</option>
              <option value="shadow-lg">Large</option>
              <option value="shadow-xl">X-Large</option>
            </select>
          </div>

          {state.shadow !== 'shadow-none' && (
            <div className="space-y-1">
              <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Shadow Color</label>
              <select
                value={state.shadowColor}
                onChange={(e) => handleControlChange('shadowColor', e.target.value)}
                className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option value="shadow-none">Default Muted</option>
                <option value="shadow-indigo-500/10">Indigo Glow</option>
                <option value="shadow-orange-500/10">Orange Glow</option>
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Opacity</label>
              <span className="text-[9px] font-mono text-primary font-bold">{getOpacityClass(state.opacity)}</span>
            </div>
            <input
              type="range" min="0" max="4" step="1"
              value={state.opacity}
              onChange={(e) => handleControlChange('opacity', Number(e.target.value))}
              className="w-full h-1 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
            />
          </div>
        </div>
      ))}

      {/* Panel: Transforms & Filters */}
      {renderFloatingPanel('transforms', '5. Transforms & Filters', (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Scale</label>
              <span className="text-[9px] font-mono text-primary font-bold">{getScaleClass(state.scale)}</span>
            </div>
            <input
              type="range" min="0" max="5" step="1"
              value={state.scale}
              onChange={(e) => handleControlChange('scale', Number(e.target.value))}
              className="w-full h-1 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Rotate</label>
              <span className="text-[9px] font-mono text-primary font-bold">{getRotateClass(state.rotate)}</span>
            </div>
            <input
              type="range" min="0" max="6" step="1"
              value={state.rotate}
              onChange={(e) => handleControlChange('rotate', Number(e.target.value))}
              className="w-full h-1 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Translate X</label>
              <span className="text-[9px] font-mono text-primary font-bold">{getTranslateClass(state.translate)}</span>
            </div>
            <input
              type="range" min="0" max="6" step="1"
              value={state.translate}
              onChange={(e) => handleControlChange('translate', Number(e.target.value))}
              className="w-full h-1 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Blur</label>
              <span className="text-[9px] font-mono text-primary font-bold">{getBlurClass(state.blur)}</span>
            </div>
            <input
              type="range" min="0" max="4" step="1"
              value={state.blur}
              onChange={(e) => handleControlChange('blur', Number(e.target.value))}
              className="w-full h-1 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Brightness</label>
              <span className="text-[9px] font-mono text-primary font-bold">{getBrightnessClass(state.brightness)}</span>
            </div>
            <input
              type="range" min="0" max="4" step="1"
              value={state.brightness}
              onChange={(e) => handleControlChange('brightness', Number(e.target.value))}
              className="w-full h-1 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
            />
          </div>
        </div>
      ))}

      {/* Panel: Animations */}
      {renderFloatingPanel('animations', '6. Animations & Hover', (
        <div className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Animation</label>
            <select
              value={state.animation}
              onChange={(e) => handleControlChange('animation', e.target.value)}
              className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="animate-none">None</option>
              <option value="animate-spin">Spin (Spinning)</option>
              <option value="animate-ping">Ping (Radar)</option>
              <option value="animate-pulse">Pulse (Glow)</option>
              <option value="animate-bounce">Bounce</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Hover Scale</label>
            <select
              value={state.hoverScale}
              onChange={(e) => handleControlChange('hoverScale', e.target.value)}
              className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="hover:scale-100">No Scale</option>
              <option value="hover:scale-105">Scale Up 5%</option>
              <option value="hover:scale-110">Scale Up 10%</option>
              <option value="hover:scale-125">Scale Up 25%</option>
              <option value="hover:scale-90">Scale Down 10%</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Hover Rotate</label>
            <select
              value={state.hoverRotate}
              onChange={(e) => handleControlChange('hoverRotate', e.target.value)}
              className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="hover:rotate-0">No Rotation</option>
              <option value="hover:rotate-6">Rotate 6°</option>
              <option value="hover:rotate-12">Rotate 12°</option>
              <option value="hover:-rotate-6">Rotate -6°</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Duration</label>
            <select
              value={state.duration}
              onChange={(e) => handleControlChange('duration', e.target.value)}
              className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="duration-75">75ms</option>
              <option value="duration-150">150ms</option>
              <option value="duration-300">300ms</option>
              <option value="duration-700">700ms</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-semibold text-ink-subtle uppercase tracking-wider">Easing</label>
            <select
              value={state.ease}
              onChange={(e) => handleControlChange('ease', e.target.value)}
              className="w-full bg-surface-2 border border-hairline text-ink text-xs rounded-mc-btn px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="ease-linear">Linear</option>
              <option value="ease-in">Ease In</option>
              <option value="ease-out">Ease Out</option>
              <option value="ease-in-out">Ease In Out</option>
            </select>
          </div>
        </div>
      ))}

      {/* Panel: Inspector Output */}
      {renderFloatingPanel('inspector', '7. Code Inspector', (
        <div className="space-y-3">
          <div className="flex bg-canvas border border-hairline p-0.5 rounded-md">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-1 rounded-sm text-[9px] font-bold transition-all cursor-pointer ${
                activeTab === 'preview' ? 'bg-surface-2 text-ink border border-hairline shadow-sm' : 'text-ink-subtle hover:text-ink'
              }`}
            >
              Classes
            </button>
            <button
              onClick={() => setActiveTab('react')}
              className={`flex-1 py-1 rounded-sm text-[9px] font-bold transition-all cursor-pointer ${
                activeTab === 'react' ? 'bg-surface-2 text-ink border border-hairline shadow-sm' : 'text-ink-subtle hover:text-ink'
              }`}
            >
              React Code
            </button>
          </div>

          {activeTab === 'preview' ? (
            <div className="space-y-2 select-text">
              <span className="text-[8px] text-ink-subtle uppercase tracking-wider font-semibold">Active Class String</span>
              <div className="bg-canvas border border-hairline p-2 rounded-md font-mono text-[9px] text-primary whitespace-pre-wrap select-all font-semibold leading-relaxed">
                {containerClasses || '(no classes)'}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(containerClasses);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 1500);
                }}
                className="w-full bg-primary hover:bg-primary-hover text-white text-[10px] py-1 px-3 rounded shadow-sm font-semibold cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1.5"
              >
                {copiedCode ? <Icons.Check className="w-3 h-3" /> : <Icons.Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Tailwind Classes'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2 select-text">
              <div className="bg-canvas border border-hairline p-2 rounded-md font-mono text-[9px] text-primary overflow-x-auto whitespace-pre select-all leading-relaxed max-h-[140px] scrollbar-thin">
                {getReactTSCode()}
              </div>
              <button
                onClick={handleCopyCode}
                className="w-full bg-primary hover:bg-primary-hover text-white text-[10px] py-1 px-3 rounded shadow-sm font-semibold cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1.5"
              >
                {copiedCode ? <Icons.Check className="w-3 h-3" /> : <Icons.Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Component Code'}</span>
              </button>
            </div>
          )}
        </div>
      ), 'w-72')}

      {/* 4. Bottom Dock Toolbar (Fixed Dock) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-surface-2/95 border border-hairline shadow-xl rounded-full p-2 flex items-center gap-1.5 backdrop-blur-md figma-panel select-none">
        
        {/* Toggle Button: Templates */}
        <button
          onClick={() => togglePanelVisibility('template')}
          title="Component Template Manager"
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            visiblePanels['template'] ? 'bg-primary text-white shadow-md' : 'text-ink-subtle hover:text-ink hover:bg-surface-3'
          }`}
        >
          <Icons.Layers className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-hairline mx-0.5" />

        {/* Toggle Button: Layout */}
        <button
          onClick={() => togglePanelVisibility('layout')}
          title="Layout Settings (Flex/Grid)"
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            visiblePanels['layout'] ? 'bg-primary text-white shadow-md' : 'text-ink-subtle hover:text-ink hover:bg-surface-3'
          }`}
        >
          <Icons.LayoutGrid className="w-4 h-4" />
        </button>

        {/* Toggle Button: Spacing */}
        <button
          onClick={() => togglePanelVisibility('spacing')}
          title="Spacing Settings (Padding/Margin)"
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            visiblePanels['spacing'] ? 'bg-primary text-white shadow-md' : 'text-ink-subtle hover:text-ink hover:bg-surface-3'
          }`}
        >
          <Icons.Maximize2 className="w-4 h-4" />
        </button>

        {/* Toggle Button: Typography */}
        <button
          onClick={() => togglePanelVisibility('typography')}
          title="Typography Settings"
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            visiblePanels['typography'] ? 'bg-primary text-white shadow-md' : 'text-ink-subtle hover:text-ink hover:bg-surface-3'
          }`}
        >
          <Icons.Type className="w-4 h-4" />
        </button>

        {/* Toggle Button: Borders */}
        <button
          onClick={() => togglePanelVisibility('borders')}
          title="Borders & Shadows"
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            visiblePanels['borders'] ? 'bg-primary text-white shadow-md' : 'text-ink-subtle hover:text-ink hover:bg-surface-3'
          }`}
        >
          <Icons.Box className="w-4 h-4" />
        </button>

        {/* Toggle Button: Transforms */}
        <button
          onClick={() => togglePanelVisibility('transforms')}
          title="Transforms & Filters"
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            visiblePanels['transforms'] ? 'bg-primary text-white shadow-md' : 'text-ink-subtle hover:text-ink hover:bg-surface-3'
          }`}
        >
          <Icons.Sliders className="w-4 h-4" />
        </button>

        {/* Toggle Button: Animations */}
        <button
          onClick={() => togglePanelVisibility('animations')}
          title="Animations & Hover"
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            visiblePanels['animations'] ? 'bg-primary text-white shadow-md' : 'text-ink-subtle hover:text-ink hover:bg-surface-3'
          }`}
        >
          <Icons.Play className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-hairline mx-0.5" />

        {/* Toggle Button: Code Inspector */}
        <button
          onClick={() => togglePanelVisibility('inspector')}
          title="React Code Inspector"
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            visiblePanels['inspector'] ? 'bg-primary text-white shadow-md' : 'text-ink-subtle hover:text-ink hover:bg-surface-3'
          }`}
        >
          <Icons.Terminal className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-hairline mx-0.5" />

        {/* Reset Positions Button */}
        <button
          onClick={resetLayoutCoordinates}
          title="Reset Panel Positions"
          className="w-9 h-9 rounded-full flex items-center justify-center text-ink-subtle hover:text-ink hover:bg-surface-3 transition-all cursor-pointer"
        >
          <Icons.RefreshCw className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
