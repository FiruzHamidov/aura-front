'use client';

import { ChangeEvent } from 'react';

interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  textarea?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Input({
  label,
  name,
  value,
  onChange,
  type = 'text',
  textarea = false,
  required = false,
  disabled = false,
  placeholder,
  className = '',
}: InputProps) {
  return (
    <div className={className}>
      <label className="block mb-2 text-sm  text-[#666F8D]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          rows={4}
          disabled={disabled}
          className="w-full px-4 py-3 rounded-lg border border-[#BAC0CC] bg-white text-gray-900 resize-vertical focus:outline-none focus:ring-2 focus:ring-[#0036A5] focus:border-transparent"
        />
      ) : (
        <input
          name={name}
          value={value}
          type={type}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-3 rounded-lg border border-[#BAC0CC] bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0036A5] focus:border-transparent"
        />
      )}
    </div>
  );
}
