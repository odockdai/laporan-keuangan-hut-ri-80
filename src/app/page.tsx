
import { Suspense } from 'react';
import Header from '@/components/Header';
import TransactionTable from '@/components/TransactionTable';
import TransactionTableSkeleton from '@/components/TransactionTableSkeleton';
import { fetchTransactions } from '@/lib/data';

export default async function Home() {
  const transactions = await fetchTransactions();

  return (
    <div className="min-h-screen flex flex-col">
      <Header transactions={transactions} />
      <main className="flex-grow">
        <Suspense fallback={<TransactionTableSkeleton />}>
          <TransactionTable transactions={transactions} />
        </Suspense>
      </main>
    </div>
  );
}
