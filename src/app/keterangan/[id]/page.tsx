import { getTransactionById } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default async function KeteranganPage({ params }: { params: { id: string } }) {
  const transaction = await getTransactionById(parseInt(params.id, 10));

  if (!transaction) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Keterangan Transaksi</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tanggal: {formatDate(transaction.date)}</p>
        
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Uraian:</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{transaction.fullDescription}</p>
        </div>

        {transaction.imageUrl && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Bukti Transaksi:</h2>
            <div className="mt-2 relative w-full h-96 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
              <Image 
                src={transaction.imageUrl} 
                alt={`Nota untuk ${transaction.description}`} 
                layout="fill" 
                objectFit="contain"
              />
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
            &larr; Kembali ke Laporan
          </Link>
        </div>
      </div>
    </div>
  );
}