import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 shadow-md bg-white">
      {/* Left - Logo */}
      <div className="flex items-center space-x-2">
        <img src="/Bee.png" alt="PlanBee Logo" className="h-8 w-8" />
        <span className="text-xl font-bold text-gray-800">PlanBee</span>
      </div>

      {/* Center - Links */}
      <div className="hidden md:flex space-x-8">
        <Link href="/" className="text-gray-700 hover:text-black font-medium">
          Home
        </Link>
        <Link href="/about" className="text-gray-700 hover:text-black font-medium">
          About Us
        </Link>
      </div>

      {/* Right - Buttons */}
      <div className="flex space-x-4">
        <Link
            href="/signin"
            className="px-4 py-2 rounded-md text-white bg-[#70A961] hover:bg-[#5f8c4b] transition-colors duration-300"
        >
            Sign In
        </Link>

        <Link
            href="/signup"
            className="px-4 py-2 rounded-md text-white bg-[#70A961] hover:bg-[#5f8c4b] transition-colors duration-300"
        >
            Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
