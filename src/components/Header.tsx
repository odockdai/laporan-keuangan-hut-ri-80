import React from 'react';
import { Transaction } from '@/lib/data';

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

interface HeaderProps {
  transactions: Transaction[];
}

const Header = ({ transactions }: HeaderProps) => {
  const totalBalance = transactions.reduce((acc, transaction) => {
    return acc + transaction.income - transaction.expense;
  }, 0);

  return (
    <header className="py-6 bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Laporan Keuangan HUT RI ke-80</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Panitia Penyelenggara</p>
        <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-4">Total Saldo: {formatRupiah(totalBalance)}</p>
      </div>
    </header>
  );
};

export default Header;