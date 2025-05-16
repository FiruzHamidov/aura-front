'use client';

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
}

export function FormInput({ label, value, onChange, suffix }: FormInputProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-[#666F8D] text-lg">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#F0F2F5] rounded-lg py-5 px-4 text-lg"
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
