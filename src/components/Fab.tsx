'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const menuItems = [
  { href: '/acara', label: 'Susunan Acara', icon: '/icons/calendar.svg' },
  { href: '/dokumentasi', label: 'Dokumentasi', icon: '/icons/camera.svg' },
  { href: '/pamflet', label: 'Pamflet Jalan Sehat', icon: '/icons/ticket.svg' },
];

const Fab = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFabVisible, setIsFabVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        // Scrolling down
        setIsFabVisible(false);
      } else {
        // Scrolling up
        setIsFabVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Scrim (background overlay) */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMenu}
      />

      {/* Bottom Sheet Menu */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 rounded-t-2xl shadow-2xl transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="p-4">
          <button onClick={toggleMenu} className="absolute top-3 right-3 p-2 text-gray-500 dark:text-gray-400">
            <Image src="/icons/x-mark.svg" alt="Tutup" width={24} height={24} />
          </button>
          <h2 className="text-lg font-semibold text-center text-gray-900 dark:text-gray-100 mb-4">Menu</h2>
          <nav>
            <ul>
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={toggleMenu} className="flex items-center p-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                    <Image src={item.icon} alt="" width={24} height={24} className="mr-4" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={toggleMenu}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out transform ${
          isFabVisible ? 'scale-100' : 'scale-0'
        } ${isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100'}`}
      >
        <Image src="/icons/menu.svg" alt="Menu" width={28} height={28} />
      </button>
    </>
  );
};

export default Fab;
