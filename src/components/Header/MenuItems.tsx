import React from "react";

interface MenuItemsProps {
  children: React.ReactNode;
  onClick: () => void;
}
const MenuItems: React.FC<MenuItemsProps> = ({ children, onClick }) => {
  return (
    <div
      className="px-4 py-3 hover:bg-neutral-100 transition"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default MenuItems;
