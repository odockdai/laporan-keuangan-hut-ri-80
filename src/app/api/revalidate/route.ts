import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

// Webhook ini sekarang sangat sederhana. Tugasnya hanya satu:
// Memberitahu Next.js untuk membersihkan cache dengan tag 'transactions'.
export async function GET() {
  try {
    console.log('Webhook received. Revalidating tag: transactions...');
    revalidateTag('transactions');
    console.log('Tag \'transactions\' revalidated successfully.');

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    console.error('Error in revalidation webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error revalidating', error: errorMessage }, { status: 500 });
  }
}
