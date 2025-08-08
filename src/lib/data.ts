import { cache } from 'react';
import Papa from 'papaparse';
import 'server-only';

// 1. Validasi variabel lingkungan saat build
if (!process.env.GOOGLE_SHEET_URL) {
  throw new Error('Missing GOOGLE_SHEET_URL environment variable');
}

const SHEET_URL = process.env.GOOGLE_SHEET_URL;

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

// Fungsi helper untuk membersihkan data per baris
const cleanRow = (row: RawTransactionData): Transaction => ({
  id: parseInt(row.id, 10) || 0,
  date: row.date || '',
  description: row.description || '',
  income: parseFloat(row.income) || 0,
  expense: parseFloat(row.expense) || 0,
  fullDescription: row.fullDescription || '',
  imageUrl: row.imageUrl || undefined,
});

// 2. Menggunakan cache() dari React untuk me-memoize hasil fetch dan parse
export const fetchTransactions = cache(async (): Promise<Transaction[]> => {
  console.log('Fetching and parsing Google Sheet...');
  
  // 3. Menggunakan ISR untuk revalidasi setiap 60 detik
  const response = await fetch(SHEET_URL, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch spreadsheet: ${response.statusText}`);
  }

  const csvText = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const cleanedData = (results.data as RawTransactionData[])
          .map(cleanRow)
          .filter(row => row.id !== 0);
        console.log(`Successfully parsed ${cleanedData.length} transactions.`);
        resolve(cleanedData);
      },
      error: (error: Error) => {
        console.error('PapaParse Error:', error);
        reject(error);
      },
    });
  });
});

// Fungsi ini tetap sama, tetapi sekarang akan mendapat manfaat dari cache di atas
export const getTransactionById = async (id: number) => {
  const transactions = await fetchTransactions();
  return transactions.find((transaction) => transaction.id === id);
};
