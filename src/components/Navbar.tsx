'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getAuthUser, clearAuth } from '@/utils/auth';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const user = getAuthUser();

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const isActivePath = (path: string) => pathname === path;

  return (
    <nav className="bg-primary-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-white text-xl font-bold flex items-center">
                <CurrencyDollarIcon className="h-6 w-6 mr-2" />
                Personal Finance Manager
              </Link>
            </div>
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActivePath('/')
                      ? 'border-white text-white'
                      : 'border-transparent text-primary-200 hover:border-primary-300 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/transactions"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActivePath('/transactions')
                      ? 'border-white text-white'
                      : 'border-transparent text-primary-200 hover:border-primary-300 hover:text-white'
                  }`}
                >
                  Transactions
                </Link>
              </div>
            )}
          </div>
          {user && (
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="flex items-center space-x-4">
                <span className="text-primary-200 text-sm">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-primary-700 hover:bg-primary-800 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary-200 hover:text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && user && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActivePath('/')
                  ? 'bg-primary-700 border-primary-300 text-white'
                  : 'border-transparent text-primary-200 hover:bg-primary-700 hover:border-primary-300 hover:text-white'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/transactions"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActivePath('/transactions')
                  ? 'bg-primary-700 border-primary-300 text-white'
                  : 'border-transparent text-primary-200 hover:bg-primary-700 hover:border-primary-300 hover:text-white'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Transactions
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-primary-700">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{user.name}</div>
                <div className="text-sm font-medium text-primary-300">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-base font-medium text-primary-200 hover:text-white hover:bg-primary-700 w-full text-left"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}