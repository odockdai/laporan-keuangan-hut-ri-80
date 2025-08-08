import Papa from 'papaparse';

// Semua kode Redis telah dihapus untuk penyederhanaan.

export interface Transaction {
  id: number;
  date: string;
  description: string;
  income: number;
  expense: number;
  fullDescription: string;
  imageUrl?: string;
}

interface RawTransactionData {
  id: string;
  date: string;
  description: string;
  income: string;
  expense: string;
  fullDescription: string;
  imageUrl?: string;
}

const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/153cbt4TOYo6OTh3Ez2OGcio9ZyZgiS7x479Fk5W5K8g/export?format=csv';

// Fungsi ini sekarang menjadi satu-satunya sumber pengambilan data.
// Next.js akan secara otomatis meng-cache hasilnya karena kita menggunakan fetch.
const fetchFromGoogleSheet = async (): Promise<Transaction[]> => {
  const response = await fetch(GOOGLE_SHEET_URL, {
    // Kita hanya menggunakan `tags` untuk revalidasi on-demand.
    // Tidak ada lagi `revalidate` berbasis waktu untuk mencegah konflik.
    next: { tags: ['transactions'] },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch spreadsheet: ${response.statusText}`);
  }

  const csvText = await response.text();
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      complete: (results) => {
        const cleanedData = (results.data as RawTransactionData[]).map((row) => ({
          id: parseInt(row.id, 10) || 0,
          date: row.date || '',
          description: row.description || '',
          income: parseFloat(row.income) || 0,
          expense: parseFloat(row.expense) || 0,
          fullDescription: row.fullDescription || '',
          imageUrl: row.imageUrl || undefined,
        })).filter(row => row.id !== 0);
        resolve(cleanedData as Transaction[]);
      },
      error: (error: Error) => reject(error),
    });
  });
};

// fetchTransactions sekarang hanya menjadi alias untuk kejelasan.
export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    return await fetchFromGoogleSheet();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return []; // Kembalikan array kosong jika terjadi error
  }
};

export const getTransactionById = async (id: number) => {
  const transactions = await fetchTransactions();
  return transactions.find((transaction) => transaction.id === id);
};