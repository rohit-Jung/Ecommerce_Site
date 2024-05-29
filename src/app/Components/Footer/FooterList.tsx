import React from "react";

interface FooterProps {
  children: React.ReactNode;
}

const FooterList: React.FC<FooterProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full mb-6 sm:w-1/2 md:w-1/3 lg:w-1/6 gap-2">
      {children}
    </div>
  );
};

export default FooterList;
