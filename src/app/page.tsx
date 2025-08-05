
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TransactionTable from '@/components/TransactionTable';
import { fetchTransactions } from '@/lib/data';

export default async function Home() {
  const transactions = await fetchTransactions();

  return (
    <div className="min-h-screen flex flex-col">
      <Header transactions={transactions} />
      <main className="flex-grow">
        <TransactionTable transactions={transactions} />
      </main>
      <Footer />
    </div>
  );
}
