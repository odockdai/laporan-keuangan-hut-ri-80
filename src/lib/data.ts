
import Papa from 'papaparse';

export interface Transaction {
  id: number;
  date: string;
  description: string;
  income: number;
  expense: number;
  fullDescription: string;
  imageUrl?: string;
}

// Interface untuk data mentah yang diterima dari PapaParse
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

export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await fetch(GOOGLE_SHEET_URL, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch spreadsheet: ${response.statusText}`);
    }
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: false, // Set false agar kita bisa mengelola parsing tipe secara manual
        skipEmptyLines: true,
        complete: (results) => {
          // Membersihkan dan memvalidasi data
          const cleanedData = (results.data as RawTransactionData[]).map((row) => ({
            id: parseInt(row.id, 10) || 0,
            date: row.date || '',
            description: row.description || '',
            income: parseFloat(row.income) || 0,
            expense: parseFloat(row.expense) || 0,
            fullDescription: row.fullDescription || '',
            imageUrl: row.imageUrl || undefined,
          })).filter(row => row.id !== 0); // Filter baris yang ID-nya tidak valid
          
          resolve(cleanedData as Transaction[]);
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    return []; // Kembalikan array kosong jika terjadi error
  }
};

// Fungsi ini sekarang akan mengambil data dari Google Sheets
export const getTransactionById = async (id: number) => {
  const transactions = await fetchTransactions();
  return transactions.find((transaction) => transaction.id === id);
};
