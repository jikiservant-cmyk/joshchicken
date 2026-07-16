import { NextResponse } from 'next/server';
import { products } from '@/data/products';

export async function GET() {
  // Simulate network delay for full-stack feel
  await new Promise((resolve) => setTimeout(resolve, 300));
  return NextResponse.json(products);
}
