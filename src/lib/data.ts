import Papa from 'papaparse';
import { createClient } from 'redis';

// Inisialisasi klien Redis
// Klien akan secara otomatis menggunakan variabel lingkungan REDIS_URL
const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export interface Transaction {
  id: number;
  date: string;
  description: string;
  income: number;
  expense: number;
  fullDescription: string;
  imageUrl?: string;
}

// ... (definisi RawTransactionData tetap sama)
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
const CACHE_KEY = 'transactions';

const fetchFromGoogleSheet = async (): Promise<Transaction[]> => {
  const response = await fetch(GOOGLE_SHEET_URL, { next: { revalidate: 60, tags: ['transactions'] } });
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

export const fetchTransactions = async (): Promise<Transaction[]> => {
  if (!process.env.REDIS_URL) {
    console.log('REDIS_URL not found, fetching directly from Google Sheet.');
    return fetchFromGoogleSheet();
  }

  try {
    await redisClient.connect();
    const cachedTransactions = await redisClient.get(CACHE_KEY);
    await redisClient.quit();

    if (cachedTransactions) {
      console.log('Cache hit!');
      return JSON.parse(cachedTransactions);
    }

    console.log('Cache miss. Fetching from Google Sheet...');
    const transactions = await fetchFromGoogleSheet();
    
    await redisClient.connect();
    await redisClient.set(CACHE_KEY, JSON.stringify(transactions));
    await redisClient.quit();

    return transactions;
  } catch (error) {
    console.error("Error in fetchTransactions:", error);
    // Fallback ke pengambilan langsung jika Redis gagal
    return fetchFromGoogleSheet();
  }
};

export const getTransactionById = async (id: number) => {
  const transactions = await fetchTransactions();
  return transactions.find((transaction) => transaction.id === id);
};
