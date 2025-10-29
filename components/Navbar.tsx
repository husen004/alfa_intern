'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-foreground text-background shadow-md">
      <div className="wrapper">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            Product Store
          </Link>
          <div className="flex gap-6">
            <Link
              href="/"
              className={`hover:opacity-80 transition-opacity ${
                isActive('/') ? 'font-bold underline' : ''
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`hover:opacity-80 transition-opacity ${
                isActive('/products') ? 'font-bold underline' : ''
              }`}
            >
              Products
            </Link>
            <Link
              href="/create-product"
              className={`hover:opacity-80 transition-opacity ${
                isActive('/create-product') ? 'font-bold underline' : ''
              }`}
            >
              Create Product
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
