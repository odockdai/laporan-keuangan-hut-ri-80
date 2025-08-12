'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Transaction } from '@/lib/data';
import { useVirtualizer } from '@tanstack/react-virtual';

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
  const parentRef = useRef<HTMLDivElement>(null);

  const transactionsWithBalance = transactions.reduce< (Transaction & { balance: number })[] >((acc, transaction, index) => {
    const previousBalance = index > 0 ? acc[index - 1].balance : 0;
    const currentBalance = previousBalance + transaction.income - transaction.expense;
    acc.push({ ...transaction, balance: currentBalance });
    return acc;
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: transactionsWithBalance.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 88, // Perkiraan tinggi baris mobile, desktop akan menyesuaikan
    overscan: 5,
  });

  const columnConfig = [
    { id: 'date', name: 'Tanggal', width: 'w-2/12', align: 'text-left' },
    { id: 'description', name: 'Uraian', width: 'w-5/12', align: 'text-left' },
    { id: 'income', name: 'Pemasukkan', width: 'w-2/12', align: 'text-right' },
    { id: 'expense', name: 'Pengeluaran', width: 'w-2/12', align: 'text-right' },
    { id: 'balance', name: 'Saldo', width: 'w-3/12', align: 'text-right' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        {/* Header Tabel - Hanya untuk Desktop */}
        <div className="bg-gray-50 dark:bg-slate-800/50 hidden sm:flex sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800">
          {columnConfig.map(col => (
            <div key={col.id} className={`${col.width} ${col.align} px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
              {col.name}
            </div>
          ))}
        </div>

        {/* Wadah Scroll Virtualisasi */}
        <div ref={parentRef} className="overflow-y-auto" style={{ height: `calc(100vh - 340px)` }}>
          <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const transaction = transactionsWithBalance[virtualItem.index];
              return (
                <div 
                  key={transaction.id}
                  className="absolute top-0 left-0 w-full border-b border-gray-100 dark:border-gray-800/50"
                  style={{ 
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  {/* Tampilan Desktop (sm dan lebih besar) */}
                  <div className="hidden sm:flex h-full items-center">
                    <div className={`${columnConfig[0].width} ${columnConfig[0].align} px-4 text-sm text-gray-600 dark:text-gray-300 font-mono`}>{formatDate(transaction.date)}</div>
                    <div className={`${columnConfig[1].width} ${columnConfig[1].align} px-4 text-sm text-gray-900 dark:text-gray-100 truncate`}>
                      <Link href={`/keterangan/${transaction.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline">
                        {transaction.description}
                      </Link>
                    </div>
                    <div className={`${columnConfig[2].width} ${columnConfig[2].align} px-4 text-sm font-mono`}>
                      {transaction.income > 0 && <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{formatRupiah(transaction.income)}</span>}
                    </div>
                    <div className={`${columnConfig[3].width} ${columnConfig[3].align} px-4 text-sm font-mono`}>
                      {transaction.expense > 0 && <span className="text-red-600 dark:text-red-400 font-semibold">{formatRupiah(transaction.expense)}</span>}
                    </div>
                    <div className={`${columnConfig[4].width} ${columnConfig[4].align} px-4 text-sm font-mono font-semibold`}>
                      <span className={transaction.balance >= 0 ? 'text-gray-900 dark:text-gray-100' : 'text-red-600 dark:text-red-400'}>{formatRupiah(transaction.balance)}</span>
                    </div>
                  </div>

                  {/* Tampilan Mobile (di bawah sm) */}
                  <div className="sm:hidden flex flex-col justify-center h-full p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Link href={`/keterangan/${transaction.id}`} className="text-base font-semibold text-gray-900 dark:text-gray-100 pr-2 truncate">
                        {transaction.description}
                      </Link>
                      <div className={`text-base font-semibold shrink-0 ${transaction.balance >= 0 ? 'text-gray-900 dark:text-gray-100' : 'text-red-600 dark:text-red-400'}`}>
                        {formatRupiah(transaction.balance)}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 font-mono">
                      <div>{formatDate(transaction.date)}</div>
                      <div className="flex gap-4">
                        {transaction.income > 0 && <span className="text-emerald-500">▲ {formatRupiah(transaction.income)}</span>}
                        {transaction.expense > 0 && <span className="text-red-500">▼ {formatRupiah(transaction.expense)}</span>}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
