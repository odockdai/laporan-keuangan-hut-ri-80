import React from 'react';
import { Transaction } from '@/lib/data';

const formatRupiah = (amount: number) => {
  return 'Rp' + amount.toLocaleString('id-ID');
};

interface HeaderProps {
  transactions: Transaction[];
}

const Header = ({ transactions }: HeaderProps) => {
  const totalBalance = transactions.reduce((acc, transaction) => {
    return acc + transaction.income - transaction.expense;
  }, 0);

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 dark:text-gray-100 tracking-tight">
              Laporan Keuangan
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-light">
              HUT RI ke-80
            </p>
          </div>
          
          <div className="mt-8 inline-flex items-center justify-center">
            <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl px-6 py-4 border border-gray-200 dark:border-gray-700">
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
      </div>
    </header>
  );
};

export default Header;