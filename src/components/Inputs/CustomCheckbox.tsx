"use client";
import React from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface CustomCheckboxProps {
  id: string;
  label: string;
  disabled?: boolean;
  register: UseFormRegister<FieldValues>;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  id,
  label,
  disabled,
  register,
}) => {
  return (
    <div className="w-full flex flex-row gap-2 items-center">
      <input
        type="checkbox"
        id={id}
        disabled={disabled}
        {...register(id)}
        className="cursor-pointer"
      />

      <label htmlFor={id} className="cursor-pointer font-medium">
        {label}
      </label>
    </div>
  );
};

export default CustomCheckbox;
