"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/aboutUs", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false); // close on route change
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left - Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/Bee.png" alt="PlanBee Logo" width={32} height={32} />
          <span className="text-xl font-bold tracking-tight text-gray-900">
            PlanBee
          </span>
        </Link>

        {/* Center - Links (desktop) */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors hover:text-gray-900 ${
                pathname === l.href ? "text-gray-900" : "text-gray-600"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right - Buttons (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/signin"
            className="rounded-xl border px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-[#70A961] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5f8c4b]"
          >
            Get started
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          aria-label="Toggle menu"
          className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-gray-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div className="border-t bg-white md:hidden">
          <div className="flex flex-col gap-2 px-4 py-3">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-2 py-2 text-sm font-medium ${
                  pathname === l.href
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Link
                href="/signin"
                className="flex-1 rounded-lg border px-3 py-2 text-center text-sm font-semibold"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="flex-1 rounded-lg bg-[#70A961] px-3 py-2 text-center text-sm font-semibold text-white"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
