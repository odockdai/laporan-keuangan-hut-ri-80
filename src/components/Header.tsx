'use client';

import React, { useState, useEffect } from 'react';
import { Transaction } from '@/lib/data';

const formatRupiah = (amount: number) => {
  return 'Rp' + amount.toLocaleString('id-ID').replace(/,/g, '.');
};

interface HeaderProps {
  transactions: Transaction[];
}

const Header = ({ transactions }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const totalBalance = transactions.reduce((acc, transaction) => {
    return acc + transaction.income - transaction.expense;
  }, 0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-300 ${isScrolled ? 'py-4' : 'py-8'}`}>
          {/* Compact header when scrolled */}
          {isScrolled ? (
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Laporan Keuangan HUT RI ke-80
                </h1>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Total Saldo
                </div>
                <div className={`text-lg font-semibold ${
                  totalBalance >= 0 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatRupiah(totalBalance)}
                </div>
              </div>
            </div>
          ) : (
            /* Full header when at top */
            <div className="text-center">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 dark:text-gray-100 tracking-tight">
                  Laporan Keuangan
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-light">
                  HUT RI ke-80
                </p>
              </div>
              
              <div className="mt-8 inline-flex items-center justify-center">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl px-6 py-4 border border-gray-200 dark:border-gray-700">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Total Saldo
                  </div>
                  <div className={`text-2xl sm:text-3xl font-semibold ${
                    totalBalance >= 0 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatRupiah(totalBalance)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;