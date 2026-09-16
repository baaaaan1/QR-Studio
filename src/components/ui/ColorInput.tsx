import React from 'react';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange }) => {
  const inputId = React.useId();

  return (
    <div>
      <label htmlFor={inputId} className="text-[11px] text-text-muted block mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${label} color picker`}
          className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
        />
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full neu-input rounded-control px-2.5 py-1 text-xs font-mono"
        />
      </div>
    </div>
  );
};
