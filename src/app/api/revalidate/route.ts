import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { createClient } from 'redis';
import Papa from 'papaparse';

// Inisialisasi klien Redis
const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// ... (definisi Transaction dan RawTransactionData tetap sama)
interface Transaction {
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
const CACHE_KEY = 'transactions';

const fetchAndParseSheet = async (): Promise<Transaction[]> => {
  const response = await fetch(GOOGLE_SHEET_URL, { cache: 'no-store' });
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: Request) {
  if (!process.env.REDIS_URL) {
    return NextResponse.json({ message: 'REDIS_URL not configured' }, { status: 500 });
  }

  try {
    console.log('Webhook received. Revalidating data...');
    const transactions = await fetchAndParseSheet();

    await redisClient.connect();
    await redisClient.set(CACHE_KEY, JSON.stringify(transactions));
    await redisClient.quit();
    console.log('Cache updated successfully.');

    revalidateTag('transactions');
    console.log('Tag \'transactions\' revalidated.');

    return NextResponse.json({ revalidated: true, now: Date.now(), count: transactions.length });
  } catch (error) {
    console.error('Error in revalidation webhook:', error);
    return NextResponse.json({ message: 'Error revalidating', error: (error as Error).message }, { status: 500 });
  }
}