import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-gray-600 md:flex-row md:px-6">
        <div className="flex items-center gap-2">
          <Image src="/Bee.png" alt="PlanBee" width={20} height={20} />
          <span>© {new Date().getFullYear()} PlanBee</span>
        </div>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-gray-900">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-gray-900">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-gray-900">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;