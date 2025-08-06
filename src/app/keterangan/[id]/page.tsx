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

export default async function Page({ params: paramsPromise }: { params: Promise<{ id: string }>; }) {
  const params = await paramsPromise;
  const transaction = await getTransactionById(parseInt(params.id, 10));

  if (!transaction) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-light text-gray-900 dark:text-gray-100 tracking-tight">
                  Detail Transaksi
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-mono">
                  {formatDate(transaction.date)}
                </p>
              </div>
              <Link 
                href="/" 
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors duration-150"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Uraian Lengkap
              </h2>
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {transaction.fullDescription}
                </p>
              </div>
            </div>

            {/* Image */}
            {transaction.imageUrl && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Bukti Transaksi
                </h2>
                <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                  <div className="relative w-full h-96 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                    <Image 
                      src={transaction.imageUrl} 
                      alt={`Nota untuk ${transaction.description}`} 
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}