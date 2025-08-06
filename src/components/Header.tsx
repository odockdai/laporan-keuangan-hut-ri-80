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
    <header className="py-6 bg-[#1A362F] shadow-md">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl font-bold text-[#E0F2F1]">Laporan Keuangan</h1>
        <h1 className="text-3xl font-bold text-[#E0F2F1]">HUT RI ke-80</h1>
        <p className="text-xl font-bold text-[#E0F2F1] mt-4">Total Saldo: {formatRupiah(totalBalance)}</p>
      </div>
    </header>
  );
};

export default Header;