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

  const { totalIncome, totalExpense, finalBalance } = transactions.reduce(
    (acc, transaction) => {
      acc.totalIncome += transaction.income;
      acc.totalExpense += transaction.expense;
      acc.finalBalance = acc.totalIncome - acc.totalExpense;
      return acc;
    },
    { totalIncome: 0, totalExpense: 0, finalBalance: 0 }
  );

  useEffect(() => {
    const handleScroll = () => {
      // Trigger lebih awal untuk transisi yang lebih baik
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // Wadah dengan tinggi tetap untuk mencegah lompatan/flickering
    <div className="relative h-[260px]">

      {/* State 1: Header Besar. Diposisikan absolut dan memudar saat scroll */}
      <div className={`absolute inset-x-0 top-0 z-10 transition-opacity duration-200 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex flex-col items-center pt-6 pb-4">
          <div className="text-center">
            <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100 tracking-tight">
              Laporan Keuangan
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
              HUT RI ke-80
            </p>
          </div>
          
          {/* Metrik ditata vertikal agar selalu mobile-first */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="bg-gray-100 dark:bg-slate-800 rounded-xl px-4 py-2 text-center">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Sisa Saldo</div>
              <div className={`font-semibold text-2xl ${finalBalance >= 0 ? 'text-gray-900 dark:text-gray-100' : 'text-red-600 dark:text-red-400'}`}>
                {formatRupiah(finalBalance)}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Total Masuk</div>
                <div className="font-medium text-sm text-emerald-600 dark:text-emerald-400">{formatRupiah(totalIncome)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Total Keluar</div>
                <div className="font-medium text-sm text-red-600 dark:text-red-400">{formatRupiah(totalExpense)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* State 2: Header Ringkas (Sticky). Muncul saat scroll */}
      <div className={`fixed inset-x-0 top-0 z-50 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex justify-end items-center">
            <div className="text-right">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Sisa Saldo</div>
              <div className={`font-semibold text-lg ${finalBalance >= 0 ? 'text-gray-900 dark:text-gray-100' : 'text-red-600 dark:text-red-400'}`}>
                {formatRupiah(finalBalance)}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Header;
