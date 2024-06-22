"use client";

import { FC, MouseEvent } from "react";
import { IconType } from "react-icons";

interface ActionBtnProps {
  icon: IconType;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const ActionBtn: FC<ActionBtnProps> = ({ icon: Icon, onClick, disabled }) => {
  return (
    <>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center size-[40px] text-slate-700 rounded cursor-pointer border border-slate-400 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <Icon size={18} />
      </button>
    </>
  );
};

export default ActionBtn;
