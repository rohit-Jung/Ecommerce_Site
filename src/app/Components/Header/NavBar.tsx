import React from "react";
import Container from "../Container";
import Link from "next/link";
import { Redressed } from "next/font/google";

const redressed = Redressed({
  subsets: ["latin"],
  weight: ['400']
});

const NavBar = () => {
  return (
    <div className="sticky top-0 shadow-sm w-full z-30 bg-slate-200">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex justify-between items-center gap-3 md:gap-0">
            <Link href="/" className={`${redressed.className} font-bold text-2xl`}>E-Shop</Link>
            <div className="hidden md:block">Search</div>
            <div className="flex items-center gap-8 md:gap-12">
              <div>Cart</div>
              <div>Menu</div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default NavBar;
