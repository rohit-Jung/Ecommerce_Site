import React from "react";
import Container from "../Container";
import FooterList from "./FooterList";
import Link from "next/link";
import { MdFacebook } from "react-icons/md";
import { AiFillInstagram, AiFillTwitterCircle, AiFillYoutube } from "react-icons/ai";

const Footer = () => {
  return (
    <footer className="bg-slate-700 text-slate-200 text-sm mt-16">
      <Container>
        <div className="flex flex-col md:flex-row justify-between pt-16 pb-8">
          <FooterList>
            <h3 className="text-base font-bold mb-2">Shop Categories</h3>
            <Link href="#">Phones</Link>
            <Link href="#">Laptops</Link>
            <Link href="#">Desktops</Link>
            <Link href="#">Watches</Link>
            <Link href="#">TVs</Link>
            <Link href="#">Accessories</Link>
          </FooterList>
          <FooterList>
            <h3 className="text-base font-bold mb-2">Customer Services</h3>
            <Link href="#">Contact Us</Link>
            <Link href="#">Shipping Policy</Link>
            <Link href="#">Returns and Exchanges</Link>
            <Link href="#">FAQs</Link>
          </FooterList>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-base font-bold mb-2">About us</h3>
            <p className="mb-2">
              At our electronics store, we are dedicated to Lorem ipsum dolor
              sit, amet consectetur adipisicing elit. Suscipit dicta vel,
              temporibus reprehenderit earum, unde tempora amet eius, placeat
              obcaecati beatae. Nobis, laudantium sequi tenetur voluptatem
              quidem ex id debitis?
            </p>
            <p>
              &copy; {new Date().getFullYear()} E-Shop. All rights reserved.
            </p>
          </div>
          <FooterList>
            <h3 className="text-base font-bold mb-2">Follow us</h3>
            <div className="flex gap-2">
              <Link href="#">
                <MdFacebook size={24}>  </MdFacebook>
              </Link>
              <Link href="#">
                <AiFillTwitterCircle size={24}>  </AiFillTwitterCircle>
              </Link>
              <Link href="#">
                <AiFillInstagram size={24}>  </AiFillInstagram>
              </Link>
              <Link href="#">
                <AiFillYoutube size={24}>  </AiFillYoutube>
              </Link>
            </div>
          </FooterList>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
