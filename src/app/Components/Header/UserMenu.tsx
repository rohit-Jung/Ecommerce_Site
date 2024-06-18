"use client";
import React, { useCallback, useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import Avatar from "../Avatar";
import Link from "next/link";
import MenuItems from "./MenuItems";
import { signOut } from "next-auth/react";
import BackDrop from "./BackDrop";
import { SafeUser } from "@/types";

interface UserMenuProps {
  currentUser: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);

  // console.log("user >>", currentUser);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);
  return (
    <>
      <div className="relative z-30">
        <div
          className="border-[1px] p-2 border-slate-400 flex flex-row items-center gap-1 rounded-full cursor-pointer hover:shadow-md transition text-slate-700"
          onClick={toggleOpen}
        >
          <Avatar src={currentUser?.image}/>
          <AiFillCaretDown />
        </div>
        {isOpen && (
          <div className="absolute rounded-md shadow-md w-[170px] bg-white overflow-hidden right-0 top-12 text-sm flex flex-col cursor-pointer">
            {currentUser ? (
              <div>
                <Link href={"/orders"}>
                  <MenuItems onClick={toggleOpen}>Your Orders</MenuItems>
                </Link>
                <Link href={"/admin"}>
                  <MenuItems onClick={toggleOpen}>Admin Dashboard</MenuItems>
                </Link>
                <Link href={"/"}>
                  <MenuItems
                    onClick={() => {
                      toggleOpen();
                      signOut();
                    }}
                  >
                    Log Out
                  </MenuItems>
                </Link>
              </div>
            ) : (
              <div>
                <Link href={"/login"}>
                  <MenuItems onClick={toggleOpen}>Log in</MenuItems>
                </Link>
                <Link href={"/register"}>
                  <MenuItems onClick={toggleOpen}>Register</MenuItems>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      {isOpen && <BackDrop onClick={toggleOpen} />}
    </>
  );
};

export default UserMenu;
