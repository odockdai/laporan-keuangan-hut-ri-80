
import React from 'react';
import Link from 'next/link';
import { Transaction } from '@/lib/data';

const formatRupiah = (amount: number) => {
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
  return formatted.replace('Rp ', 'Rp');
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable = ({ transactions }: TransactionTableProps) => {
  let currentBalance = 0;

  return (
    <div className="container mx-auto px-4 mt-8">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#1A362F] border border-gray-200 dark:border-gray-700 rounded-lg shadow table-fixed">
          <thead className="bg-[#132621]">
            <tr>
              <th className="py-3 px-4 border-b dark:border-gray-600 text-left text-sm font-semibold text-[#E0F2F1] w-[120px]">Tanggal</th>
              <th className="py-3 px-4 border-b dark:border-gray-600 text-left text-sm font-semibold text-[#E0F2F1] w-2/5">Uraian</th>
              <th className="py-3 px-4 border-b dark:border-gray-600 text-right text-sm font-semibold text-[#E0F2F1]">Pemasukkan</th>
              <th className="py-3 px-4 border-b dark:border-gray-600 text-right text-sm font-semibold text-[#E0F2F1]">Pengeluaran</th>
              <th className="py-3 px-4 border-b dark:border-gray-600 text-right text-sm font-semibold text-[#E0F2F1]">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              currentBalance += transaction.income - transaction.expense;
              return (
                <tr key={transaction.id} className="hover:bg-[#2D4A42]">
                  <td className="py-3 px-4 border-b dark:border-gray-600 text-[#E0F2F1] whitespace-nowrap">{formatDate(transaction.date)}</td>
                  <td className="py-3 px-4 border-b dark:border-gray-600 text-gray-800 dark:text-gray-200 whitespace-nowrap overflow-hidden text-ellipsis">
                    <Link href={`/keterangan/${transaction.id}`} className="text-[#90CAF9] hover:underline">
                      {transaction.description}
                    </Link>
                  </td>
                  <td className="py-3 px-4 border-b dark:border-gray-600 text-right text-[#81C784]">{formatRupiah(transaction.income)}</td>
                  <td className="py-3 px-4 border-b dark:border-gray-600 text-right text-[#EF9A9A]">{formatRupiah(transaction.expense)}</td>
                  <td className="py-3 px-4 border-b dark:border-gray-600 text-right font-medium text-[#E0F2F1]">{formatRupiah(currentBalance)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
