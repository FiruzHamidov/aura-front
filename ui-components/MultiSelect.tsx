'use client';

import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

interface Option {
  id: string | number;
  name: string;
  unavailable?: boolean;
}

interface MultiSelectProps {
  placeholder?: string;
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  options: Option[];
  className?: string;
}

export function MultiSelect({
  placeholder = 'Выберите из списка',
  value,
  onChange,
  options,
  className = '',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionToggle = (optionId: string | number) => {
    const newValue = value.includes(optionId)
      ? value.filter((id) => id !== optionId)
      : [...value, optionId];
    onChange(newValue);
  };

  const getDisplayText = () => {
    if (value.length === 0) return placeholder;
    if (value.length === 1) {
      const option = options.find((opt) => opt.id === value[0]);
      return option?.name || placeholder;
    }
    return `Выбрано: ${value.length}`;
  };

  return (
    <div className={clsx('relative', className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'w-full bg-white hover:bg-gray-50 px-4 py-3 rounded-lg text-left border border-gray-200 transition-colors flex items-center justify-between',
          {
            'text-gray-500': value.length === 0,
            'text-gray-900': value.length > 0,
          }
        )}
      >
        <span className="truncate">{getDisplayText()}</span>

        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="#333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
          {options.map((option) => (
            <label
              key={option.id}
              className={clsx(
                'flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors',
                {
                  'opacity-50 cursor-not-allowed': option.unavailable,
                }
              )}
            >
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={value.includes(option.id)}
                  onChange={() =>
                    !option.unavailable && handleOptionToggle(option.id)
                  }
                  disabled={option.unavailable}
                  className="sr-only"
                />

                <div
                  className={clsx(
                    'w-5 h-5 border-2 rounded mr-3 flex items-center justify-center transition-colors',
                    {
                      'border-red-500 bg-transparent': value.includes(
                        option.id
                      ),
                      'border-gray-300 bg-transparent': !value.includes(
                        option.id
                      ),
                      'opacity-50': option.unavailable,
                    }
                  )}
                >
                  {value.includes(option.id) && (
                    <svg
                      className="w-3 h-3 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <span className="text-gray-900">{option.name}</span>
            </label>
          ))}

          {options.length === 0 && (
            <div className="px-4 py-3 text-gray-500 text-center">
              Нет доступных опций
            </div>
          )}
        </div>
      )}
    </div>
  );
}
