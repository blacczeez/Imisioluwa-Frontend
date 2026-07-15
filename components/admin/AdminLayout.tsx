'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';

const navLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/packages', label: 'Packages' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/shipping', label: 'Shipping' },
  { href: '/admin/settings', label: 'Settings' },
];

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { adminUser, adminLogout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Auto-close drawer on navigation
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const handleLogout = () => {
    adminLogout();
    router.push('/admin/login');
  };

  const isActive = (path: string) => {
    const current = pathname ?? '';
    if (path === '/admin') return current === '/admin';
    return current.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-cream">
      <nav className="bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex items-center gap-1">
              {/* Hamburger button - mobile only */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden mr-2 p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Open menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <Link href="/admin" className="font-serif text-lg text-white mr-6">
                IMISIOLUWA
              </Link>

              {/* Desktop nav links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`hidden lg:inline-flex px-3 py-1.5 rounded text-xs font-medium uppercase tracking-label transition-colors ${
                    isActive(link.href)
                      ? 'bg-white/15 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="hidden lg:inline text-white/50 hover:text-white text-xs uppercase tracking-label transition-colors"
              >
                View Store
              </Link>
              <span className="hidden lg:inline text-white/40 text-xs">|</span>
              <span className="hidden lg:inline text-white/60 text-xs">{adminUser?.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-danger/80 hover:bg-danger text-white rounded text-xs font-medium uppercase tracking-label transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${drawerOpen ? '' : 'pointer-events-none'}`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            drawerOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setDrawerOpen(false)}
        />

        {/* Panel */}
        <div
          className={`absolute inset-y-0 left-0 w-64 bg-brand-dark shadow-xl transition-transform duration-300 ease-in-out ${
            drawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between h-14 px-4 border-b border-white/10">
            <Link href="/admin" className="font-serif text-lg text-white">
              IMISIOLUWA
            </Link>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Drawer nav links */}
          <div className="flex flex-col py-2 px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-white/15 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Drawer footer */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4 space-y-3">
            <span className="block text-white/60 text-xs">{adminUser?.name}</span>
            <Link
              href="/"
              className="block text-white/50 hover:text-white text-xs uppercase tracking-label transition-colors"
            >
              View Store
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
