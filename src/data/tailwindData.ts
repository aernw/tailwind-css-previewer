export interface TailwindClassInfo {
  className: string;
  cssProperty: string;
  description?: string;
}

export interface UtilityGroup {
  name: string;
  description?: string;
  classes: TailwindClassInfo[];
}

export interface PlaygroundControl {
  id: string;
  label: string;
  type: 'slider' | 'select' | 'color' | 'toggle';
  defaultValue: any;
  options?: { label: string; value: string; cssVal?: string }[];
  min?: number;
  max?: number;
  step?: number;
  classPrefix?: string;
  // A function mapping the control value to the tailwind class
  valueMapper?: (val: any) => string;
}

export interface CategoryData {
  id: string;
  title: string;
  description: string;
  iconName: string;
  groups: UtilityGroup[];
  playground: {
    title: string;
    controls: PlaygroundControl[];
    defaultStyles: string; // Base classes for preview
    previewType: 'text' | 'box' | 'flex' | 'grid' | 'card' | 'animation';
  };
}

export const tailwindCategories: CategoryData[] = [
  {
    id: 'flexbox-grid',
    title: 'Flexbox & Grid',
    iconName: 'LayoutGrid',
    groups: [
      {
        name: 'Flex Direction',
        classes: [
          { className: 'flex-row', cssProperty: 'flex-direction: row;' },
          { className: 'flex-row-reverse', cssProperty: 'flex-direction: row-reverse;' },
          { className: 'flex-col', cssProperty: 'flex-direction: column;' },
          { className: 'flex-col-reverse', cssProperty: 'flex-direction: column-reverse;' },
        ]
      },
      {
        name: 'Flex Wrap',
        classes: [
          { className: 'flex-nowrap', cssProperty: 'flex-wrap: nowrap;' },
          { className: 'flex-wrap', cssProperty: 'flex-wrap: wrap;' },
          { className: 'flex-wrap-reverse', cssProperty: 'flex-wrap: wrap-reverse;' },
        ]
      },
      {
        name: 'Justify Content',
        classes: [
          { className: 'justify-start', cssProperty: 'justify-content: flex-start;' },
          { className: 'justify-end', cssProperty: 'justify-content: flex-end;' },
          { className: 'justify-center', cssProperty: 'justify-content: center;' },
          { className: 'justify-between', cssProperty: 'justify-content: space-between;' },
          { className: 'justify-around', cssProperty: 'justify-content: space-around;' },
          { className: 'justify-evenly', cssProperty: 'justify-content: space-evenly;' },
        ]
      },
      {
        name: 'Align Items',
        classes: [
          { className: 'items-start', cssProperty: 'align-items: flex-start;' },
          { className: 'items-end', cssProperty: 'align-items: flex-end;' },
          { className: 'items-center', cssProperty: 'align-items: center;' },
          { className: 'items-baseline', cssProperty: 'align-items: baseline;' },
          { className: 'items-stretch', cssProperty: 'align-items: stretch;' },
        ]
      },
      {
        name: 'Gap',
        classes: [
          { className: 'gap-0', cssProperty: 'gap: 0px;' },
          { className: 'gap-1', cssProperty: 'gap: 0.25rem; /* 4px */' },
          { className: 'gap-2', cssProperty: 'gap: 0.5rem; /* 8px */' },
          { className: 'gap-4', cssProperty: 'gap: 1rem; /* 16px */' },
          { className: 'gap-6', cssProperty: 'gap: 1.5rem; /* 24px */' },
          { className: 'gap-8', cssProperty: 'gap: 2rem; /* 32px */' },
          { className: 'gap-12', cssProperty: 'gap: 3rem; /* 48px */' },
          { className: 'gap-16', cssProperty: 'gap: 4rem; /* 64px */' },
        ]
      },
      {
        name: 'Grid Template Columns',
        classes: [
          { className: 'grid-cols-1', cssProperty: 'grid-template-columns: repeat(1, minmax(0, 1fr));' },
          { className: 'grid-cols-2', cssProperty: 'grid-template-columns: repeat(2, minmax(0, 1fr));' },
          { className: 'grid-cols-3', cssProperty: 'grid-template-columns: repeat(3, minmax(0, 1fr));' },
          { className: 'grid-cols-4', cssProperty: 'grid-template-columns: repeat(4, minmax(0, 1fr));' },
          { className: 'grid-cols-6', cssProperty: 'grid-template-columns: repeat(6, minmax(0, 1fr));' },
        ]
      }
    ],
    playground: {
      title: 'Flexbox & Grid Layout',
      defaultStyles: 'w-full min-h-[220px] bg-surface-1/50 border border-hairline rounded-xl transition-all duration-300',
      previewType: 'flex',
      controls: [
        {
          id: 'display',
          label: 'Display Mode',
          type: 'select',
          defaultValue: 'flex',
          options: [
            { label: 'Flexbox', value: 'flex' },
            { label: 'Grid', value: 'grid' }
          ]
        },
        {
          id: 'direction',
          label: 'Flex Direction',
          type: 'select',
          defaultValue: 'flex-row',
          options: [
            { label: 'Row', value: 'flex-row' },
            { label: 'Column', value: 'flex-col' },
            { label: 'Row Reverse', value: 'flex-row-reverse' },
            { label: 'Column Reverse', value: 'flex-col-reverse' }
          ]
        },
        {
          id: 'justify',
          label: 'Justify Content',
          type: 'select',
          defaultValue: 'justify-center',
          options: [
            { label: 'Start', value: 'justify-start' },
            { label: 'Center', value: 'justify-center' },
            { label: 'End', value: 'justify-end' },
            { label: 'Space Between', value: 'justify-between' },
            { label: 'Space Around', value: 'justify-around' }
          ]
        },
        {
          id: 'align',
          label: 'Align Items',
          type: 'select',
          defaultValue: 'items-center',
          options: [
            { label: 'Stretch', value: 'items-stretch' },
            { label: 'Start', value: 'items-start' },
            { label: 'Center', value: 'items-center' },
            { label: 'End', value: 'items-end' }
          ]
        },
        {
          id: 'gap',
          label: 'Gap (Spacing)',
          type: 'slider',
          defaultValue: 4,
          min: 0,
          max: 12,
          step: 1,
          classPrefix: 'gap-',
          valueMapper: (val) => {
            const gaps = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16];
            return `gap-${gaps[val] || 4}`;
          }
        },
        {
          id: 'gridCols',
          label: 'Grid Columns',
          type: 'select',
          defaultValue: 'grid-cols-3',
          options: [
            { label: '1 Column', value: 'grid-cols-1' },
            { label: '2 Columns', value: 'grid-cols-2' },
            { label: '3 Columns', value: 'grid-cols-3' },
            { label: '4 Columns', value: 'grid-cols-4' }
          ]
        },
        {
          id: 'itemsCount',
          label: 'Number of Children',
          type: 'slider',
          defaultValue: 3,
          min: 2,
          max: 6,
          step: 1
        }
      ]
    }
  },
  {
    id: 'spacing',
    title: 'Spacing',
    iconName: 'Maximize2',
    groups: [
      {
        name: 'Padding (p, px, py, pt, pb, etc.)',
        classes: [
          { className: 'p-0', cssProperty: 'padding: 0px;' },
          { className: 'p-2', cssProperty: 'padding: 0.5rem; /* 8px */' },
          { className: 'p-4', cssProperty: 'padding: 1rem; /* 16px */' },
          { className: 'p-8', cssProperty: 'padding: 2rem; /* 32px */' },
          { className: 'px-4', cssProperty: 'padding-left: 1rem; padding-right: 1rem;' },
          { className: 'py-2', cssProperty: 'padding-top: 0.5rem; padding-bottom: 0.5rem;' },
        ]
      },
      {
        name: 'Margin (m, mx, my, mt, mb, etc.)',
        classes: [
          { className: 'm-0', cssProperty: 'margin: 0px;' },
          { className: 'm-2', cssProperty: 'margin: 0.5rem; /* 8px */' },
          { className: 'm-4', cssProperty: 'margin: 1rem; /* 16px */' },
          { className: 'm-8', cssProperty: 'margin: 2rem; /* 32px */' },
          { className: 'mx-auto', cssProperty: 'margin-left: auto; margin-right: auto;' },
          { className: 'my-4', cssProperty: 'margin-top: 1rem; margin-bottom: 1rem;' },
        ]
      }
    ],
    playground: {
      title: 'Padding & Margin visualizer',
      defaultStyles: 'bg-surface-1/50 p-6 border border-hairline rounded-xl relative overflow-hidden flex justify-center items-center',
      previewType: 'box',
      controls: [
        {
          id: 'padding',
          label: 'Padding Size (Inner Spacing)',
          type: 'slider',
          defaultValue: 4,
          min: 0,
          max: 12,
          step: 1,
          valueMapper: (val) => {
            const paddings = [0, 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24];
            return `p-${paddings[val] || 4}`;
          }
        },
        {
          id: 'margin',
          label: 'Margin Size (Outer Spacing)',
          type: 'slider',
          defaultValue: 4,
          min: 0,
          max: 12,
          step: 1,
          valueMapper: (val) => {
            const margins = [0, 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24];
            return `m-${margins[val] || 4}`;
          }
        }
      ]
    }
  },
  {
    id: 'typography',
    title: 'Typography',
    iconName: 'Type',
    groups: [
      {
        name: 'Font Size',
        classes: [
          { className: 'text-xs', cssProperty: 'font-size: 0.75rem; line-height: 1rem;' },
          { className: 'text-sm', cssProperty: 'font-size: 0.875rem; line-height: 1.25rem;' },
          { className: 'text-base', cssProperty: 'font-size: 1rem; line-height: 1.5rem;' },
          { className: 'text-lg', cssProperty: 'font-size: 1.125rem; line-height: 1.75rem;' },
          { className: 'text-xl', cssProperty: 'font-size: 1.25rem; line-height: 1.75rem;' },
          { className: 'text-2xl', cssProperty: 'font-size: 1.5rem; line-height: 2rem;' },
          { className: 'text-4xl', cssProperty: 'font-size: 2.25rem; line-height: 2.5rem;' },
          { className: 'text-6xl', cssProperty: 'font-size: 3.75rem; line-height: 1;' },
        ]
      },
      {
        name: 'Font Weight',
        classes: [
          { className: 'font-thin', cssProperty: 'font-weight: 100;' },
          { className: 'font-light', cssProperty: 'font-weight: 300;' },
          { className: 'font-normal', cssProperty: 'font-weight: 400;' },
          { className: 'font-medium', cssProperty: 'font-weight: 500;' },
          { className: 'font-semibold', cssProperty: 'font-weight: 600;' },
          { className: 'font-bold', cssProperty: 'font-weight: 700;' },
          { className: 'font-extrabold', cssProperty: 'font-weight: 800;' },
          { className: 'font-black', cssProperty: 'font-weight: 900;' },
        ]
      },
      {
        name: 'Text Align',
        classes: [
          { className: 'text-left', cssProperty: 'text-align: left;' },
          { className: 'text-center', cssProperty: 'text-align: center;' },
          { className: 'text-right', cssProperty: 'text-align: right;' },
          { className: 'text-justify', cssProperty: 'text-align: justify;' },
        ]
      },
      {
        name: 'Line Height (Leading)',
        classes: [
          { className: 'leading-none', cssProperty: 'line-height: 1;' },
          { className: 'leading-tight', cssProperty: 'line-height: 1.25;' },
          { className: 'leading-normal', cssProperty: 'line-height: 1.5;' },
          { className: 'leading-relaxed', cssProperty: 'line-height: 1.625;' },
          { className: 'leading-loose', cssProperty: 'line-height: 2;' },
        ]
      },
      {
        name: 'Letter Spacing (Tracking)',
        classes: [
          { className: 'tracking-tighter', cssProperty: 'letter-spacing: -0.05em;' },
          { className: 'tracking-tight', cssProperty: 'letter-spacing: -0.025em;' },
          { className: 'tracking-normal', cssProperty: 'letter-spacing: 0em;' },
          { className: 'tracking-wide', cssProperty: 'letter-spacing: 0.025em;' },
          { className: 'tracking-wider', cssProperty: 'letter-spacing: 0.05em;' },
          { className: 'tracking-widest', cssProperty: 'letter-spacing: 0.1em;' },
        ]
      }
    ],
    playground: {
      title: 'Typography Playground',
      defaultStyles: 'bg-surface-1/50 p-6 border border-hairline rounded-xl max-w-full overflow-hidden',
      previewType: 'text',
      controls: [
        {
          id: 'size',
          label: 'Font Size',
          type: 'select',
          defaultValue: 'text-xl',
          options: [
            { label: 'Extra Small', value: 'text-xs' },
            { label: 'Small', value: 'text-sm' },
            { label: 'Base', value: 'text-base' },
            { label: 'Large', value: 'text-lg' },
            { label: 'Extra Large', value: 'text-xl' },
            { label: '2XL', value: 'text-2xl' },
            { label: '4XL', value: 'text-4xl' },
            { label: '6XL', value: 'text-6xl' }
          ]
        },
        {
          id: 'weight',
          label: 'Font Weight',
          type: 'select',
          defaultValue: 'font-normal',
          options: [
            { label: 'Light', value: 'font-light' },
            { label: 'Normal', value: 'font-normal' },
            { label: 'Medium', value: 'font-medium' },
            { label: 'Semibold', value: 'font-semibold' },
            { label: 'Bold', value: 'font-bold' },
            { label: 'Black', value: 'font-black' }
          ]
        },
        {
          id: 'align',
          label: 'Text Align',
          type: 'select',
          defaultValue: 'text-center',
          options: [
            { label: 'Left', value: 'text-left' },
            { label: 'Center', value: 'text-center' },
            { label: 'Right', value: 'text-right' },
            { label: 'Justify', value: 'text-justify' }
          ]
        },
        {
          id: 'leading',
          label: 'Line Height (Leading)',
          type: 'select',
          defaultValue: 'leading-normal',
          options: [
            { label: 'None', value: 'leading-none' },
            { label: 'Tight', value: 'leading-tight' },
            { label: 'Normal', value: 'leading-normal' },
            { label: 'Relaxed', value: 'leading-relaxed' },
            { label: 'Loose', value: 'leading-loose' }
          ]
        },
        {
          id: 'tracking',
          label: 'Letter Spacing (Tracking)',
          type: 'select',
          defaultValue: 'tracking-normal',
          options: [
            { label: 'Tight', value: 'tracking-tight' },
            { label: 'Normal', value: 'tracking-normal' },
            { label: 'Wide', value: 'tracking-wide' },
            { label: 'Widest', value: 'tracking-widest' }
          ]
        },
        {
          id: 'color',
          label: 'Text Color',
          type: 'select',
          defaultValue: 'text-indigo-400',
          options: [
            { label: 'White', value: 'text-white' },
            { label: 'Slate', value: 'text-slate-400' },
            { label: 'Red', value: 'text-red-400' },
            { label: 'Orange', value: 'text-orange-400' },
            { label: 'Green', value: 'text-emerald-400' },
            { label: 'Blue', value: 'text-blue-400' },
            { label: 'Indigo', value: 'text-indigo-400' },
            { label: 'Fuchsia', value: 'text-fuchsia-400' }
          ]
        },
        {
          id: 'decoration',
          label: 'Decoration',
          type: 'select',
          defaultValue: 'no-underline',
          options: [
            { label: 'None', value: 'no-underline' },
            { label: 'Underline', value: 'underline' },
            { label: 'Line Through', value: 'line-through' }
          ]
        }
      ]
    }
  },
  {
    id: 'borders-effects',
    title: 'Borders & Shadows',
    iconName: 'Box',
    groups: [
      {
        name: 'Border Radius (rounded)',
        classes: [
          { className: 'rounded-none', cssProperty: 'border-radius: 0px;' },
          { className: 'rounded-sm', cssProperty: 'border-radius: 0.125rem; /* 2px */' },
          { className: 'rounded', cssProperty: 'border-radius: 0.25rem; /* 4px */' },
          { className: 'rounded-md', cssProperty: 'border-radius: 0.375rem; /* 6px */' },
          { className: 'rounded-lg', cssProperty: 'border-radius: 0.5rem; /* 8px */' },
          { className: 'rounded-xl', cssProperty: 'border-radius: 0.75rem; /* 12px */' },
          { className: 'rounded-2xl', cssProperty: 'border-radius: 1rem; /* 16px */' },
          { className: 'rounded-3xl', cssProperty: 'border-radius: 1.5rem; /* 24px */' },
          { className: 'rounded-full', cssProperty: 'border-radius: 9999px;' },
        ]
      },
      {
        name: 'Border Width',
        classes: [
          { className: 'border-0', cssProperty: 'border-width: 0px;' },
          { className: 'border', cssProperty: 'border-width: 1px;' },
          { className: 'border-2', cssProperty: 'border-width: 2px;' },
          { className: 'border-4', cssProperty: 'border-width: 4px;' },
          { className: 'border-8', cssProperty: 'border-width: 8px;' },
        ]
      },
      {
        name: 'Box Shadow',
        classes: [
          { className: 'shadow-none', cssProperty: 'box-shadow: 0 0 #0000;' },
          { className: 'shadow-sm', cssProperty: 'box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);' },
          { className: 'shadow', cssProperty: 'box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);' },
          { className: 'shadow-md', cssProperty: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);' },
          { className: 'shadow-lg', cssProperty: 'box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);' },
          { className: 'shadow-xl', cssProperty: 'box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);' },
          { className: 'shadow-2xl', cssProperty: 'box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);' },
          { className: 'shadow-inner', cssProperty: 'box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.06);' },
        ]
      },
      {
        name: 'Opacity',
        classes: [
          { className: 'opacity-0', cssProperty: 'opacity: 0;' },
          { className: 'opacity-25', cssProperty: 'opacity: 0.25;' },
          { className: 'opacity-50', cssProperty: 'opacity: 0.5;' },
          { className: 'opacity-75', cssProperty: 'opacity: 0.75;' },
          { className: 'opacity-100', cssProperty: 'opacity: 1;' },
        ]
      }
    ],
    playground: {
      title: 'Borders & Shadows Playground',
      defaultStyles: 'bg-surface-1/50 p-12 border border-hairline rounded-xl flex justify-center items-center min-h-[220px]',
      previewType: 'card',
      controls: [
        {
          id: 'rounded',
          label: 'Border Radius',
          type: 'select',
          defaultValue: 'rounded-xl',
          options: [
            { label: 'None (0px)', value: 'rounded-none' },
            { label: 'Small (2px)', value: 'rounded-sm' },
            { label: 'Medium (4px)', value: 'rounded' },
            { label: 'Large (8px)', value: 'rounded-lg' },
            { label: 'X-Large (12px)', value: 'rounded-xl' },
            { label: '2X-Large (16px)', value: 'rounded-2xl' },
            { label: '3X-Large (24px)', value: 'rounded-3xl' },
            { label: 'Full Pill', value: 'rounded-full' }
          ]
        },
        {
          id: 'borderWidth',
          label: 'Border Width',
          type: 'select',
          defaultValue: 'border-2',
          options: [
            { label: '0px', value: 'border-0' },
            { label: '1px', value: 'border' },
            { label: '2px', value: 'border-2' },
            { label: '4px', value: 'border-4' },
            { label: '8px', value: 'border-8' }
          ]
        },
        {
          id: 'borderColor',
          label: 'Border Color',
          type: 'select',
          defaultValue: 'border-indigo-500/50',
          options: [
            { label: 'Slate', value: 'border-slate-750' },
            { label: 'Red', value: 'border-red-500' },
            { label: 'Green', value: 'border-emerald-500' },
            { label: 'Blue', value: 'border-blue-500' },
            { label: 'Indigo', value: 'border-indigo-500' },
            { label: 'Indigo Alpha', value: 'border-indigo-500/50' },
            { label: 'Pink', value: 'border-pink-500' }
          ]
        },
        {
          id: 'shadow',
          label: 'Box Shadow',
          type: 'select',
          defaultValue: 'shadow-lg',
          options: [
            { label: 'None', value: 'shadow-none' },
            { label: 'Small', value: 'shadow-sm' },
            { label: 'Regular', value: 'shadow' },
            { label: 'Medium', value: 'shadow-md' },
            { label: 'Large', value: 'shadow-lg' },
            { label: 'X-Large', value: 'shadow-xl' },
            { label: '2X-Large', value: 'shadow-2xl' }
          ]
        },
        {
          id: 'shadowColor',
          label: 'Shadow Glow Color',
          type: 'select',
          defaultValue: 'shadow-indigo-500/10',
          options: [
            { label: 'None', value: 'shadow-none' },
            { label: 'Indigo Shadow', value: 'shadow-indigo-500/20' },
            { label: 'Purple Shadow', value: 'shadow-purple-500/20' },
            { label: 'Pink Shadow', value: 'shadow-pink-500/20' },
            { label: 'Cyan Shadow', value: 'shadow-cyan-500/20' }
          ]
        },
        {
          id: 'opacity',
          label: 'Opacity',
          type: 'slider',
          defaultValue: 4,
          min: 0,
          max: 4,
          step: 1,
          valueMapper: (val) => {
            const opacities = ['opacity-25', 'opacity-50', 'opacity-75', 'opacity-90', 'opacity-100'];
            return opacities[val] || 'opacity-100';
          }
        }
      ]
    }
  },
  {
    id: 'effects-filters',
    title: 'Transforms & Filters',
    iconName: 'Sliders',
    groups: [
      {
        name: 'Scale',
        classes: [
          { className: 'scale-50', cssProperty: 'transform: scale(0.5);' },
          { className: 'scale-75', cssProperty: 'transform: scale(0.75);' },
          { className: 'scale-90', cssProperty: 'transform: scale(0.9);' },
          { className: 'scale-100', cssProperty: 'transform: scale(1);' },
          { className: 'scale-110', cssProperty: 'transform: scale(1.1);' },
          { className: 'scale-125', cssProperty: 'transform: scale(1.25);' },
          { className: 'scale-150', cssProperty: 'transform: scale(1.5);' },
        ]
      },
      {
        name: 'Rotate',
        classes: [
          { className: 'rotate-0', cssProperty: 'transform: rotate(0deg);' },
          { className: 'rotate-45', cssProperty: 'transform: rotate(45deg);' },
          { className: 'rotate-90', cssProperty: 'transform: rotate(90deg);' },
          { className: 'rotate-180', cssProperty: 'transform: rotate(180deg);' },
          { className: '-rotate-45', cssProperty: 'transform: rotate(-45deg);' },
          { className: '-rotate-90', cssProperty: 'transform: rotate(-90deg);' },
        ]
      },
      {
        name: 'Blur Filter',
        classes: [
          { className: 'blur-none', cssProperty: 'filter: blur(0px);' },
          { className: 'blur-sm', cssProperty: 'filter: blur(4px);' },
          { className: 'blur', cssProperty: 'filter: blur(8px);' },
          { className: 'blur-md', cssProperty: 'filter: blur(12px);' },
          { className: 'blur-lg', cssProperty: 'filter: blur(16px);' },
          { className: 'blur-xl', cssProperty: 'filter: blur(24px);' },
        ]
      },
      {
        name: 'Brightness Filter',
        classes: [
          { className: 'brightness-50', cssProperty: 'filter: brightness(.5);' },
          { className: 'brightness-75', cssProperty: 'filter: brightness(.75);' },
          { className: 'brightness-100', cssProperty: 'filter: brightness(1);' },
          { className: 'brightness-125', cssProperty: 'filter: brightness(1.25);' },
          { className: 'brightness-150', cssProperty: 'filter: brightness(1.5);' },
        ]
      }
    ],
    playground: {
      title: 'Transforms & Filters Visualizer',
      defaultStyles: 'bg-surface-1/50 p-12 border border-hairline rounded-xl flex justify-center items-center min-h-[260px]',
      previewType: 'card',
      controls: [
        {
          id: 'scale',
          label: 'Scale Ratio',
          type: 'slider',
          defaultValue: 3,
          min: 0,
          max: 5,
          step: 1,
          valueMapper: (val) => {
            const scales = ['scale-50', 'scale-75', 'scale-90', 'scale-100', 'scale-110', 'scale-125'];
            return scales[val] || 'scale-100';
          }
        },
        {
          id: 'rotate',
          label: 'Rotation Degrees',
          type: 'slider',
          defaultValue: 3,
          min: 0,
          max: 6,
          step: 1,
          valueMapper: (val) => {
            const degrees = ['-rotate-90', '-rotate-45', '-rotate-12', 'rotate-0', 'rotate-12', 'rotate-45', 'rotate-90'];
            return degrees[val] || 'rotate-0';
          }
        },
        {
          id: 'translate',
          label: 'Translate X Offset',
          type: 'slider',
          defaultValue: 3,
          min: 0,
          max: 6,
          step: 1,
          valueMapper: (val) => {
            const offsets = ['-translate-x-12', '-translate-x-6', '-translate-x-2', 'translate-x-0', 'translate-x-2', 'translate-x-6', 'translate-x-12'];
            return offsets[val] || 'translate-x-0';
          }
        },
        {
          id: 'blur',
          label: 'Gaussian Blur',
          type: 'slider',
          defaultValue: 0,
          min: 0,
          max: 4,
          step: 1,
          valueMapper: (val) => {
            const blurs = ['blur-none', 'blur-sm', 'blur', 'blur-md', 'blur-lg'];
            return blurs[val] || 'blur-none';
          }
        },
        {
          id: 'brightness',
          label: 'Brightness Filter',
          type: 'slider',
          defaultValue: 2,
          min: 0,
          max: 4,
          step: 1,
          valueMapper: (val) => {
            const brights = ['brightness-50', 'brightness-75', 'brightness-100', 'brightness-125', 'brightness-150'];
            return brights[val] || 'brightness-100';
          }
        }
      ]
    }
  },
  {
    id: 'transitions-animations',
    title: 'Transitions & Animations',
    iconName: 'Play',
    groups: [
      {
        name: 'Animations',
        classes: [
          { className: 'animate-none', cssProperty: 'animation: none;' },
          { className: 'animate-spin', cssProperty: 'animation: spin 1s linear infinite;' },
          { className: 'animate-ping', cssProperty: 'animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;' },
          { className: 'animate-pulse', cssProperty: 'animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;' },
          { className: 'animate-bounce', cssProperty: 'animation: bounce 1s infinite;' },
        ]
      },
      {
        name: 'Transition Duration',
        classes: [
          { className: 'duration-75', cssProperty: 'transition-duration: 75ms;' },
          { className: 'duration-150', cssProperty: 'transition-duration: 150ms;' },
          { className: 'duration-300', cssProperty: 'transition-duration: 300ms;' },
          { className: 'duration-500', cssProperty: 'transition-duration: 500ms;' },
          { className: 'duration-700', cssProperty: 'transition-duration: 700ms;' },
          { className: 'duration-1000', cssProperty: 'transition-duration: 1000ms;' },
        ]
      },
      {
        name: 'Transition Timing Function (Easing)',
        classes: [
          { className: 'ease-linear', cssProperty: 'transition-timing-function: linear;' },
          { className: 'ease-in', cssProperty: 'transition-timing-function: cubic-bezier(0.4, 0, 1, 1);' },
          { className: 'ease-out', cssProperty: 'transition-timing-function: cubic-bezier(0, 0, 0.2, 1);' },
          { className: 'ease-in-out', cssProperty: 'transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);' },
        ]
      }
    ],
    playground: {
      title: 'Animations & Hover Transitions Playground',
      defaultStyles: 'bg-surface-1/50 p-12 border border-hairline rounded-xl flex justify-center items-center min-h-[220px]',
      previewType: 'animation',
      controls: [
        {
          id: 'animation',
          label: 'Core Tailwind Animation',
          type: 'select',
          defaultValue: 'animate-bounce',
          options: [
            { label: 'None', value: 'animate-none' },
            { label: 'Spin (Loading)', value: 'animate-spin' },
            { label: 'Ping (Radar)', value: 'animate-ping' },
            { label: 'Pulse (Glowing)', value: 'animate-pulse' },
            { label: 'Bounce (Attention)', value: 'animate-bounce' }
          ]
        },
        {
          id: 'duration',
          label: 'Hover Transition Duration',
          type: 'select',
          defaultValue: 'duration-300',
          options: [
            { label: 'Fast (75ms)', value: 'duration-75' },
            { label: 'Medium (300ms)', value: 'duration-300' },
            { label: 'Slow (700ms)', value: 'duration-700' },
            { label: 'Very Slow (1000ms)', value: 'duration-1000' }
          ]
        },
        {
          id: 'ease',
          label: 'Easing Curve',
          type: 'select',
          defaultValue: 'ease-in-out',
          options: [
            { label: 'Linear', value: 'ease-linear' },
            { label: 'Ease In (Accelerate)', value: 'ease-in' },
            { label: 'Ease Out (Decelerate)', value: 'ease-out' },
            { label: 'Ease In Out (Smooth)', value: 'ease-in-out' }
          ]
        },
        {
          id: 'hoverScale',
          label: 'Hover Target Scale',
          type: 'select',
          defaultValue: 'hover:scale-110',
          options: [
            { label: 'No scale', value: 'hover:scale-100' },
            { label: 'Scale Up 10%', value: 'hover:scale-110' },
            { label: 'Scale Up 25%', value: 'hover:scale-125' },
            { label: 'Scale Down 10%', value: 'hover:scale-90' }
          ]
        },
        {
          id: 'hoverRotate',
          label: 'Hover Target Rotation',
          type: 'select',
          defaultValue: 'hover:rotate-12',
          options: [
            { label: 'No rotation', value: 'hover:rotate-0' },
            { label: 'Rotate 12deg', value: 'hover:rotate-12' },
            { label: 'Rotate 45deg', value: 'hover:rotate-45' },
            { label: 'Spin Rotate 90deg', value: 'hover:rotate-90' }
          ]
        }
      ]
    }
  }
];
