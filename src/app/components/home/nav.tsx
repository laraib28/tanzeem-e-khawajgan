import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  return (
    <main className="bg-transparent flex items-center px-8 py-2 h-[59] w-full relative z-50">
      {/* Left Side: Logo + Navigation */}
      <div className="flex items-center gap-x-12">
        {/* Logo */}
        <div className="flex items-center .flex-shrink-0">
          <Image src="/logo.jpg" alt="logo" width={50} height={50} className="w-[50px] h-[50px]" />
        </div>

        {/* Navigation */}
        <nav className="flex items-center">
          <ul className="flex gap-x-6 items-center font-bold">
            <li >
              <Link href="/" className="hover:text-[#1F816F]">Home</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#1F816F]">About</Link>
            </li>
            <li>
              <Link href="/goals" className="hover:text-[#1F816F]">Goals</Link>
            </li>
            <li>
              <Link href="/mission" className="hover:text-[#1F816F]">Mission</Link>
            </li>
            <li>
              <Link href="/donate" className="hover:text-[#1F816F]">Donate</Link>
            </li>
             <li >
              <Link href="/events" className="hover:text-[#1F816F]">Events</Link>
            </li>
            <li>
              <Link href="/iT" className="hover:text-[#1F816F]">IT</Link>
            </li>
            <li>
              <Link href="/membership" className="hover:text-[#1F816F]">Membership</Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-[#1F816F]">Gallery</Link>
            </li>
            <li>
              <Link href="/contact us" className="hover:text-[#1F816F]">ContactUs</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Right Side: Donate Button - Centered in green area */}
      <div className="ml-auto flex justify-center" style={{width: '45%'}}>
        <button className="bg-[#F59E0B] text-white px-6 py-2 rounded-full hover:bg-[#E17153] transition">
          Donate Now
        </button>
      </div>
    </main>
  );
}