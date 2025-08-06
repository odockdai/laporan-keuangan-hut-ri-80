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
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-[210px]">

      {/* State 1: Header Besar. */}
      <div className={`absolute inset-x-0 top-0 z-10 transition-opacity duration-200 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex flex-col items-center pt-8 pb-6">
          <div className="text-center">
            <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100 tracking-tight">
              Laporan Keuangan
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
              HUT RI ke-80
            </p>
          </div>
          <div className="mt-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 px-6 py-3 shadow-lg">
              <div className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Saldo
              </div>
              <div className={`font-semibold text-3xl ${totalBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatRupiah(totalBalance)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* State 2: Header Ringkas (Sticky). Dibuat solid untuk tes performa. */}
      <div className={`fixed inset-x-0 top-0 z-50 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Menghapus backdrop-blur untuk tes. Menggunakan background solid. */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex justify-end items-center">
            <div className="text-right">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Saldo</div>
              <div className={`font-semibold text-lg ${totalBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatRupiah(totalBalance)}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Header;