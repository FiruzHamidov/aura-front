'use client';

import clsx from 'clsx';

interface SelectToggleProps<T extends string | number> {
  title: string;
  options: { id: T; name: string }[];
  selected: T | null;
  setSelected: (val: T) => void;
  className?: string;
}

export function SelectToggle<T extends string | number>({
  title,
  options,
  selected,
  setSelected,
  className = '',
}: SelectToggleProps<T>) {
  return (
    <div className={className}>
      <h2 className="font-semibold mb-2 text-[#666F8D]">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={clsx(
              'px-4 py-2 rounded-full border transition-colors',
              selected === opt.id
                ? 'bg-[#0036A5] text-white border-[#0036A5]'
                : 'bg-white text-black border-[#BAC0CC] hover:border-[#0036A5]'
            )}
            onClick={() => setSelected(opt.id)}
          >
            {opt.name}
          </button>
        ))}
      </div>
    </div>
  );
}
