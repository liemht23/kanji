import { cn } from "@/utils/class-name";
import React from "react";

interface KanjiTextInputProps {
  label: string;
  id: string;
  name?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
  className?: string;
}

const KanjiTextInput = ({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  onBlur,
  className = "",
}: KanjiTextInputProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  return (
    <div className={`mb-5 ${className}`}>
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-black-900"
      >
        {label}
      </label>
      <input
        type="text"
        id={id}
        name={name || id}
        className={cn(
          `border border-black-400 text-sm rounded-lg 
        focus:ring-blue-300 focus:border-blue-500 block w-full p-2.5`,
          disabled ? "text-black-900 bg-black-100" : "text-black bg-white",
        )}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        required={required}
        disabled={disabled}
        onBlur={onBlur}
      />
    </div>
  );
};

export default KanjiTextInput;
