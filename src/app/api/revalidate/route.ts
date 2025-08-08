import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { kv } from '@vercel/kv';
import Papa from 'papaparse';

// Definisi tipe data, disalin dari lib/data.ts untuk kemandirian
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

// Fungsi ini di-copy dari lib/data.ts untuk memastikan endpoint ini mandiri
const fetchAndParseSheet = async (): Promise<Transaction[]> => {
  const response = await fetch(GOOGLE_SHEET_URL, { cache: 'no-store' }); // Selalu ambil yang terbaru
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
      error: (error: Error) => {
        reject(error);
      },
    });
  });
};

export async function GET(_request: Request) {
  try {
    console.log('Webhook received. Revalidating data...');

    // 1. Ambil data terbaru dari Google Sheet
    const transactions = await fetchAndParseSheet();

    // 2. Simpan data baru ke dalam Vercel KV (overwrite yang lama)
    await kv.set(CACHE_KEY, transactions);
    console.log('Cache updated successfully.');

    // 3. Picu revalidasi untuk halaman utama
    revalidatePath('/');
    console.log('Path / revalidated.');

    return NextResponse.json({ revalidated: true, now: Date.now(), count: transactions.length });
  } catch (error) {
    console.error('Error in revalidation webhook:', error);
    return NextResponse.json({ message: 'Error revalidating', error: (error as Error).message }, { status: 500 });
  }
}
