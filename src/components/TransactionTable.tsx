import React from 'react';
import Link from 'next/link';
import { Transaction } from '@/lib/data';

const formatRupiah = (amount: number) => {
  return 'Rp' + amount.toLocaleString('id-ID');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Uraian
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Pemasukkan
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Pengeluaran
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Saldo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-800">
              {transactions.map((transaction, index) => {
                currentBalance += transaction.income - transaction.expense;
                return (
                  <tr 
                    key={transaction.id} 
                    className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 font-mono">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      <Link 
                        href={`/keterangan/${transaction.id}`} 
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors duration-150 font-medium block truncate"
                      >
                        {transaction.description}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono">
                      {transaction.income > 0 && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          {formatRupiah(transaction.income)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono">
                      {transaction.expense > 0 && (
                        <span className="text-red-600 dark:text-red-400 font-semibold">
                          {formatRupiah(transaction.expense)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono font-semibold">
                      <span className={`${
                        currentBalance >= 0 
                          ? 'text-gray-900 dark:text-gray-100' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {formatRupiah(currentBalance)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;