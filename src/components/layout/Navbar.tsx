'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Menu, X, Sun, Moon, Search, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/store/useCart';
import { useAuth } from '@/store/useAuth';
import { Button } from '@/components/ui/button';
import { CartDrawer } from '../shop/CartDrawer';
import { AuthModal } from '../auth/AuthModal';

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const cartCount = useCart((state) => state.getCartCount());
  const user = useAuth((state) => state.user);


  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Theme Toggle
  useEffect(() => {
    const isLocalDark = localStorage.getItem('theme') === 'dark';
    if (isLocalDark) {
      document.documentElement.classList.add('dark');
    }
    setTimeout(() => {
      setIsDark(isLocalDark);
    }, 0);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/shop' },
    { name: 'Food Lab', href: '/food-lab' },
    { name: 'Wellness', href: '/wellness' },
    { name: 'Our Story', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <>
      <header className={`fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 transition-all duration-300 pointer-events-none`}>
        <div className={`pointer-events-auto mx-auto max-w-7xl bg-white/95 backdrop-blur-md rounded-2xl md:rounded-full border border-gray-200/60 shadow-md flex items-center justify-between py-3 px-3 sm:px-6 md:px-8 transition-all duration-300 ${isScrolled ? 'py-2.5 shadow-lg' : ''}`}>
          
          {/* Left: Brand Name / Logo */}
          <Link
            href="/"
            className="group select-none flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none"
            style={{ textDecoration: 'none' }}
          >
            {/* Leaf Icon & Text Stack inside a flex row */}
            <div className="flex flex-col items-center justify-center flex-shrink-0">
              {/* Leaf Icon */}
              <div className="w-5 h-5 mb-0.5 transition-transform duration-300 ease-in-out group-hover:scale-110">
                <svg
                  viewBox="0 0 24 24"
                  className="w-auto h-full fill-[#1e3b26]"
                  style={{ color: '#1e3b26' }}
                >
                  <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L7,18.06C8.8,19.16 11.23,19.34 13.88,18.58C18.95,17.13 22,12.3 22,8C22,3.7 20,2 20,2C20,2 18,3 17,8M12.44,14.63C11.89,15.18 10.74,15.72 9.47,15.13L15.35,9.25C15.65,9.7 15.65,10.33 15.18,10.8L12.44,14.63Z" />
                </svg>
              </div>

              {/* Text Stack */}
              <div className="flex flex-col items-center justify-center leading-none">
                {/* RAINBOW */}
                <span className="font-brand font-black text-base tracking-[0.05em] uppercase text-[#1e3b26]">
                  Rainbow
                </span>

                {/* ENTERPRISES */}
                <span className="font-display text-[7px] font-black tracking-[0.38em] uppercase text-[#b08953] mt-0.5 pl-[0.38em]">
                  Enterprises
                </span>
              </div>
            </div>

            {/* Tagline (Desktop only) */}
            <div className="hidden lg:flex flex-col justify-center border-l border-gray-200 pl-3 h-8">
              <span className="font-sans text-[9px] font-bold text-[#1e3b26]/75 uppercase tracking-wide leading-tight">
                Bringing Authentic
              </span>
              <span className="font-sans text-[9px] font-bold text-[#1e3b26]/75 uppercase tracking-wide leading-tight">
                RootsVeyr Products to You
              </span>
            </div>
          </Link>

          {/* Center: Nav Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[13px] font-extrabold tracking-wide transition-colors duration-200 relative py-1.5 whitespace-nowrap ${
                    isActive
                      ? 'text-[#1e3b26]'
                      : 'text-gray-500 hover:text-[#1e3b26]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#1e3b26] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <Link href="/shop">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-[#1e3b26]/5 rounded-full text-gray-700 hover:text-[#1e3b26] h-8.5 w-8.5 cursor-pointer animate-none"
              >
                <Search className="h-4.5 w-4.5" />
              </Button>
            </Link>

            {/* Account / Login */}
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="hover:bg-[#1e3b26]/10 rounded-full text-[#1e3b26] h-8.5 w-8.5 font-bold text-xs bg-[#1e3b26]/5 border border-[#1e3b26]/10 flex items-center justify-center cursor-pointer select-none p-0"
                >
                  {getInitials(user.name)}
                </Button>
                
                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      {/* Invisible backdrop to close dropdown */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-3 w-64 bg-white dark:bg-card border border-gray-200/60 dark:border-border rounded-2xl shadow-xl z-50 p-4 space-y-3"
                      >
                        <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-border">
                          <div className="w-10 h-10 rounded-full bg-[#1e3b26]/10 text-[#1e3b26] font-black text-sm flex items-center justify-center">
                            {getInitials(user.name)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold truncate leading-tight text-gray-900">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate leading-tight mt-1">{user.email}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          {user.isAdmin ? (
                            <Link 
                              href="/admin/dashboard"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-amber-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                              style={{ textDecoration: 'none' }}
                            >
                              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                              Admin Dashboard
                            </Link>
                          ) : (
                            <Link 
                              href="/dashboard"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-[#1e3b26]/5 hover:text-[#1e3b26] transition-colors"
                              style={{ textDecoration: 'none' }}
                            >
                              <User className="h-4 w-4 text-[#1e3b26]" />
                              My Dashboard
                            </Link>
                          )}
                        </div>
                        
                        <div className="pt-2 border-t border-gray-100 dark:border-border">
                          <button
                            onClick={async () => {
                              setIsProfileOpen(false);
                              await useAuth.getState().logout();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/5 transition-colors text-left border-none bg-transparent cursor-pointer"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAuthOpen(true)}
                className="hover:bg-[#1e3b26]/5 rounded-full text-gray-700 hover:text-[#1e3b26] h-8.5 w-8.5 cursor-pointer"
              >
                <User className="h-4.5 w-4.5" />
              </Button>
            )}

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCartOpen(true)}
              className="hover:bg-[#1e3b26]/5 rounded-full text-gray-700 hover:text-[#1e3b26] relative h-8.5 w-8.5 cursor-pointer"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            </Button>

            {/* Theme Toggle (optional but hidden on mobile/tablet) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-[#1e3b26]/5 rounded-full text-gray-700 hover:text-[#1e3b26] h-8.5 w-8.5 hidden md:flex cursor-pointer"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-500" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile menu toggle — only visible on small screens */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden hover:bg-[#1e3b26]/5 rounded-full text-gray-700 hover:text-[#1e3b26] h-8.5 w-8.5 cursor-pointer animate-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
            />
            {/* Animated Menu Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed top-20 left-4 right-4 z-40 md:hidden rounded-2xl border border-gray-200/60 bg-white shadow-xl px-4 py-4"
            >
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-sm font-extrabold transition-colors ${
                        isActive
                          ? 'bg-[#1e3b26]/10 text-[#1e3b26]'
                          : 'text-gray-700 hover:bg-[#1e3b26]/5 hover:text-[#1e3b26]'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}

