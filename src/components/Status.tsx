"use client";

import { FC } from "react";
import { IconType } from "react-icons";

interface StatusProps {
  text: string;
  icon: IconType;
  bg: string;
  color: string;
}

const Status: FC<StatusProps> = ({ text, icon: Icon, bg, color }) => {
  return (
    <>
      <div
        className={`${bg} ${color} px-2 py-1 rounded flex items-center gap-1`}
      >
        <div className="leading-none">{text}</div> 
        <Icon size={15} />
      </div>
    </>
  );
};

export default Status;
